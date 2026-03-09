import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Loader2 } from "lucide-react";
import { MentorAvatar } from "@/characters/MentorAvatar";

const SERVER_URL = "http://127.0.0.1:8000/chat";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const VoiceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Сәлем! Сөйлесуге дайынмын 👋" }
  ]);

  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // автоскролл
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // голосовой ввод
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "kk-KZ";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      setMessages((prev) => [
        ...prev,
        { role: "user", text: transcript }
      ]);

      recognition.stop();
      setListening(false);

      sendMessage(transcript);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  // отправка на сервер
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsTyping(true);

    try {
      const resp = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await resp.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.text }
      ]);

      if (data.audio) {
        const audio = new Audio("data:audio/wav;base64," + data.audio);
        audio.play();
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-gray-950 px-4">

      {/* Персонаж */}
      <div className="mt-10 flex flex-col items-center">

        <motion.div
          animate={isTyping ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <MentorAvatar
            size="lg"
            emotion={isTyping ? "question" : "normal"}
          />
        </motion.div>

        {isTyping && (
          <div className="flex items-center gap-2 mt-3 text-green-500">
            <Loader2 className="animate-spin" size={20} />
            Ілияс ойлануда...
          </div>
        )}
      </div>

      {/* Чат */}
      <div className="w-full max-w-xl flex-1 overflow-y-auto mt-10 space-y-4 pb-6">

        {messages.map((msg, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`px-4 py-3 rounded-2xl text-lg max-w-[75%] ${
                msg.role === "user"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
              }`}
            >
              {msg.text}
            </div>

          </motion.div>

        ))}

        <div ref={chatEndRef} />

      </div>

      {/* Кнопка микрофона */}
      <div className="pb-10 pt-4 flex flex-col items-center">

        <button
          onClick={() => recognitionRef.current?.start()}
          disabled={listening || isTyping}
          className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            listening
              ? "bg-red-500 scale-110"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <Mic size={32} className="text-white" />
        </button>

        {listening && (
          <p className="mt-3 text-green-500 italic">
            Тыңдап тұрмын...
          </p>
        )}

      </div>

    </div>
  );
};

export default VoiceChat;