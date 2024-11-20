import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
}

export function ChatMessage({ message, isBot, timestamp, mediaUrl, mediaType }: ChatMessageProps) {
  return (
    <div className={`flex gap-2 sm:gap-4 ${isBot ? 'bg-gray-50 dark:bg-gray-800/50' : ''} p-3 sm:p-4 rounded-lg`}>
      <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
        isBot 
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
          : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
      }`}>
        {isBot ? <Bot size={16} className="sm:w-5 sm:h-5" /> : <User size={16} className="sm:w-5 sm:h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm sm:text-base dark:text-white">{isBot ? 'Assistant' : 'You'}</span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
        </div>
        {mediaUrl && mediaType === 'image' && (
          <div className="mb-2">
            <img 
              src={mediaUrl} 
              alt="Uploaded content"
              className="max-w-full sm:max-w-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
            />
          </div>
        )}
        {mediaUrl && mediaType === 'audio' && (
          <div className="mb-2">
            <audio controls className="w-full max-w-full sm:max-w-sm">
              <source src={mediaUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">{message}</p>
      </div>
    </div>
  );
}