'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#5B0B24]/40 backdrop-blur-sm"
          />

          {/* Sheet / Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white dark:bg-[#280814] rounded-t-[28px] sm:rounded-[24px] shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto border border-[#5B0B24]/10 dark:border-[#FF8BA7]/20"
          >
            {/* Grab Handle for Mobile */}
            <div className="w-12 h-1.5 rounded-full bg-[#5B0B24]/15 dark:bg-[#FF8BA7]/20 mx-auto mb-4 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#5B0B24]/8 dark:border-[#FF8BA7]/15 mb-4">
              {title && (
                <h3 className="text-lg font-bold text-[#5B0B24] dark:text-[#FF8BA7] tracking-tight">
                  {title}
                </h3>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5B0B24]/60 dark:text-[#FF8BA7]/70 hover:bg-[#5B0B24]/5 dark:hover:bg-[#FF8BA7]/10 transition-colors ml-auto"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
