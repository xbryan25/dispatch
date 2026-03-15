'use client';

import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import ThemeOption from './themeOption';
import { useState, useEffect } from 'react';

import { themes } from '@/lib/themes';
import { useChatStore } from '@/store/useChatStore';
import { useUpdateConversationTheme } from '@/hooks/useChat';
import LoadingSpinner from './loadingSpinner';

export default function ChangeThemeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selectedThemeId, setSelectedThemeId] = useState('default');
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const conversationId = useChatStore((state) => state.activeConversationId);
  const changedAt = useChatStore((state) => state.conversationThemeChangedAt);
  const changedBy = useChatStore((state) => state.conversationThemeChangedBy);

  const activeConversationThemeId = useChatStore((state) => state.conversationTheme);
  const activeConversationTheme = themes.find((theme) => theme.id == activeConversationThemeId);

  const selectedTheme = themes.find((theme) => theme.id == selectedThemeId);

  const { changeConversationTheme, error } = useUpdateConversationTheme();

  const updateConversationTheme = async () => {
    setLocalLoading(true);
    if (conversationId) {
      await changeConversationTheme(conversationId, selectedThemeId);

      if (error == null) {
        onClose();

        toast.success(`The theme for this conversation has been set to ${selectedTheme?.label}.`);
      } else {
        toast.error(`Something went wrong when changing the theme to ${selectedTheme?.label}.`);
        setLocalLoading(false);
      }
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

    if (open) {
      updateLocalLoading();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col h-125 min-w-175 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex w-full justify-center">Change theme</DialogTitle>
          {changedBy != null && changedAt != null && !localLoading && (
            <DialogDescription className="font-semibold text-sm">
              {changedBy} previously changed the theme to{' '}
              {
                <span className={`${activeConversationTheme?.sender} px-1 rounded-sm text-white`}>
                  {' '}
                  {activeConversationTheme?.label}
                </span>
              }{' '}
              on {formatDate(changedAt)}.
            </DialogDescription>
          )}
        </DialogHeader>

        {localLoading ? (
          <div className="flex-1 flex w-full min-h-0 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex-1 flex w-full gap-2 min-h-0">
            <div className="flex-1 flex flex-col gap-1 overflow-y-auto min-h-0">
              {themes.map((theme) => (
                <ThemeOption
                  key={theme.id}
                  id={theme.id}
                  label={theme.label}
                  color={theme.sender}
                  onSelect={setSelectedThemeId}
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 pt-2">
              <div className="flex w-full items-center gap-2 justify-end">
                <div
                  className={`flex rounded-2xl items-center py-2 px-3 whitespace-pre-wrap wrap-break-word ${selectedTheme?.sender} m-2`}
                >
                  <p>This is a sample sent message.</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-2 justify-start">
                <div
                  className={`flex rounded-2xl items-center py-2 px-3 whitespace-pre-wrap wrap-break-word ${selectedTheme?.receiver}  m-2`}
                >
                  <p>This is a sample received message.</p>
                </div>
              </div>

              <div className="flex flex-1 w-full justify-center items-center ">
                <h2 className="text-lg font-semibold">Click Select to select this theme.</h2>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full gap-2 ">
          <DialogClose asChild>
            <Button className="flex-1 cursor-pointer text-md" disabled={localLoading}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            className="flex-1 cursor-pointer text-md"
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
