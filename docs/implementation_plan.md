# Eigo Master & Voice Chatbot Integration Plan

We are setting up the `local-ai-voice-chatbot` and stabilizing the authentication flow for `Eigo Master`.

## User Review Required

> [!IMPORTANT]
> The `local-ai-voice-chatbot` depends on large AI models (DeepSeek, Kokoro, Whisper). Initial runs will download several gigabytes of data. Ensure you have sufficient disk space and a stable internet connection.

> [!WARNING]
> I have identified that the current Eigo Master API does not enforce authentication on several routes (AI scenarios, SRS). I plan to add a security middleware to protect these.

## Proposed Changes

### [Component] Voice Chatbot (Python)

#### [NEW] [unified_chatbot.py](file:///c:/Users/trajk/OneDrive/Desktop/eigo/apps/local-ai-voice-chatbot/unified_chatbot.py)
A master script that integrates all three modes:
- **Mode 1**: Text-only (DeepSeek LLM)
- **Mode 2**: Text-to-Speech (LLM + Kokoro TTS)
- **Mode 3**: Speech-to-Speech (Whisper + LLM + Kokoro)
- **Playback**: Switched to `sounddevice` for better Windows compatibility without C++ build tools.

### [Component] Eigo Master API [DONE]

#### [MODIFY] [index.ts](file:///c:/Users/trajk/OneDrive/Desktop/eigo/apps/api/src/index.ts)
- Applied `authenticateToken` middleware to SRS and AI routes.

#### [NEW] [middleware/auth.ts](file:///c:/Users/trajk/OneDrive/Desktop/eigo/apps/api/src/middleware/auth.ts)
- Implemented JWT validation.

### [Component] Eigo Master Web [DONE]

#### [MODIFY] [layout.tsx](file:///c:/Users/trajk/OneDrive/Desktop/eigo/apps/web/src/app/layout.tsx)
- Added global `AuthGuard` provider.

#### [NEW] [AuthGuard.tsx](file:///c:/Users/trajk/OneDrive/Desktop/eigo/apps/web/src/components/AuthGuard.tsx)
- Implemented client-side redirect to `/login` for unauthenticated sessions.

## Verification Plan

### Automated Tests
- Run `unified_chatbot.py` in text mode to verify LLM.
- Check API health and protected routes with invalid tokens.

### Manual Verification
- Log in through the web UI and verify the dashboard loads user-specific data.
- Test voice interaction (if hardware allows) or verify audio file generation.

---

### UI Mockup for Voice Chatbot
![Voice Chatbot UI](/voice_chatbot_ui_mockup_1777602295273.png)
