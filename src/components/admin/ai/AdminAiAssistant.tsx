'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I can see everything in your Inquiries inbox and your site's content stats. Ask me to summarize open requests, draft a reply, or point out what needs attention first.",
};

const SUGGESTIONS = [
  'Summarize everything that\u2019s still open',
  'Which requests look most urgent?',
  'Draft a reply to the most recent quote request',
];

export default function AdminAiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages([
          ...nextMessages,
          { role: 'assistant', content: data.error ?? 'Something went wrong. Please try again.' },
        ]);
        return;
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-6 space-y-1.5">
        <div className="flex items-center gap-2">
          <Bot className="text-accent h-6 w-6" />
          <h1 className="font-display text-text-primary text-3xl font-bold tracking-tight">
            AI Assistant
          </h1>
        </div>
        <p className="text-text-secondary max-w-xl text-sm">
          Grounded in your live inbox and content stats &mdash; ask it to summarize, prioritize, or
          draft replies.
        </p>
      </div>

      <div className="border-border bg-surface/30 flex flex-1 flex-col overflow-hidden rounded-xl border">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text-primary'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface flex items-center gap-2 rounded-lg px-4 py-2.5">
                <Loader2 size={14} className="text-accent animate-spin" />
                <span className="text-text-secondary text-xs">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="border-border flex flex-wrap gap-2 border-t px-5 py-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="border-border text-text-secondary hover:text-text-primary hover:border-accent/40 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors"
              >
                <Sparkles size={12} />
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="border-border flex items-center gap-2 border-t p-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your inbox or content stats..."
            disabled={isLoading}
            className="border-border bg-background text-text-primary placeholder:text-text-secondary focus-visible:ring-accent flex-1 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}