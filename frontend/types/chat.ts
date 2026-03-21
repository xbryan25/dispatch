export interface Message {
  messageId: string;
  senderId: string;
  username: string;
  conversationId: string;
  content: string;
  createdAt: string;
  status: string;
}

export interface ConversationSnippet {
  conversationId: string;
  otherUserName: string;
  otherUserAvatar: string;
  latestMessage: string;
  latestMessageTime: string;
  hasSeenLatestMessage: boolean;
  latestMessageSenderId: string;
}

export interface OtherParticipantDetails {
  userId: string;
  username: string;
  profileImageUrl: string;
  friendshipStatus: string;
  isOnline: boolean;
  lastOnline: string | null;
  lastReadMessageId: string;
  lastReadMessageAt: string | null;
}

export type DateFormatters = 'hour' | 'currentWeek' | 'later';
