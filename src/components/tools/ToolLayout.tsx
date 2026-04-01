'use client';

import { useState, useEffect } from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  toolName: string;
}

export default function ToolLayout({
  title,
  description,
  children,
  toolName,
}: ToolLayoutProps) {
  const trackUsage = async (input: any, result: any) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          toolType: title,
          input,
          result,
        }),
      });
    } catch (error) {
      console.error('Failed to track tool usage:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-lg text-gray-600">{description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
