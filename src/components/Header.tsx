import { MessageSquarePlus } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
}

export default function Header({ onNewChat }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border-light bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-terracotta flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-base sm:text-lg font-semibold text-warm-text">Chat Assistant</h1>
      </div>
      <button
        onClick={onNewChat}
        className="p-2.5 rounded-xl hover:bg-cream-dark transition-colors text-warm-muted hover:text-warm-text"
        aria-label="New chat"
        title="New chat"
      >
        <MessageSquarePlus size={20} />
      </button>
    </header>
  );
}
