'use client';

import { useState } from 'react';
import ToolLayout from '@/components/tools/ToolLayout';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert('Please select a birth date');
      return;
    }

    const today = new Date();
    const birth = new Date(birthDate);

    if (birth > today) {
      alert('Birth date cannot be in the future');
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const totalDays = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate weeks
    const weeks = Math.floor(totalDays / 7);

    setAge({
      years,
      months,
      days,
      totalDays,
      weeks,
    });

    // Track usage
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolName: 'Age Calculator',
        toolType: 'Calculator',
        input: { birthDate },
        result: { years, months, days },
      }),
    }).catch(console.error);
  };

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days"
      toolName="Age Calculator"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={calculateAge}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          Calculate Age
        </button>

        {age && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-sm">Years</p>
              <p className="text-3xl font-bold text-blue-600">{age.years}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm">Months</p>
              <p className="text-3xl font-bold text-green-600">{age.months}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-600 text-sm">Days</p>
              <p className="text-3xl font-bold text-purple-600">{age.days}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-600 text-sm">Total Days</p>
              <p className="text-2xl font-bold text-orange-600">
                {age.totalDays}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
