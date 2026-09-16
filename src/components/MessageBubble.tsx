import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (role === 'user') {
    return (
      <div className="flex justify-end mb-4 sm:mb-5 animate-[fadeIn_0.2s_ease-out]">
        <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] bg-user-bubble rounded-2xl px-4 py-3 text-warm-text">
          <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 sm:mb-5 group animate-[fadeIn_0.2s_ease-out]">
      <div className="max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] relative">
        <div className="markdown-content text-warm-text text-[15px] sm:text-base leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <button
          onClick={handleCopy}
          className="absolute -bottom-6 left-0 flex items-center gap-1 px-2 py-1 rounded-md text-xs text-warm-muted opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-cream-dark transition-all"
          aria-label="Copy message"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
