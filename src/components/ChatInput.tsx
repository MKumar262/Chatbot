import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { MediaUpload } from './MediaUpload';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

interface ChatInputProps {
  onSend: (message: string, media?: { url: string; type: 'image' | 'audio' }) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { isRecording, error, startRecording, stopRecording, clearError } = useVoiceRecorder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    onSend('Sent an image', { url: imageUrl, type: 'image' });
  };

  const handleVoiceRecord = async (recording: boolean) => {
    if (recording) {
      await startRecording();
    } else {
      const audioUrl = await stopRecording();
      if (audioUrl) {
        onSend('Sent a voice message', { url: audioUrl, type: 'audio' });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {error && (
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs sm:text-sm">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium whitespace-nowrap"
          >
            Dismiss
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <MediaUpload 
          onImageUpload={handleImageUpload}
          onVoiceRecord={handleVoiceRecord}
          isRecording={isRecording}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isRecording ? 'Recording...' : 'Type your message...'}
          className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          disabled={isLoading || isRecording}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim() || isRecording}
          className={`px-3 sm:px-4 py-2 rounded-full ${
            isLoading || !message.trim() || isRecording
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
          } transition-colors duration-200 flex items-center gap-1 sm:gap-2`}
        >
          <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline text-sm">Send</span>
        </button>
      </form>
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-xs sm:text-sm mt-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" />
          Recording in progress...
        </div>
      )}
    </div>
  );
}