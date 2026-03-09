import React, { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { Lock, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import kozaSmile from '@/data/Characters/koza/smile.png';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface Character {
  id: string;
  name: string;
  nameKz: string;
  level: Level;
  color: string;
  unlockXp: number;
  description: string;
  descriptionKz: string;
  image?: string;
  isKoza?: boolean;
}

const characters: Character[] = [
  {
    id: 'koza_1',
    name: 'Koza',
    nameKz: 'Коза',
    level: 'A1',
    color: '#22C55E',
    unlockXp: 0,
    description: 'Весёлая и дружелюбный, помогает начать обучение.',
    descriptionKz: 'Оқуды бастауға көмектесетін көңілді ешкі.',
    image: kozaSmile,
    isKoza: true,
  },
  { id: 'a1_2', name: 'Aruzhan', nameKz: 'Аружан', level: 'A1', color: '#06B6D4', unlockXp: 150, description: 'Поддерживающий наставник, сосредоточенный на произношении.', descriptionKz: 'Айтылымға бағытталған қолдаушы тәлімгер.' },
  { id: 'a2_1', name: 'Dias', nameKz: 'Диас', level: 'A2', color: '#10B981', unlockXp: 400, description: 'Помогает изучать грамматику на практических примерах.', descriptionKz: 'Практикалық мысалдармен грамматиканы үйретеді.' },
  { id: 'a2_2', name: 'Madina', nameKz: 'Мадина', level: 'A2', color: '#14B8A6', unlockXp: 700, description: 'Партнёр по обучению, ориентированный на разговорную практику.', descriptionKz: 'Сөйлесу тәжірибесіне бағытталған серіктес.' },
  { id: 'b1_1', name: 'Timur', nameKz: 'Тимур', level: 'B1', color: '#F59E0B', unlockXp: 1200, description: 'Расширяет словарный запас и практическое использование языка.', descriptionKz: 'Сөздік қорды және қолдануды кеңейтеді.' },
  { id: 'b1_2', name: 'Amina', nameKz: 'Амина', level: 'B1', color: '#F97316', unlockXp: 1700, description: 'Интерактивные задания и мини-игры.', descriptionKz: 'Интерактивті тапсырмалар мен ойындар.' },
  { id: 'b2_1', name: 'Nurlan', nameKz: 'Нұрлан', level: 'B2', color: '#8B5CF6', unlockXp: 2500, description: 'Обучает продвинутым конструкциям и нюансам языка.', descriptionKz: 'Күрделі құрылымдар мен мағыналық реңктер.' },
  { id: 'b2_2', name: 'Kamila', nameKz: 'Камила', level: 'B2', color: '#A855F7', unlockXp: 3200, description: 'Дискуссии, дебаты и сложные темы.', descriptionKz: 'Пікірталас пен күрделі тақырыптар.' },
  { id: 'c1_1', name: 'Adil', nameKz: 'Әділ', level: 'C1', color: '#EF4444', unlockXp: 4200, description: 'Академическое и профессиональное владение языком.', descriptionKz: 'Академиялық және кәсіби еркіндік.' },
  { id: 'c1_2', name: 'Dana', nameKz: 'Дана', level: 'C1', color: '#DC2626', unlockXp: 5200, description: 'Точное выражение мыслей и аргументация.', descriptionKz: 'Нақты сөйлеу және дәлелдеу.' },
  { id: 'c2_1', name: 'Sanzhar', nameKz: 'Санжар', level: 'C2', color: '#111827', unlockXp: 7000, description: 'Мастерство языка на уровне носителя.', descriptionKz: 'Тілдің толық шеберлігі.' },
  { id: 'c2_2', name: 'Alina', nameKz: 'Алина', level: 'C2', color: '#1F2937', unlockXp: 9000, description: 'Элитный наставник для идеальной беглости.', descriptionKz: 'Мінсіз еркіндікке арналған элиталық ментор.' },
];

export const Characters: React.FC = () => {
  const { stats } = useAuth();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0]);
  const [isBlinking, setIsBlinking] = useState(false);

  const isUnlocked = stats.totalXp >= selectedCharacter.unlockXp;

  const progress =
    selectedCharacter.unlockXp === 0
      ? 100
      : Math.min((stats.totalXp / selectedCharacter.unlockXp) * 100, 100);

  useEffect(() => {
    if (!selectedCharacter.isKoza) return;

    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [selectedCharacter]);

  return (
    <div className="space-y-8">

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Всего заработано XP</p>
            <p className="text-4xl font-bold">
              {stats.totalXp.toLocaleString()}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 space-y-3">
          {characters.map((character) => {
            const unlocked = stats.totalXp >= character.unlockXp;
            const isSelected = selectedCharacter.id === character.id;

            return (
              <button
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isSelected ? 'bg-white shadow-xl border-green-500' : 'bg-white/60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    unlocked ? '' : 'grayscale opacity-50'
                  }`}
                  style={{ backgroundColor: character.color }}
                >
                  <span className="text-white font-bold text-lg">
                    {character.name[0]}
                  </span>
                </div>

                <div className="flex-1 text-left">
                  <p className={`font-semibold ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                    {character.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {character.level}
                  </p>
                </div>

                {!unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                {isSelected && <ChevronRight className="w-5 h-5 text-green-500" />}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            <div
              className="p-8 text-center"
              style={{ backgroundColor: selectedCharacter.color }}
            >
              {selectedCharacter.isKoza ? (
                <motion.img
                  src={selectedCharacter.image}
                  alt="koza"
                  className="mx-auto w-48 h-48 object-contain"
                  animate={isBlinking ? { scaleY: 0.9 } : { scaleY: 1 }}
                  transition={{ duration: 0.1 }}
                />
              ) : (
                <div className="w-48 h-48 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-white text-5xl">
                  {selectedCharacter.name[0]}
                </div>
              )}

              <h2 className="text-3xl font-bold text-white mt-6">
                {selectedCharacter.name}
              </h2>
            </div>

            <div className="p-8">
              <p className="text-gray-600">
                {selectedCharacter.description}
              </p>

              {!isUnlocked && (
                <div className="bg-gray-50 rounded-xl p-6 mt-6">
                  <div className="flex justify-between mb-3 text-sm">
                    <span>Прогресс разблокировки</span>
                    <span>
                      {stats.totalXp} / {selectedCharacter.unlockXp} XP
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              )}

              <Button
                className="w-full mt-6"
                style={{ backgroundColor: selectedCharacter.color }}
                disabled={!isUnlocked}
              >
                {isUnlocked
                  ? 'Начать обучение с ' + selectedCharacter.name
                  : 'Заблокировано'}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Characters;