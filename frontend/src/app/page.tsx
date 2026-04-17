'use client';

import { useEffect, useRef, useState, KeyboardEvent } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content:
        'สวัสดีครับ! ผมคือ AI วิเคราะห์ข้อมูลจาก 56-1 ONE Report ของเเต่ละหลักทรัพย์ ในประเทศไทย (สามารถเข้าไปดูข้อมูลเอกสารเพิ่มเติมได้ที่ https://www.set.or.th/th/home)',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        role: 'ai',
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'ขออภัยครับ เกิดข้อผิดพลาดในการติดต่อระบบ โปรดลองอีกครั้งในภายหลัง',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FC7158] text-xl font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                RAG Assistant
              </p>
              <h1 className="text-lg font-semibold text-white md:text-2xl">
                56-1 ONE Report RAG Advisor
              </h1>
            </div>
          </div>

          <div className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 md:block">
            Backend: Connected
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 pb-32">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'ai' && (
              <div className="mr-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                AI
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-7 md:max-w-[75%] ${
                message.role === 'user'
                  ? 'rounded-br-md bg-blue-600 text-white shadow-lg'
                  : 'rounded-bl-md border border-slate-800 bg-slate-900 text-slate-100 shadow-lg'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>

              {message.role === 'ai' &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-4 border-t border-slate-700 pt-3 text-xs text-slate-300">
                    <p className="mb-2 font-semibold text-cyan-300">
                      แหล่งข้อมูล:
                    </p>
                    <ul className="list-disc space-y-1 pl-5">
                      {message.sources.map((source, sIdx) => (
                        <li key={sIdx}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              AI
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm italic text-slate-400">
              กำลังประมวลผล...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-5xl p-4">
          <div className="flex items-end gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-2xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ถามคำถามได้เลย..."
              className="min-h-[56px] flex-grow resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              rows={1}
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`flex h-14 items-center gap-2 rounded-xl px-6 font-semibold text-white transition-colors ${
                isLoading || !input.trim()
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
              {!isLoading && <span className="text-lg">↗</span>}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}