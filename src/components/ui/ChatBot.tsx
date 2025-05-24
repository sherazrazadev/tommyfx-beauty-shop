
// src/components/ui/ChatBot.tsx - Updated with latest Google GenAI SDK
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2 } from 'lucide-react';
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

Product Categories:
- Skincare: Serums, moisturizers, cleansers
- Makeup: Foundation, lipstick, eyeshadow
- Hair: Shampoo, conditioner, treatments
- Body: Lotions, scrubs, oils
- Bath: Soaps, bath bombs
- Fragrance: Perfumes, body sprays

Please provide helpful, friendly responses about our products, policies, and services. Keep responses concise and helpful. Use emojis to make responses more engaging.`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your TommyFX Beauty assistant. How can I help you today? 🌟",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    try {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!API_KEY) {
        return "I'm sorry, the chat service is currently unavailable. Please contact us directly at +92 (306) 714-5010 or tommyfx.pk@gmail.com for assistance! 📞";
        }

        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `${SYSTEM_MESSAGE}\n\nUser: ${userMessage}\n\nAssistant:`;
        
        console.log('Sending prompt to Gemini...');
        
        const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
        });
        
        console.log('Gemini response received:', response.text);
        
        if (!response.text || response.text.trim() === '') {
        throw new Error('Empty response from Gemini');
        }
        
        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        return "I'm experiencing technical difficulties right now. For immediate assistance, please contact our support team at +92 (306) 714-5010 or email tommyfx.pk@gmail.com. We're here to help! 💪";
    }
    };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await callGeminiAPI(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Something went wrong! Please try again or contact us at +92 (306) 714-5010. 😊",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: "Hi! I'm your TommyFX Beauty assistant. How can I help you today? 🌟",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  const getQuickReplies = () => [
    "What products do you have?",
    "Shipping information",
    "Return policy",
    "Contact details"
  ];

  return (
    <>
      {/* Chat Button - Theme colors from home banner */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 floating-button"
          aria-label="Open chat"
          title="Chat with TommyFX Assistant"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-xl border transition-all duration-300 ${
          isMinimized ? 'w-80 h-12' : 'w-80 h-96 sm:w-96 sm:h-[500px]'
        } chat-window-mobile`}>
          {/* Header - Theme colors */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-medium text-sm">TommyFX Assistant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Online"></div>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={clearChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Clear chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"/>
                </svg>
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-64 sm:h-80 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                        message.isUser
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-md'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {/* Quick replies for first message */}
                {messages.length === 1 && !isLoading && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getQuickReplies().map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputText(reply);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-lg text-sm shadow-sm border">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">Assistant is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our products..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1 text-center">
                  Powered by • TommyFX Beauty
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;