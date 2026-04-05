export type Notification = {
  notificationId: string;
  type: string;
  content: string;
  createdAt: string;
  isReadByReceiver: boolean;
  senderUsername: string;
};

export type NotificationsToShow = 10 | 25 | 50;
export type ReadState = 'unread' | 'read';
export type ReadStateForSelect = ReadState | 'all';
