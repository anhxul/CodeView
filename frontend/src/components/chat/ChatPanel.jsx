import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatPanel({ messages, onSend, loading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="glass mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
              <MessageSquare className="h-7 w-7 text-accent" />
            </div>
            <h3 className="font-semibold">AI Chat Assistant</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Ask questions about your code, request optimizations, or get explanations.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => <ChatMessage key={idx} role={msg.role} content={msg.content} />)
        )}
        {loading && (
          <ChatMessage role="assistant" content="_Thinking..._" />
        )}
      </div>
      <ChatInput onSend={onSend} loading={loading} />
    </div>
  );
}