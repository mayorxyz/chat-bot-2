import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 sm:mb-5">
      <div className="flex items-center gap-1.5 px-1 py-2">
        <div className="typing-dot w-2 h-2 rounded-full bg-warm-muted/60" />
        <div className="typing-dot w-2 h-2 rounded-full bg-warm-muted/60" />
        <div className="typing-dot w-2 h-2 rounded-full bg-warm-muted/60" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
      <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C15F3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-warm-text mb-2">How can I help you today?</h2>
      <p className="text-sm sm:text-base text-warm-muted text-center max-w-sm">
        Ask me anything — I'm here to help with questions, creative tasks, coding, analysis, and more.
      </p>
    </div>
  );
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
