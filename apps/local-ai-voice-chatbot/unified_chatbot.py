'''
    Eigo Master - Unified AI Voice Chatbot
    Integrated Text-to-Text, Text-to-Speech, and Speech-to-Speech
'''

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from kokoro import KPipeline
from pydub import AudioSegment
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import io
import webrtcvad
import whisper
import queue
import threading
import sys
import time
import json
import os

class UnifiedAIChatbot:
    def __init__(self, config_path="config.json"):
        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Config file not found: {config_path}")
            
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"--- Initializing Unified AI (Device: {self.device}) ---")

        # 1. LLM Setup
        llm_cfg = self.config["llm"]
        print(f"Loading LLM: {llm_cfg['model_id']}...")
        self.tokenizer = AutoTokenizer.from_pretrained(llm_cfg["model_id"], trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            llm_cfg["model_id"],
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            device_map="auto" if self.device == "cuda" else None,
            trust_remote_code=True
        ).to(self.device)
        self.llm_config = llm_cfg

        # 2. TTS Setup (Lazy Loading)
        self.pipeline = None
        self.tts_config = self.config["tts"]

        # 3. STT Setup (Lazy Loading)
        self.whisper_model = None
        self.stt_config = self.config["stt"]
        self.vad = webrtcvad.Vad(2)
        self.sample_rate = 16000
        self.frame_duration = 30
        self.frame_size = int(self.sample_rate * self.frame_duration / 1000)
        self.audio_queue = queue.Queue()

    def _ensure_tts(self):
        if self.pipeline is None:
            print(f"Loading Kokoro TTS Pipeline ({self.tts_config.get('lang_code', 'a')})...")
            self.pipeline = KPipeline(lang_code=self.tts_config.get('lang_code', 'a'))

    def _ensure_stt(self):
        if self.whisper_model is None:
            print(f"Loading STT: {self.stt_config['model_id']}...")
            self.whisper_model = whisper.load_model(self.stt_config["model_id"])

    def generate_response(self, user_input):
        prompt = f"User: {user_input}\nAssistant:"
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=self.llm_config.get("max_new_tokens", 150),
            temperature=self.llm_config.get("temperature", 0.7),
            top_p=self.llm_config.get("top_p", 0.9),
            do_sample=self.llm_config.get("do_sample", True),
            eos_token_id=self.tokenizer.eos_token_id
        )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        if response.startswith(prompt):
            response = response[len(prompt):].strip()
        
        # Cleanup
        response = response.replace("</think>", "").replace("<think>", "").strip()
        response = response.split("User:")[0].strip()
        return response

    def speak(self, text):
        self._ensure_tts()
        print("Assistant is speaking...")
        
        # Voice options include: af_heart, af_bella, af_nicole, af_sarah, af_sky, etc.
        voice = self.tts_config.get("speaker", "af_heart")
        generator = self.pipeline(text, voice=voice, speed=1.0)
        
        for i, (gs, ps, audio) in enumerate(generator):
            # audio is a numpy array
            sd.play(audio, 24000) # Kokoro uses 24kHz
            sd.wait()

    def record_and_transcribe(self):
        self._ensure_stt()
        print("🎤 Listening (Voice)...")
        buffer = bytes()
        silence_duration = 0
        speaking = False

        def callback(indata, frames, time_info, status):
            self.audio_queue.put(bytes(indata))

        with sd.RawInputStream(samplerate=self.sample_rate, blocksize=self.frame_size, dtype="int16", channels=1, callback=callback):
            while True:
                frame = self.audio_queue.get()
                if self.vad.is_speech(frame, self.sample_rate):
                    buffer += frame
                    silence_duration = 0
                    speaking = True
                elif speaking:
                    silence_duration += self.frame_duration
                    if silence_duration > 800: break
        
        audio_np = np.frombuffer(buffer, dtype="int16").astype("float32") / 32768.0
        result = self.whisper_model.transcribe(audio_np, language=self.stt_config.get("language", "en"))
        return result["text"].strip()

    def run(self, mode="all"):
        print(f"--- Chatbot started in '{mode}' mode. Type 'exit' to quit. ---")
        while True:
            if mode in ["text", "all"]:
                user_input = input("You (text/enter for voice): ").strip()
            else:
                user_input = ""

            if user_input.lower() == "exit": break
            
            if not user_input and mode in ["voice", "all"]:
                user_input = self.record_and_transcribe()
                if not user_input: continue
                print(f"You (voice): {user_input}")
            
            if not user_input: continue

            # Generate
            print("Assistant is thinking...", end="\r")
            response = self.generate_response(user_input)
            print(f"Assistant: {response}")

            # Audio output
            if mode in ["all", "voice", "speech"]:
                self.speak(response)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["text", "voice", "all"], default="all")
    parser.add_argument("--prompt", type=str, help="Single prompt to run and then exit")
    args = parser.parse_args()
    
    bot = UnifiedAIChatbot()
    if args.prompt:
        response = bot.generate_response(args.prompt)
        print(f"Prompt: {args.prompt}")
        print(f"Response: {response}")
        if args.mode != "text":
            bot.speak(response)
    else:
        bot.run(mode=args.mode)
