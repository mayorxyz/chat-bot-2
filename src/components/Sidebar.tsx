import { MessageSquarePlus, Trash2, X, MessageCircle } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  createdAt: number;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Sidebar({
  conversations,
  activeId,
  isOpen,
  onClose,
  onSelect,
  onNewChat,
  onDelete,
}: SidebarProps) {
  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full z-50 md:z-auto w-[280px] sm:w-[300px] bg-cream-dark/70 border-r border-border-light flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
          <h2 className="text-sm font-semibold text-warm-text uppercase tracking-wide">
            Chat History
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors text-warm-muted hover:text-warm-text md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 py-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-terracotta/10 hover:bg-terracotta/15 text-terracotta font-medium text-sm transition-colors"
          >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageCircle size={28} className="text-warm-muted/40 mb-3" />
              <p className="text-sm text-warm-muted/60">
                No conversations yet
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    conv.id === activeId
                      ? 'bg-cream shadow-sm border border-border-light'
                      : 'hover:bg-cream/60'
                  }`}
                  onClick={() => handleSelect(conv.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate leading-snug ${
                        conv.id === activeId
                          ? 'text-warm-text font-medium'
                          : 'text-warm-text/80'
                      }`}
                    >
                      {conv.title}
                    </p>
                    <p className="text-[11px] text-warm-muted/60 mt-0.5">
                      {formatDate(conv.createdAt)} · {conv.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-warm-muted hover:text-red-500 transition-all"
                    aria-label="Delete conversation"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-border-light">
          <p className="text-[11px] text-warm-muted/50 text-center">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </aside>
    </>
  );
}
