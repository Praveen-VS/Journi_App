import React from 'react';
import InspectorToolbar from '@/components/navigation/InspectorToolbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg text-[#2E0513] dark:text-[#FFF7FA] flex flex-col justify-center">
      {children}
      <InspectorToolbar />
    </div>
  );
}
