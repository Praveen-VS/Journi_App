import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    rect: 'rounded-[18px]',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`animate-shimmer bg-[#5B0B24]/8 dark:bg-[#FF8BA7]/10 ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
