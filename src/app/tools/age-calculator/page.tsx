import type { Metadata } from 'next';
import AgeCalculator from '@/components/tools/AgeCalculator';

export const metadata: Metadata = {
  title: 'Age Calculator - StudentTools',
  description:
    'Calculate your exact age in years, months, days, and more instantly.',
};

export default function AgeCalculatorPage() {
  return <AgeCalculator />;
}
