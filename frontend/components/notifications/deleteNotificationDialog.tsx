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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete notification{notificationIds.length > 1 ? 's' : ''}</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            {notificationIds.length > 1
              ? `the ${notificationIds.length} selected notifications`
              : 'this notification'}
            ?
          </DialogDescription>

          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
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
