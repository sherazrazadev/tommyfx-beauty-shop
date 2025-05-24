// src/hooks/useChatBot.ts - Updated with latest Google GenAI SDK
import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SYSTEM_MESSAGE = `You are a helpful AI assistant for TommyFX Beauty, a premium skincare and beauty products website. 

About TommyFX Beauty:
- We sell high-quality skincare, makeup, hair, body, bath, and fragrance products
- All products are cruelty-free and made with organic ingredients
- We're located in Lahore, Punjab, Pakistan
- Contact: +92 (306) 714-5010, tommyfx.pk@gmail.com
- We offer free shipping on orders over $50
- 30-day easy returns policy
- Cash on Delivery (COD) available

Please provide helpful, friendly responses about our products, policies, and services. Keep responses concise and helpful.`;

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your TommyFX Beauty assistant. How can I help you today? 🌟",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userInput: string): Promise<void> => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
        id: Date.now().toString(),
        text: userInput,
        isUser: true,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        if (!API_KEY) throw new Error('API key not found');

        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `${SYSTEM_MESSAGE}\n\nUser: ${userInput}\n\nAssistant:`;
        
        const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
        });

        const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't generate a response. Please try again.",
        isUser: false,
        timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing technical difficulties. Please contact our support team at +92 (306) 714-5010 for immediate assistance.",
        isUser: false,
        timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
    }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: '1',
      text: "Hi! I'm your TommyFX Beauty assistant. How can I help you today? 🌟",
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};