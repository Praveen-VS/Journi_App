'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'glass' | 'subtle' | 'outline';
  isInteractive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  variant = 'elevated',
  isInteractive = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-[24px] overflow-hidden transition-all duration-200 text-left';

  const variantStyles = {
    elevated:
      'bg-white dark:bg-[#280814] border border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 shadow-soft hover:shadow-hover',
    glass:
      'glass-panel border border-[#5B0B24]/10 dark:border-[#FF8BA7]/15 shadow-soft',
    subtle:
      'bg-[#FFF7FA] dark:bg-[#1f060f] border border-[#5B0B24]/6 dark:border-[#FF8BA7]/10',
    outline:
      'bg-transparent border border-[#5B0B24]/15 dark:border-[#FF8BA7]/20',
  };

  if (isInteractive) {
    return (
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
        className={`${baseStyles} ${variantStyles[variant]} cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}
