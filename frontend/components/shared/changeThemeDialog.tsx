'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useChatStore } from '@/store/useChatStore';

import {
  settingsRowClass,
  settingsRowIconTileClass,
} from '@/components/messages/settingsRowStyles';
import ThemeOption from '@/components/shared/themeOption';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

import { themes } from '@/lib/themes';

export default function ChangeThemeDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedThemeId, setSelectedThemeId] = useState('default');
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const conversationId = useChatStore((state) => state.activeConversationId);
  const changedAt = useChatStore((state) => state.conversationThemeChangedAt);
  const changedBy = useChatStore((state) => state.conversationThemeChangedBy);

  const activeConversationThemeId = useChatStore((state) => state.conversationTheme);
  const activeConversationTheme = themes.find((theme) => theme.id == activeConversationThemeId);

  const selectedTheme = themes.find((theme) => theme.id == selectedThemeId);

  const changeConversationThemeRateLimited = useChatStore(
    (state) => state.changeConversationThemeRateLimited
  );

  const { changeConversationTheme } = useChatStore();

  const updateConversationTheme = async () => {
    setLocalLoading(true);
    if (conversationId) {
      await changeConversationTheme(conversationId, selectedThemeId);

      setIsOpen(false);

      // Read the store's current values; the ones captured at render time are stale after the await.
      const {
        changeConversationThemeError: latestThemeError,
        changeConversationThemeRateLimited: latestThemeRateLimited,
      } = useChatStore.getState();

      // A 429 sets both flags, so check rate limiting first.
      if (latestThemeRateLimited) {
        toast.error('You have tried to change the theme already. Try again in 1 minute.');
        return;
      } else if (latestThemeError != null) {
        toast.error(`Something went wrong when changing the theme.`);
        return;
      }

      toast.success(`The theme for this conversation has been set to ${selectedTheme?.label}.`);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    const updateLocalLoading = () => setLocalLoading(false);

    if (isOpen) {
      updateLocalLoading();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        // Start on the conversation's current theme instead of always "Default".
        if (value) setSelectedThemeId(activeConversationTheme?.id ?? 'default');
        setIsOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <button
          className={settingsRowClass('neutral', changeConversationThemeRateLimited)}
          disabled={changeConversationThemeRateLimited}
          onClick={() => setIsOpen(true)}
        >
          <span className={settingsRowIconTileClass()}>
            <Palette className="size-4" />
          </span>
          Change theme
        </button>
      </DialogTrigger>
      <DialogContent className="flex h-[34rem] max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-stone-200 p-0 sm:max-w-2xl dark:border-stone-800">
        <DialogHeader className="shrink-0 px-6 pb-4 pt-6 text-left">
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <Palette className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-semibold tracking-tight">Change theme</DialogTitle>
          {changedBy != null && changedAt != null && !localLoading ? (
            <DialogDescription className="pt-1 leading-6">
              {changedBy} previously changed the theme to{' '}
              <span
                className={`${activeConversationTheme?.sender} rounded-md px-1.5 py-0.5 text-xs font-semibold text-white`}
              >
                {activeConversationTheme?.label}
              </span>{' '}
              on {formatDate(changedAt)}.
            </DialogDescription>
          ) : (
            <DialogDescription className="pt-1 leading-6">
              Pick the bubble colors for this conversation.
            </DialogDescription>
          )}
        </DialogHeader>

        {localLoading ? (
          <div className="flex min-h-0 w-full flex-1 items-center justify-center text-stone-400">
            <Spinner />
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 px-6 sm:grid-cols-[13rem_1fr]">
            <div className="flex min-h-0 flex-col gap-1 overflow-y-auto pr-1">
              {themes.map((theme) => (
                <ThemeOption
                  key={theme.id}
                  id={theme.id}
                  label={theme.label}
                  color={theme.sender}
                  isSelected={theme.id === selectedThemeId}
                  onSelect={setSelectedThemeId}
                />
              ))}
            </div>

            <div className="hidden min-h-0 flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex dark:border-stone-800 dark:bg-stone-950/60">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Preview · {selectedTheme?.label}
              </span>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="flex justify-start">
                  <div
                    className={`max-w-[80%] rounded-2xl rounded-bl-md px-3.5 py-2 text-sm leading-relaxed ${selectedTheme?.receiver}`}
                  >
                    <p>Hey! How&apos;s it going?</p>
                  </div>
                </div>
                <div className="mb-2 flex justify-start">
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${selectedTheme?.receiver}`}
                  >
                    <p>This is a sample received message.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div
                    className={`max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-relaxed ${selectedTheme?.sender}`}
                  >
                    <p>Pretty good, thanks!</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${selectedTheme?.sender}`}
                  >
                    <p>This is a sample sent message.</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-stone-500 dark:text-stone-400">
                Click Select to apply this theme.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex w-full shrink-0 gap-2 border-t border-stone-100 px-6 py-4 dark:border-stone-800">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="h-10 flex-1 cursor-pointer rounded-xl text-sm"
              disabled={localLoading}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            className="h-10 flex-1 cursor-pointer rounded-xl text-sm"
            onClick={() => {
              updateConversationTheme();
            }}
            disabled={localLoading}
          >
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
