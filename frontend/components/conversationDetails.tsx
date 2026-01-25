'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function ConversationDetails() {
  return (
    <div className="flex-1 flex flex-col items-teo justify-start gap-2 bg-green-500  rounded-xl">
      <p>Tomorrow text</p>
    </div>
  );
}
