import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface InputBarProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function InputBar({ onSend, isLoading }: InputBarProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="w-full px-3 sm:px-4 pb-3 sm:pb-4 pt-2 bg-gradient-to-t from-cream via-cream to-cream/0">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end bg-input-bg border border-border-light rounded-2xl shadow-sm focus-within:border-terracotta/40 focus-within:shadow-md transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Chat Assistant..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent px-4 py-3.5 pr-12 text-[15px] sm:text-base text-warm-text placeholder:text-warm-muted/60 focus:outline-none leading-relaxed max-h-[200px] overflow-y-auto"
            style={{ minHeight: '52px' }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`absolute right-2 bottom-2.5 p-2 rounded-xl transition-all ${
              canSend
                ? 'bg-terracotta text-white hover:bg-terracotta-hover active:scale-95'
                : 'bg-cream-dark text-warm-muted/40 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-[11px] sm:text-xs text-warm-muted/50 mt-2">
          Chat Assistant can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
