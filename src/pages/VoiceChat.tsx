import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentorAvatar } from "@/characters/MentorAvatar";

type Message = { role: "user" | "assistant"; content: string };

const WS_URL = "ws://127.0.0.1:8000/ws";

const VoiceChat: React.FC = () => {
  const [lastReply, setLastReply] = useState("Сәлем! Не істегейді?");
  const [history, setHistory] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);

  // ======================= WebSocket =======================
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.text) {
        setLastReply(data.text);
        setHistory((prev) => [...prev, { role: "assistant", content: data.text }]);
      }
      if (data.audio) {
        const audio = new Audio("data:audio/wav;base64," + data.audio);
        audio.play();
      }
      if (data.time !== undefined) {
        setResponseTime(data.time);
      }
      setIsTyping(false);
    };
    ws.onclose = () => console.log("WS closed");
    wsRef.current = ws;
    return () => ws.close();
  }, []);

  // ======================= Голосовой ввод =======================
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "kk-KZ";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setInterimText("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setHistory((prev) => [...prev, { role: "user", content: transcript }]);
      recognition.stop();
      setListening(false);
      handleSendMessage(transcript);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  // ======================= Отправка текста на сервер =======================
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setIsTyping(true);
    wsRef.current?.send(JSON.stringify({ text }));
  };

  // ======================= UI =======================
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <motion.div
          animate={isTyping ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative z-10"
        >
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 blur-2xl animate-pulse" />
          <MentorAvatar size="lg" emotion={isTyping ? "question" : "normal"} />
        </motion.div>

        {isTyping && (
          <div className="mt-8 flex items-center gap-3 text-emerald-400 font-medium">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-lg">Ілияс ойлануда...</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900/95 border-t border-slate-800 p-10 pb-14 rounded-t-[50px] shadow-2xl">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="min-h-[60px] w-full">
            <p className="text-xl text-slate-200 leading-relaxed">
              {listening ? <span className="text-emerald-400 italic">Тыңдап тұрмын...</span> : `"${lastReply}"`}
            </p>
            {responseTime !== null && !listening && (
              <p className="text-sm text-slate-400 mt-1">Ответ за {responseTime} сек</p>
            )}
          </div>

          <Button
            onClick={() => recognitionRef.current?.start()}
            disabled={isTyping || listening}
            className={`h-24 w-24 rounded-full transition-all duration-500 flex items-center justify-center ${
              listening ? "bg-red-500 scale-110 shadow-red-500/50" : "bg-emerald-600 shadow-emerald-500/20"
            }`}
          >
            <Mic size={40} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;