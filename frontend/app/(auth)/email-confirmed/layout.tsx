import type { Metadata } from 'next';

// The page is a client component, so its title lives here.
export const metadata: Metadata = { title: 'Email confirmed' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
