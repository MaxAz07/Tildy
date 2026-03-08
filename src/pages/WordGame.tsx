import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, RefreshCw } from 'lucide-react';
import wordsData from '@/data/words.json';

type WordPair = { ru: string; kz: string };

// Берём все слова из всех категорий и превращаем в массив WordPair
const WORDS: WordPair[] = Object.values(wordsData).flat().map(w => ({
  ru: w.ru,
  kz: w.kk, // берём казахский из ключа "kk"
}));

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export const WordGame: React.FC = () => {
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [ruWords, setRuWords] = useState<WordPair[]>([]);
  const [kzWords, setKzWords] = useState<string[]>([]);
  const [selectedRu, setSelectedRu] = useState<WordPair | null>(null);
  const [fadingPair, setFadingPair] = useState<{ ru: string; kz: string } | null>(null);
  const [wrongPair, setWrongPair] = useState<{ ru: string; kz: string } | null>(null);

  const [availableWords, setAvailableWords] = useState<WordPair[]>(shuffle(WORDS));

  const nextWords = () => {
    const newWords = availableWords.slice(0, 5);
    setRuWords(newWords);
    setKzWords(shuffle(newWords.map(w => w.kz)));
    setAvailableWords(prev => prev.slice(newWords.length));
  };

  useEffect(() => {
    nextWords();
  }, []);

  const onSelectRu = (word: WordPair) => setSelectedRu(word);

  const onSelectKz = (kz: string) => {
    if (!selectedRu) return;

    if (selectedRu.kz === kz) {
      setScore(s => s + 50);
      setFadingPair({ ru: selectedRu.ru, kz });

      window.setTimeout(() => {
        setRuWords(prev => {
          const idx = prev.findIndex(w => w.ru === selectedRu.ru);
          const next = [...prev];
          if (idx !== -1) {
            if (availableWords.length > 0) next[idx] = availableWords[0];
            else next.splice(idx, 1);
          }
          return next;
        });

        setKzWords(prev => {
          const idx = prev.findIndex(k => k === kz);
          const next = [...prev];
          if (idx !== -1) {
            if (availableWords.length > 0) next[idx] = availableWords[0].kz;
            else next.splice(idx, 1);
          }
          return next;
        });

        if (availableWords.length > 0) setAvailableWords(prev => prev.slice(1));
        setFadingPair(null);
      }, 350);
    } else {
      setWrongPair({ ru: selectedRu.ru, kz });
      setLives(l => Math.max(l - 1, 0));
      window.setTimeout(() => setWrongPair(null), 500);
    }

    setSelectedRu(null);
  };

  const restart = () => {
    setLives(3);
    setScore(0);
    const shuffled = shuffle(WORDS);
    setAvailableWords(shuffled.slice(5));
    setRuWords(shuffled.slice(0, 5));
    setKzWords(shuffle(shuffled.slice(0, 5).map(w => w.kz)));
    setSelectedRu(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Соедини слова</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-red-500">
            <Heart className="w-5 h-5" />
            <span className="font-bold">{lives}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Zap className="w-5 h-5" />
            <span className="font-bold">{score}</span>
          </div>
          <button onClick={restart} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative">
        <div className="space-y-3">
          {ruWords.map(w => (
            <motion.button
              key={w.ru}
              initial={{ opacity: 0 }}
              animate={{ opacity: fadingPair?.ru === w.ru ? 0 : 1 }}
              transition={{ duration: 0.35 }}
              onClick={() => onSelectRu(w)}
              className={`w-full p-3 rounded-xl border text-left font-medium transition-colors
                ${wrongPair?.ru === w.ru ? 'border-red-500 bg-red-50 dark:bg-red-900/30' :
                selectedRu?.ru === w.ru ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' :
                'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
              `}
            >
              {w.ru}
            </motion.button>
          ))}
        </div>

        <div className="space-y-3">
          {kzWords.map(kz => (
            <motion.button
              key={kz}
              initial={{ opacity: 0 }}
              animate={{ opacity: fadingPair?.kz === kz ? 0 : 1 }}
              transition={{ duration: 0.35 }}
              onClick={() => onSelectKz(kz)}
              className={`w-full p-3 rounded-xl border text-left font-medium transition-colors
                ${wrongPair?.kz === kz ? 'border-red-500 bg-red-50 dark:bg-red-900/30' :
                fadingPair?.kz === kz ? 'border-green-500 bg-green-50 dark:bg-green-900/30' :
                'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
              `}
            >
              {kz}
            </motion.button>
          ))}
        </div>
      </div>

      {lives === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-red-500 font-semibold mb-3">Жизни закончились. Попробуй ещё раз!</p>
          <button onClick={restart} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Начать заново
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default WordGame;