export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Scenario {
  id: string;
  title_ja: string;
  description_ja: string;
  initial_message: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'intro',
    title_ja: '自己紹介',
    description_ja: '新しい友達に自分の名前や出身を伝えましょう。',
    initial_message: 'Hello! I am Alex. What is your name?',
  },
  {
    id: 'coffee',
    title_ja: 'カフェで注文',
    description_ja: 'コーヒーショップで飲み物を注文してみましょう。',
    initial_message: 'Welcome to Eigo Cafe! What can I get for you today?',
  },
];

import axios from 'axios';

export const processChatMessage = async (scenarioId: string, messages: Message[]): Promise<Message> => {
  const lastUserMessage = messages[messages.length - 1].content;
  
  try {
    // Attempt to call the local Python AI server
    const response = await axios.post('http://localhost:8000/chat', {
      message: lastUserMessage,
      mode: 'text'
    });
    
    return {
      role: 'assistant',
      content: response.data.response,
    };
  } catch (error) {
    console.warn("Local AI server not reachable, falling back to mock response.");
    
    // Fallback to existing mock logic
    const lastUserMessageLower = lastUserMessage.toLowerCase();
    if (scenarioId === 'intro') {
      if (lastUserMessageLower.includes('name is') || lastUserMessageLower.includes('i am') || lastUserMessageLower.includes('im ')) {
        return {
          role: 'assistant',
          content: "Nice to meet you! That is a great name. Where are you from?",
        };
      }
      if (lastUserMessageLower.includes('from japan') || lastUserMessageLower.includes('from tokyo')) {
        return {
          role: 'assistant',
          content: "Oh, Japan! I want to go there someday. What do you like to do in your free time?",
        };
      }
      return {
        role: 'assistant',
        content: "Could you tell me more? For example, your name or where you live!",
      };
    }

    if (scenarioId === 'coffee') {
      if (lastUserMessageLower.includes('coffee') || lastUserMessageLower.includes('latte') || lastUserMessageLower.includes('tea')) {
        return {
          role: 'assistant',
          content: "Sure! What size would you like? Small, medium, or large?",
        };
      }
      if (lastUserMessageLower.includes('large') || lastUserMessageLower.includes('medium') || lastUserMessageLower.includes('small')) {
        return {
          role: 'assistant',
          content: "Got it. Anything else? Or would you like the check?",
        };
      }
      return {
        role: 'assistant',
        content: "I'm sorry, I didn't quite catch that. Would you like to order a coffee or tea?",
      };
    }
    
    return {
      role: 'assistant',
      content: "I'm here to help you practice! (Mock fallback)",
    };
  }
};
