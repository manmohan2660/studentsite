import type { Metadata } from 'next';
import PercentageCalculator from '@/components/tools/PercentageCalculator';

export const metadata: Metadata = {
  title: 'Percentage Calculator - StudentTools',
  description:
    'Calculate percentages, find values, discounts, and more instantly.',
};

export default function PercentageCalculatorPage() {
  return <PercentageCalculator />;
}
