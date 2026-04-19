'use client';

import { Icon } from '@iconify/react'; // Assuming you're using Iconify
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button'; // Your button component

export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="cursor-pointer">
        <div className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      className="cursor-pointer min-w-10"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Icon icon="solar:moon-bold" className="w-4 h-4" />
      ) : (
        <Icon icon="solar:sun-bold" className="w-4 h-4" />
      )}
    </Button>
  );
}
