'use client';
import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export interface AIPromptInputProps {
  initialPrompt?: string;
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export default function AIPromptInput({
  initialPrompt = '',
  onSubmit,
  isLoading = false,
  placeholder = 'Describe your dream journey... (e.g. 5 days in Kyoto focusing on zen temples & tea ceremonies)',
  className = '',
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full relative rounded-[24px] bg-white dark:bg-[#280814] p-2.5 sm:p-3 border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 shadow-hover transition-all focus-within:border-[#FF4F7A]/60 focus-within:ring-2 focus-within:ring-brand-coral/25 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF4F7A]/15 to-[#FF7A3D]/20 items-center justify-center text-[#FF4F7A] flex-shrink-0 ml-1">
          <Sparkles className="w-5 h-5 text-[#FF7A3D]" />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none text-sm sm:text-base text-[#2E0513] dark:text-[#FFF7FA] placeholder:text-[#5B0B24]/40 dark:placeholder:text-[#FF8BA7]/40 focus:outline-none focus:ring-0 px-2 py-2"
        />

        <Button
          type="submit"
          variant="journey"
          size="md"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="flex-shrink-0 font-bold opacity-100 disabled:opacity-100 shadow-md hover:shadow-lg"
        >
          Plan with AI
        </Button>
      </div>
    </form>
  );
}
