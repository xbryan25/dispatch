export type Notification = {
  notificationId: string;
  type: string;
  content: string;
  createdAt: string;
  isSeenByReceiver: boolean;
  senderUsername: string;
};
