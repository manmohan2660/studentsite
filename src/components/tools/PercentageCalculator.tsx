'use client';

import { useState } from 'react';
import ToolLayout from '@/components/tools/ToolLayout';

export default function PercentageCalculator() {
  const [value, setValue] = useState('');
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState('');
  const [mode, setMode] = useState<'calculate' | 'findValue' | 'findTotal'>(
    'calculate'
  );
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (mode === 'calculate') {
      if (!value || !total) {
        alert('Please fill in all fields');
        return;
      }
      const res = (parseFloat(value) / parseFloat(total)) * 100;
      setResult(parseFloat(res.toFixed(2)));
    } else if (mode === 'findValue') {
      if (!percentage || !total) {
        alert('Please fill in all fields');
        return;
      }
      const res = (parseFloat(percentage) / 100) * parseFloat(total);
      setResult(parseFloat(res.toFixed(2)));
    } else {
      if (!value || !percentage) {
        alert('Please fill in all fields');
        return;
      }
      const res = (parseFloat(value) / parseFloat(percentage)) * 100;
      setResult(parseFloat(res.toFixed(2)));
    }

    // Track usage
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolName: 'Percentage Calculator',
        toolType: 'Calculator',
        input: { value, total, percentage, mode },
        result: { result },
      }),
    }).catch(console.error);
  };

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate percentages, find values, and more"
      toolName="Percentage Calculator"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Calculation Mode
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="calculate"
                checked={mode === 'calculate'}
                onChange={(e) => {
                  setMode(e.target.value as any);
                  setResult(null);
                }}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3">
                Calculate Percentage (Value / Total × 100)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="findValue"
                checked={mode === 'findValue'}
                onChange={(e) => {
                  setMode(e.target.value as any);
                  setResult(null);
                }}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3">
                Find Value (Percentage % of Total)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="findTotal"
                checked={mode === 'findTotal'}
                onChange={(e) => {
                  setMode(e.target.value as any);
                  setResult(null);
                }}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3">
                Find Total (Value is X% of Total)
              </span>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {(mode === 'calculate' || mode === 'findTotal') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {mode === 'calculate' ? 'Value' : 'Value'}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
            </div>
          )}

          {(mode === 'calculate' || mode === 'findValue') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter total"
              />
            </div>
          )}

          {(mode === 'findValue' || mode === 'findTotal') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage (%)
              </label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter percentage"
              />
            </div>
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          Calculate
        </button>

        {result !== null && (
          <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-gray-600 mb-2">Result:</p>
            <p className="text-5xl font-bold text-blue-600">
              {result}
              {mode !== 'findTotal' && '%'}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
