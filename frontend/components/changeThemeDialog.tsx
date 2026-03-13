'use client';

import { Spinner } from './ui/spinner';

import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';

import { Icon } from '@iconify/react';

import { toast } from 'sonner';
import ThemeOption from './themeOption';
import { useState } from 'react';

import { themes } from '@/lib/themes';

export default function ChangeThemeDialog() {
  const [activeThemeId, setActiveThemeId] = useState('default');

  const activeTheme = themes.find((theme) => theme.id == activeThemeId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="material-symbols:palette" className="size-7" />
          Change theme
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-125 min-w-175 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex w-full justify-center">Change theme</DialogTitle>
          <DialogDescription className="font-semibold text-sm">
            -username- previously changed the theme to{' '}
            {
              <span className={`${activeTheme?.sender} px-1 rounded-sm text-white`}>
                {' '}
                {activeTheme?.label}
              </span>
            }{' '}
            on January 15, 2026 12:04 PM.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex w-full gap-2 min-h-0">
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto min-h-0">
            {themes.map((theme) => (
              <ThemeOption
                key={theme.id}
                id={theme.id}
                label={theme.label}
                color={theme.sender}
                onSelect={setActiveThemeId}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 pt-2">
            <div className="flex w-full items-center gap-2 justify-end">
              <div
                className={`flex rounded-2xl items-center py-2 px-3 whitespace-pre-wrap wrap-break-word ${activeTheme?.sender} m-2`}
              >
                <p>This is a sample sent message.</p>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 justify-start">
              <div
                className={`flex rounded-2xl items-center py-2 px-3 whitespace-pre-wrap wrap-break-word ${activeTheme?.receiver}  m-2`}
              >
                <p>This is a sample received message.</p>
              </div>
            </div>

            <div className="flex flex-1 w-full justify-center items-center ">
              <h2 className="text-lg font-semibold">Click Select to select this theme.</h2>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-2 ">
          <DialogClose asChild>
            <Button className="flex-1 cursor-pointer text-md">Cancel</Button>
          </DialogClose>

          {/* <Button className="flex-1 cursor-pointer text-md">
            {<Spinner data-icon="inline-start" />}
            Select
          </Button> */}

          <DialogClose asChild>
            <Button className="flex-1 cursor-pointer text-md">Select</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
