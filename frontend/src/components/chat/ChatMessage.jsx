
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatMessage({ role, content }) {
  const isAssistant = role === 'assistant';

  return (
    <div className={cn('flex gap-3', isAssistant ? 'justify-start' : 'justify-end')}>
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-xl px-4 py-3 text-sm',
          isAssistant ? 'glass' : 'bg-primary text-primary-foreground'
        )}
      >
        <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black/30 prose-pre:rounded-lg">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}