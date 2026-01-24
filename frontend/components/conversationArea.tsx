'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

export default function ConversationArea() {
  return (
    <div className="flex-3 flex flex-col items-center justify-center gap-2 bg-amber-100 rounded-xl">
      <p>Message area here</p>
    </div>
  );
}
