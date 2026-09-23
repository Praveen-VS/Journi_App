'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'sunset' | 'burgundy' | 'secondary' | 'ghost' | 'outline' | 'journey';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Button({
  variant = 'sunset',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base styling adhering to 20px radius and 44px min touch target
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-[20px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'h-9 min-w-[36px] px-4 text-xs gap-1.5',
    md: 'min-h-[44px] px-5 py-2.5 text-sm gap-2', // Meets 44px minimum touch target
    lg: 'min-h-[52px] px-7 py-3 text-base gap-2.5 font-semibold',
    icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0',
  };

  const variantStyles = {
    sunset:
      'bg-gradient-to-r from-[#FF4F7A] via-[#FF7A3D] to-[#FFC83D] text-white shadow-sunset hover:opacity-95 active:opacity-90',
    journey:
      'bg-gradient-to-r from-[#C2185B] via-[#E91E63] to-[#FF5252] text-white shadow-md hover:shadow-lg hover:opacity-95 active:opacity-90',
    burgundy:
      'bg-[#5B0B24] text-white shadow-soft hover:bg-[#4a081d] active:bg-[#3a0616]',
    secondary:
      'bg-white dark:bg-[#280814] text-[#5B0B24] dark:text-[#FF8BA7] border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20 shadow-soft hover:bg-[#FFF7FA] dark:hover:bg-[#330a1a]',
    ghost:
      'bg-transparent text-[#5B0B24] dark:text-[#FF8BA7] hover:bg-[#5B0B24]/5 dark:hover:bg-[#FF8BA7]/10',
    outline:
      'bg-transparent border border-[#FF4F7A] text-[#FF4F7A] hover:bg-[#FF4F7A]/5 active:bg-[#FF4F7A]/10',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
