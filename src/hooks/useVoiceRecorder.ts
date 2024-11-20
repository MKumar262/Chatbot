import { useState, useCallback } from 'react';

interface VoiceRecorderState {
  isRecording: boolean;
  error: string | null;
}

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    error: null,
  });
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      let errorMessage = 'Error accessing microphone';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access was denied. Please allow microphone access to record audio.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        }
      }
      
      setState(prev => ({ ...prev, error: errorMessage }));
      console.error('Microphone error:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && state.isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, isRecording: false }));
      
      return new Promise<string>((resolve) => {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioChunks([]);
          resolve(audioUrl);
        };
      });
    }
    return Promise.resolve('');
  }, [mediaRecorder, state.isRecording, audioChunks]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return { 
    isRecording: state.isRecording, 
    error: state.error,
    startRecording, 
    stopRecording,
    clearError
  };
}