'use client';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface DeleteNotificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  notificationIds: string[];
}

export default function DeleteNotificationDialog({
  isOpen,
  onOpenChange,
  onSuccess,
  notificationIds,
}: DeleteNotificationDialogProps) {
  const { bulkDeleteNotifications, setDeleteLoading } = useNotificationsStore();

  const deleteLoading = useNotificationsStore((state) => state.deleteLoading);
  const deleteIsRateLimited = useNotificationsStore((state) => state.deleteIsRateLimited);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-stone-200 p-0 dark:border-stone-800">
        <DialogHeader className="px-6 pb-5 pt-6 text-left">
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-400">
            <span className="text-lg" aria-hidden="true">!</span>
          </div>
          <DialogTitle className="text-lg font-semibold tracking-tight">Delete notification{notificationIds.length > 1 ? 's' : ''}</DialogTitle>
          <DialogDescription className="pt-1 leading-6">
            Are you sure you want to remove{' '}
            {notificationIds.length > 1
              ? `the ${notificationIds.length} selected notifications`
              : 'this notification'}
            ?
          </DialogDescription>

          <div className="flex w-full gap-2 pt-2">
            <Button
              className="h-10 flex-1 cursor-pointer rounded-xl text-sm"
              onClick={async () => {
                await bulkDeleteNotifications(notificationIds);
                setDeleteLoading(false);
                onOpenChange(false);
                onSuccess?.();
              }}
              disabled={deleteLoading || deleteIsRateLimited}
            >
              {deleteLoading && <Spinner data-icon="inline-start" />}
              Confirm deletion
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
