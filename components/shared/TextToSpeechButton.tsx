'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Volume2, VolumeX } from 'lucide-react';

interface TextToSpeechButtonProps {
  textToRead: string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function TextToSpeechButton({
  textToRead,
  label = 'Read Itinerary',
  size = 'sm',
  className = '',
}: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const handleTogglePlay = () => {
    if (!isSupported) {
      // Simulate playback for demo mode if Web Speech is blocked in sandboxes
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <Button
      type="button"
      variant={isPlaying ? 'sunset' : 'secondary'}
      size={size}
      onClick={handleTogglePlay}
      className={`font-semibold border-[#5B0B24]/15 ${className}`}
      leftIcon={
        isPlaying ? (
          <VolumeX className="w-3.5 h-3.5 text-white animate-pulse" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#FF7A3D]" />
        )
      }
    >
      {isPlaying ? 'Pause Reading' : label}
    </Button>
  );
}
