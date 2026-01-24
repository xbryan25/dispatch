import ChatList from '@/components/chatList';
import ConversationArea from '@/components/conversationArea';

export default function MessagesPage() {
  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <ChatList />
      <ConversationArea />
    </div>
  );
}
