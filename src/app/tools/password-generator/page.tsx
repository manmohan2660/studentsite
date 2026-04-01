import type { Metadata } from 'next';
import PasswordGenerator from '@/components/tools/PasswordGenerator';

export const metadata: Metadata = {
  title: 'Password Generator - StudentTools',
  description:
    'Generate strong and secure random passwords with custom options.',
};

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}
