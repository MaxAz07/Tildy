import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Volume2, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatMessage } from '@/types';
import { MentorAvatar } from '@/characters/MentorAvatar';

type ChatMessageExt = ChatMessage & { meta?: any };

const API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";
const API_KEY = "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImI2ZGNjM2ZlLTIxNzAtNDJhNy1hYzU2LTY3NzM4ODdjNDIwYSIsImV4cCI6NDkyNTQzMTQzMn0.pHam4VqUF4KCcFqdk2V3MjpSQ8ICw0-_GRMRvv-B5GNZOUTsvU4cQ1W_ossl7MojJYkZnLLGwBdxbwf0ZW93Pg";

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageExt[]>([
    {
      id: 'welcome',
      sender: 'ai',
      message: 'Сәлем! Мен сіздің қазақ тілі мұғаліміңізбін. Бүгін не үйренгіңіз келеді?',
      timestamp: new Date(),
    } as ChatMessageExt,
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [clickedTranslations, setClickedTranslations] = useState<Record<string, { index: number; token: string; translation: string; explanation?: string }[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const escapeHtml = (unsafe: string) =>
    unsafe.replace(/[&<>"'`=\/]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#96;', '=': '&#61;' } as any)[s]);

  const parseJSONSafe = (text: string) => {
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonText = text.slice(firstBrace, lastBrace + 1);
        return JSON.parse(jsonText);
      }
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const fetchAIResponse = async (userText: string) => {
    const systemPrompt = `
Сен қазақ тілі репетиторсың және қолданушымен әңгімелесіп, диалог жүргізесің. 
Міндетің: жауап беріп қана қоймай, сұрақтар қойып, қолданушыны әңгімеге тарту.
- Жауаптарың қысқа емес, бірақ A2 деңгейінде болуы керек.
- Қолданушы қазақша жазса, қателерді түзетіп, JSON форматында corrections бер:
  corrections: [{ original: "...", corrected: "...", explanation_ru: "..." }, ...]
- Жауаптағы маңызды сөздерді JSON форматында word_translations бер:
  word_translations: [{ word: "...", translation_ru: "...", explanation_ru: "..." }, ...]
- JSON форматы міндетті: { reply, corrections (опционал), word_translations (опционал) }
- Егер JSON жасай алмаса, fallback ретінде reply ретінде қарапайым мәтін бер.
- Әңгімеде тақырыптарды әртүрлі етіп қой: хобби, музыка, спорт, саяхат, тағам т.б.
- Қолданушының жауабына байланысты жаңа сұрақ қойып, әңгімені жалғастыр.
`.trim();

    const body = {
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.message })),
        { role: "user", content: userText },
      ],
      temperature: 0.4,
      max_tokens: 600,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => null);
    const text = json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.text ?? null;

    if (!text) return { reply: 'Қате шықты. Қайта көріңіз.', corrections: [], word_translations: [] };

    const parsed = parseJSONSafe(text);

    if (parsed) {
      return {
        reply: parsed.reply ?? String(parsed),
        corrections: parsed.corrections ?? [],
        word_translations: parsed.word_translations ?? [],
      };
    } else {
      return { reply: text, corrections: [], word_translations: [] };
    }
  };

  const handleSend = async (text: string = inputMessage) => {
    if (!text.trim()) return;

    const userMsg: ChatMessageExt = {
      id: Date.now().toString(),
      sender: 'user',
      message: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResult = await fetchAIResponse(text);

      const aiMsg: ChatMessageExt = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: aiResult.reply,
        timestamp: new Date(),
        meta: {
          corrections: aiResult.corrections,
          word_translations: aiResult.word_translations,
        },
      };

      if (aiResult.corrections && aiResult.corrections.length > 0) {
        setMessages(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(m => m.id === userMsg.id);
          if (idx !== -1) {
            copy[idx] = { ...(copy[idx]), meta: { ...(copy[idx].meta ?? {}), corrections: aiResult.corrections } };
          }
          return [...copy, aiMsg];
        });
      } else {
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          message: 'Қате болды. Кейінірек қайталаңыз.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const onWordClick = (messageId: string, index: number, token: string, translation: string, explanation?: string) => {
    setClickedTranslations(prev => {
      const arr = prev[messageId] ? [...prev[messageId]] : [];
      const exists = arr.find(a => a.index === index);
      if (exists) {
        return { ...prev, [messageId]: arr.filter(a => a.index !== index) };
      } else {
        return { ...prev, [messageId]: [...arr, { index, token, translation, explanation }] };
      }
    });
  };

  const renderUserMessageWithCorrections = (msg: ChatMessageExt) => {
    const corrections = (msg.meta?.corrections ?? []) as { original: string; corrected: string; explanation_ru?: string }[];
    if (!corrections.length) return <p className="whitespace-pre-wrap">{msg.message}</p>;

    let html = escapeHtml(msg.message);
    for (const c of corrections) {
      if (!c.original) continue;
      const esc = c.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(esc, 'g');
      const replacement = `<span class="underline decoration-red-500 font-semibold" data-expl="${escapeHtml(c.explanation_ru ?? '')}">${escapeHtml(c.original)}</span>`;
      html = html.replace(re, replacement);
    }

    return (
      <>
        <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-2 space-y-1 text-sm">
          {corrections.map((c, i) => (
            <div key={i} className="bg-red-50 dark:bg-red-800/20 p-2 rounded">
              <div className="font-medium">Исправление: {c.original} → {c.corrected}</div>
              {c.explanation_ru && <div className="text-xs text-gray-600 dark:text-gray-300">{c.explanation_ru}</div>}
            </div>
          ))}
        </div>
      </>
    );
  };

  const tokenizePreserve = (text: string) => text.match(/[\w\u0400-\u04FF\u0600-\u06FF'’-]+|[^\s\w]+|\s+/g) || [];

  const renderAIMessageWithWordClicks = (msg: ChatMessageExt) => {
    const wt: { word: string; translation_ru: string; explanation_ru?: string }[] = msg.meta?.word_translations ?? [];
    const tokens = tokenizePreserve(msg.message);
    const transMap: Record<string, { translation: string; explanation?: string }[]> = {};
    for (const t of wt) {
      const key = t.word.toLowerCase();
      if (!transMap[key]) transMap[key] = [];
      transMap[key].push({ translation: t.translation_ru, explanation: t.explanation_ru });
    }

    return (
      <>
        <p className="whitespace-pre-wrap">
          {tokens.map((tok, idx) => {
            const trimmed = tok.trim();
            const key = trimmed.toLowerCase();
            const has = transMap[key] && trimmed !== '';
            if (has) {
              const first = transMap[key][0];
              return (
                <span
                  key={idx}
                  onClick={() => onWordClick(msg.id, idx, trimmed, first.translation, first.explanation)}
                  className="cursor-pointer hover:underline decoration-sky-400"
                  style={{ userSelect: 'none' }}
                  title={first.translation + (first.explanation ? ' — ' + first.explanation : '')}
                >
                  {tok}
                </span>
              );
            }
            return <span key={idx}>{tok}</span>;
          })}
        </p>

        {clickedTranslations[msg.id] && clickedTranslations[msg.id].length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {clickedTranslations[msg.id]
              .sort((a, b) => a.index - b.index)
              .map((c, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-2 rounded shadow-sm min-w-[140px]">
                  <div className="font-semibold">{c.token}</div>
                  <div className="text-sm text-sky-600">{c.translation}</div>
                  {c.explanation && <div className="text-xs text-gray-500 mt-1">{c.explanation}</div>}
                </div>
              ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MentorAvatar size="md" emotion="normal" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              Учитель <Sparkles className="w-5 h-5 text-yellow-500" />
            </h1>
            <p className="text-sm text-green-600 dark:text-green-400">Онлайн</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-green-500 to-blue-500'
                      }`}
                    >
                      {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>

                    <div className={`relative group ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'} rounded-2xl px-4 py-3`}>
                      {message.sender === 'user'
                        ? renderUserMessageWithCorrections(message)
                        : renderAIMessageWithWordClicks(message)}

                      {message.sender === 'ai' && (
                        <div className="absolute -bottom-8 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => copyToClipboard(message.message)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg" title="Скопировать">
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg" title="Прослушать">
                            <Volume2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg" title="Полезно">
                            <ThumbsUp className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg" title="Не полезно">
                            <ThumbsDown className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start p-2">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-2">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className="flex-1 h-12"
            />
            <Button onClick={() => handleSend()} disabled={!inputMessage.trim() || isTyping} className="h-12 px-6 bg-green-500 hover:bg-green-600">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};