import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ThemeToggle } from './components/ThemeToggle';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  media?: {
    url: string;
    type: 'image' | 'audio';
  };
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your data assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string, media?: { url: string; type: 'image' | 'audio' }) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
      media,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: media 
          ? `I see you've shared ${media.type === 'image' ? 'an image' : 'a voice message'}. How can I help you with that?`
          : "I'm a demo chatbot. The backend integration is not implemented yet.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Athena: Your Assistant</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">AI Conversations, Powered by Real-Time Data</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isBot={message.isBot}
                timestamp={message.timestamp}
                mediaUrl={message.media?.url}
                mediaType={message.media?.type}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-4">
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto w-full">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}