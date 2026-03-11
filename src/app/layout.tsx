import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seputeh HYO',
  description: 'Seputeh Hua Youth Organisation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
