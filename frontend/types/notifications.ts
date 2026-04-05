export type Notification = {
  notificationId: string;
  type: string;
  content: string;
  createdAt: string;
  isSeenByReceiver: boolean;
  senderUsername: string;
};

export type NotificationsToShow = 10 | 25 | 50;
export type ReadState = 'unread' | 'read';
