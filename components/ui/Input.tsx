'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      isPassword = false,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#5B0B24]/80 dark:text-[#FF8BA7]">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#5B0B24]/50 dark:text-[#FF8BA7]/60 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={actualType}
            className={`w-full min-h-[44px] rounded-[18px] bg-white dark:bg-[#280814] px-4 py-2.5 text-sm text-[#2E0513] dark:text-[#FFF7FA] placeholder:text-[#5B0B24]/40 dark:placeholder:text-[#FF8BA7]/40 border ${
              errorText
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 focus:border-[#FF4F7A]'
            } shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-coral/30 transition-all ${
              leftIcon ? 'pl-11' : ''
            } ${rightIcon || isPassword ? 'pr-11' : ''} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-[#5B0B24]/50 dark:text-[#FF8BA7]/60 hover:text-[#5B0B24] dark:hover:text-[#FFF7FA] transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {!isPassword && rightIcon && (
            <span className="absolute right-3.5 text-[#5B0B24]/50 dark:text-[#FF8BA7]/60 pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {errorText && (
          <p className="text-xs text-red-500 font-medium pl-1">{errorText}</p>
        )}
        {!errorText && helperText && (
          <p className="text-xs text-[#5B0B24]/60 dark:text-[#FF8BA7]/60 pl-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
