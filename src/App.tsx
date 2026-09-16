import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import Sidebar from './components/Sidebar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const STORAGE_KEY = 'chat-assistant-conversations';
const SESSION_KEY = 'chatSessionId';
const MESSAGES_KEY = 'chatMessages';
const ACTIVE_ID_KEY = 'chatActiveId';

function loadActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota errors
  }
}

function saveActiveId(id: string | null) {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_ID_KEY);
    }
  } catch {
    // ignore
  }
}

function clearChatMessages() {
  try {
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(ACTIVE_ID_KEY);
  } catch {
    // ignore
  }
}

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
  } catch {
    // ignore access errors
  }
  const newId = crypto.randomUUID();
  try {
    localStorage.setItem(SESSION_KEY, newId);
  } catch {
    // ignore quota errors
  }
  return newId;
}

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveConversations(conversations: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // ignore quota errors
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  if (trimmed.length <= 40) return trimmed;
  return trimmed.slice(0, 40) + '…';
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(() => loadActiveId());
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());

  // Persist conversations to localStorage
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // Persist active conversation ID to localStorage
  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  // Auto-open sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId);
  const messages = activeConversation?.messages || [];

  // Persist visible messages to localStorage
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const handleSend = useCallback(async (message: string) => {
    const userMessage: Message = { role: 'user', content: message };

    // Determine conversation ID upfront
    let targetId: string;
    if (activeId) {
      targetId = activeId;
      setConversations(prev =>
        prev.map(c =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userMessage] }
            : c
        )
      );
    } else {
      targetId = generateId();
      const newConv: Conversation = {
        id: targetId,
        title: generateTitle(message),
        messages: [userMessage],
        createdAt: Date.now(),
      };
      setActiveId(targetId);
      setConversations(prev => [newConv, ...prev]);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || data.message || 'Sorry, I received an empty response.',
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c
        )
      );
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `I'm sorry, I encountered an error connecting to the server. Please try again.\n\n\`\`\`\n${error instanceof Error ? error.message : 'Unknown error'}\n\`\`\``,
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, errorMessage] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeId, sessionId]);

  const handleNewChat = useCallback(() => {
    setActiveId(null);
    // Clear persisted messages so refresh shows empty state
    clearChatMessages();
    // Generate a fresh session ID so the backend starts with clean context
    const freshId = crypto.randomUUID();
    try {
      localStorage.setItem(SESSION_KEY, freshId);
    } catch {
      // ignore quota errors
    }
    setSessionId(freshId);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  }, [activeId]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="h-[100dvh] flex bg-cream overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNewChat={handleNewChat} onToggleSidebar={handleToggleSidebar} isSidebarOpen={sidebarOpen} />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <InputBar onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
