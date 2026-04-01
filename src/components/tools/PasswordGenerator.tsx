'use client';

import { useState } from 'react';
import ToolLayout from '@/components/tools/ToolLayout';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const generatePassword = () => {
    let chars = '';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUppercase) chars += uppercase;
    if (useLowercase) chars += lowercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (!chars) {
      alert('Select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(newPassword);

    // Track usage
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolName: 'Password Generator',
        toolType: 'Generator',
        input: { length, useUppercase, useLowercase, useNumbers, useSymbols },
        result: { passwordLength: newPassword.length },
      }),
    }).catch(console.error);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      alert('Password copied to clipboard!');
    }
  };

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure random passwords for your accounts"
      toolName="Password Generator"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="128"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-gray-700">Uppercase Letters (A-Z)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={(e) => setUseLowercase(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-gray-700">Lowercase Letters (a-z)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-gray-700">Numbers (0-9)</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-gray-700">Symbols (!@#$%...)</span>
          </label>
        </div>

        <button
          onClick={generatePassword}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          Generate Password
        </button>

        {password && (
          <div className="p-6 bg-gray-100 rounded-lg space-y-4">
            <div className="break-all font-mono text-lg text-gray-800 bg-white p-4 rounded">
              {password}
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
