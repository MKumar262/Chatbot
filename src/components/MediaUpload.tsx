import React, { useRef } from 'react';
import { Image, Mic, StopCircle } from 'lucide-react';

interface MediaUploadProps {
  onImageUpload: (file: File) => void;
  onVoiceRecord: (recording: boolean) => void;
  isRecording: boolean;
}

export function MediaUpload({ onImageUpload, onVoiceRecord, isRecording }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
        title="Upload image"
      >
        <Image size={16} className="sm:w-5 sm:h-5" />
      </button>
      <button
        type="button"
        onClick={() => onVoiceRecord(!isRecording)}
        className={`p-1.5 sm:p-2 rounded-full transition-colors ${
          isRecording 
            ? 'text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50' 
            : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50'
        }`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <StopCircle size={16} className="sm:w-5 sm:h-5" />
        ) : (
          <Mic size={16} className="sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
}