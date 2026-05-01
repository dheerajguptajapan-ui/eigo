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
  {
    id: 'airport',
    title_ja: '空港でのチェックイン',
    description_ja: '空港のカウンターでチェックインしてみましょう。',
    initial_message: 'Good morning! Welcome to the check-in counter. May I see your passport, please?',
  },
  {
    id: 'restaurant',
    title_ja: 'レストランで注文',
    description_ja: 'レストランで食事を注文してみましょう。',
    initial_message: 'Good evening! Welcome to our restaurant. Here is the menu. Are you ready to order?',
  },
  {
    id: 'shopping',
    title_ja: '買い物と返品',
    description_ja: 'ショッピングモールで買い物や返品をしてみましょう。',
    initial_message: 'Hi there! Welcome to our store. Are you looking for something specific today?',
  },
  {
    id: 'smalltalk',
    title_ja: '雑談',
    description_ja: '同僚や友人と日常的な雑談をしてみましょう。',
    initial_message: 'Hey! How was your weekend? Did you do anything fun?',
  },
  {
    id: 'philosophy',
    title_ja: '哲学対話 (Advanced)',
    description_ja: '自由意志や意識の本質について、上級レベルの英語で語り合いましょう。',
    initial_message: 'Welcome to the symposium. Today we are discussing the nature of free will. Do you believe human beings are truly autonomous, or are our actions predetermined by neural processes?',
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
    
    const msg = lastUserMessage.toLowerCase();

    const replies: Record<string, Array<[string[], string]>> = {
      intro: [
        [['name is', 'i am', 'im ', "i'm"], "Nice to meet you! That's a great name. Where are you from?"],
        [['japan', 'tokyo', 'osaka', 'kyoto'], "Oh, Japan! I would love to visit someday! What do you like to do in your free time?"],
        [['hobby', 'like', 'enjoy', 'play', 'love'], "That sounds fun! Do you have any plans this weekend?"],
      ],
      coffee: [
        [['coffee', 'latte', 'cappuccino', 'espresso', 'tea', 'matcha'], "Great choice! What size would you like — small, medium, or large?"],
        [['large', 'medium', 'small'], "Perfect! Would you like anything else, like a pastry or snack?"],
        [['no', 'that', 'just', 'only'], "Got it! That will be ready in a few minutes. Your total is $5.50."],
      ],
      airport: [
        [['here', 'passport', 'yes', 'sure'], "Thank you! Are you checking any luggage today?"],
        [['bag', 'luggage', 'suitcase', 'one', 'two'], "Great. Please put your bag on the scale. Do you have a seat preference — window or aisle?"],
        [['window', 'aisle', 'middle', 'any'], "Perfect! Here is your boarding pass. Your gate is B12. Boarding starts at 9:30 AM. Have a great flight!"],
      ],
      restaurant: [
        [['yes', 'ready', 'order', 'like', 'have', 'want'], "Excellent! What would you like to start with — an appetizer, or go straight to the main course?"],
        [['steak', 'pasta', 'fish', 'chicken', 'salad', 'burger', 'sushi'], "Wonderful choice! How would you like that cooked? And would you like anything to drink?"],
        [['water', 'wine', 'juice', 'beer', 'coke', 'drink'], "Perfect. I'll put your order in right away. Is there anything else I can get you?"],
      ],
      shopping: [
        [['yes', 'looking', 'need', 'want', 'find'], "Of course! What are you looking for? We have clothing, accessories, and electronics."],
        [['shirt', 'dress', 'shoes', 'jacket', 'pants', 'jeans'], "We have those in several sizes. What size are you looking for?"],
        [['return', 'refund', 'exchange', 'broken', 'wrong'], "I'm sorry to hear that! Do you have the receipt? We can process a full refund or exchange for you."],
      ],
      smalltalk: [
        [['good', 'great', 'fine', 'ok', 'nice', 'wonderful', 'fantastic'], "That's awesome! I had a pretty relaxing weekend myself. What did you get up to?"],
        [['nothing', 'stayed', 'home', 'watched', 'slept', 'rested'], "Sometimes that's exactly what you need! Did you catch anything good on TV?"],
        [['work', 'busy', 'project', 'meeting', 'office'], "I know that feeling! Are things calming down at work anytime soon?"],
      ],
      philosophy: [
        [['autonomous', 'free', 'choice', 'decide', 'believe'], "That is a classic libertarian perspective. However, how do you account for the subconscious influences revealed by neuroscience?"],
        [['predetermined', 'brain', 'neural', 'physics', 'cannot'], "So you lean towards determinism. If that is true, do you think we can still hold individuals morally responsible for their actions?"],
        [['both', 'compatibilism', 'depends', 'middle'], "A compatibilist approach! That is quite a nuanced take on the problem of moral responsibility."],
      ],
    };

    const scenarioReplies = replies[scenarioId] || [];
    for (const [keywords, reply] of scenarioReplies) {
      if (keywords.some(kw => msg.includes(kw))) {
        return { role: 'assistant', content: reply };
      }
    }

    const defaults: Record<string, string> = {
      intro: "That's interesting! Tell me more about yourself.",
      coffee: "I'm sorry, could you repeat that? What would you like to order?",
      airport: "I see. Let me help you with the check-in process. Do you have your booking reference?",
      restaurant: "Of course! Take your time looking at the menu. I'll be right back.",
      shopping: "Let me know if you need any help finding something specific!",
      smalltalk: "Ha, interesting! I feel the same way sometimes. What else is new with you?",
      philosophy: "A fascinating point. The intersection of metaphysics and ethics is always complex, isn't it?",
    };

    return {
      role: 'assistant',
      content: defaults[scenarioId] || "Great! Keep going — you're doing well!",
    };
  }
};
