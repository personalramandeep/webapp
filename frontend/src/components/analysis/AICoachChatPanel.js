import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamReply, hasAIKey } from '../../services/aiCoach';
import { SUGGESTED_AI_PROMPTS } from '../../mocks/fixtures';
import { useIdentity } from '../../contexts/IdentityContext';

const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const AICoachChatPanel = ({ isOpen, onClose, videoContext }) => {
  const { identity } = useIdentity();
  const scrollRef = useRef(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${identity.name.split(' ')[0]}! I've reviewed your analysis for "${videoContext?.title || 'your match'}". Your score was ${videoContext?.score ?? 72}/100 (grade ${videoContext?.grade ?? 'B'}). Your strongest skill was ${
        videoContext?.skills ? Object.entries(videoContext.skills).sort((a, b) => b[1] - a[1])[0][0] : 'endurance'
      }, and your focus area should be ${
        videoContext?.skills ? Object.entries(videoContext.skills).sort((a, b) => a[1] - b[1])[0][0] : 'defense'
      }. Ask me anything.`,
      createdAt: Date.now(),
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isStreaming]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed, createdAt: Date.now() };
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '', createdAt: Date.now() }]);
    setInput('');
    setIsStreaming(true);

    try {
      if (!hasAIKey) throw new Error('No API key');
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));
      for await (const chunk of streamReply({ context: videoContext, messages: history })) {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
        );
      }
    } catch (err) {
      console.error('AI stream failed:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "I'm having trouble connecting right now. Please try again in a moment." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#1A1A1A] border-l border-white border-opacity-5 z-[70] flex flex-col"
            data-testid="ai-chat-panel"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white border-opacity-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-kreeda-orange flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">KreedAI Coach</p>
                  <p className="text-gray-400 text-xs">Analyzing: {videoContext?.title || 'your match'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
                data-testid="ai-chat-close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-kreeda-orange text-white rounded-br-sm'
                        : 'bg-[#2a2a2a] text-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <p className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatTime(m.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="px-5 pb-3">
                <p className="text-gray-500 text-xs mb-2">Suggested</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_AI_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => send(p.prompt)}
                      className="text-left px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-white/5 rounded-lg text-xs text-gray-200 transition-colors"
                    >
                      <span className="mr-1">{p.emoji}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="px-5 py-4 border-t border-white border-opacity-5 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your analysis..."
                disabled={isStreaming}
                className="flex-1 bg-[#2a2a2a] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-kreeda-orange/50 disabled:opacity-60"
                data-testid="ai-chat-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="px-4 py-2 bg-kreeda-orange text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AICoachChatPanel;
