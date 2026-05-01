from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from unified_chatbot import UnifiedAIChatbot
import uvicorn
import threading

app = FastAPI()
bot = None

class ChatRequest(BaseModel):
    message: str
    mode: str = "text"

@app.on_event("startup")
async def startup_event():
    global bot
    bot = UnifiedAIChatbot()

@app.post("/chat")
async def chat(request: ChatRequest):
    if not bot:
        raise HTTPException(status_code=503, detail="Bot not initialized")
    
    response = bot.generate_response(request.message)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
