import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Star, Zap, BookOpen} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { lessons } from '@/data/lessons';
import { characters } from '@/data/characters';
import { useAuth } from '@/context/AuthContext';
import type { Lesson } from '@/types';
import { Mic, Users, Gamepad2, BookOpenCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const LessonCard: React.FC<{
  lesson: Lesson;
  index: number;
  onClick: () => void;
}> = ({ lesson, index, onClick }) => {
  const { user } = useAuth();
  const isCompleted = user?.completedLessons.includes(lesson.id);
  const isLocked = lesson.isLocked && !isCompleted;

  const positionClass = index % 2 === 0 ? 'ml-0' : 'ml-24';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative ${positionClass}`}
    >
      {/* Connection line */}
      {index > 0 && (
        <div className="absolute -top-8 left-1/2 w-1 h-8 bg-gray-300 dark:bg-gray-600 -translate-x-1/2" />
      )}

      <button
        onClick={onClick}
        disabled={isLocked}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isLocked
            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
            : isCompleted
            ? 'bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/30'
            : 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg shadow-green-500/30'
        }`}
      >
        {isLocked ? (
          <Lock className="w-8 h-8 text-gray-400" />
        ) : isCompleted ? (
          <Check className="w-10 h-10 text-white" />
        ) : (
          <Star className="w-10 h-10 text-white" />
        )}

        {/* Floating XP badge */}
        {!isLocked && !isCompleted && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            +{lesson.xpReward}
          </div>
        )}
      </button>

      {/* Lesson info */}
      <div className="mt-3 text-center">
        <p className="font-semibold text-gray-800 dark:text-white">{lesson.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.titleKz}</p>
      </div>
    </motion.div>
  );
};

const UnitSection: React.FC<{
  title: string;
  subtitle: string;
  color: string;
  lessons: Lesson[];
  character: typeof characters[0];
}> = ({ title, subtitle, color, lessons, character }) => {
  const [showLesson, setShowLesson] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setShowLesson(true);
  };

  return (
    <div className="mb-12">
      {/* Unit Header */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Section 1, Unit 1</p>
            <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
            <p className="text-white/80">{subtitle}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Character Guide */}
      <div className="flex items-center gap-4 mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: character.color }}
        >
          <span className="text-white font-bold text-xl">{character.name[0]}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 dark:text-white">{character.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{character.description}</p>
        </div>
        <Button variant="outline" size="sm">
          Guide Me
        </Button>
      </div>

      {/* Lesson Path */}
      <div className="space-y-12 py-4">
        {lessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={index}
            onClick={() => handleLessonClick(lesson)}
          />
        ))}
      </div>

      {/* Lesson Modal */}
      {showLesson && currentLesson && (
        <LessonModal lesson={currentLesson} onClose={() => setShowLesson(false)} />
      )}
    </div>
  );
};

const LessonModal: React.FC<{
  lesson: Lesson;
  onClose: () => void;
}> = ({ lesson, onClose }) => {
  const { addXp, completeLesson } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const question = lesson.questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    if (correct) setCorrectCount(correctCount + 1);
  };

  const handleNext = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      addXp(lesson.xpReward);
      completeLesson(lesson.id);
    }
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Lesson Complete!
          </h2>
          <div className="space-y-2 mb-6">
            <p className="text-green-600 font-semibold">+{lesson.xpReward} XP</p>
            <p className="text-gray-600 dark:text-gray-400">
              {correctCount}/{lesson.questions.length} correct
            </p>
          </div>
          <Button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600">
            Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Progress */}
        <div className="mb-6">
          <Progress
            value={((currentQuestion) / lesson.questions.length) * 100}
            className="h-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {lesson.questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {question.question}
          </h3>
          {question.questionKz && (
            <p className="text-gray-500">{question.questionKz}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.correctAnswer;
            
            let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all ';
            
            if (!isAnswered) {
              buttonClass += 'border-gray-200 dark:border-gray-700 hover:border-green-400';
            } else if (isCorrectAnswer) {
              buttonClass += 'border-green-500 bg-green-100 dark:bg-green-900/30';
            } else if (isSelected) {
              buttonClass += 'border-red-500 bg-red-100 dark:bg-red-900/30';
            } else {
              buttonClass += 'border-gray-200 dark:border-gray-700 opacity-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              onClick={handleNext}
              className={`w-full ${
                isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {currentQuestion === lesson.questions.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </motion.div>
        )}

        <Button variant="ghost" onClick={onClose} className="w-full mt-3">
          Quit Lesson
        </Button>
      </motion.div>
    </div>
  );
};
export const Home: React.FC = () => {
  const navigate = useNavigate();

  const { user} = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Сәлем, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Готов продолжать учить казахский? Сегодня отличный день для новых достижений! 🚀
          </p>
        </div>

      </div>

      {/* Quick Actions */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <button
    onClick={() => navigate('/chat')}
    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
  >
    <Mic className="w-6 h-6 text-blue-500" />
    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Чат</span>
  </button>

  <button
    onClick={() => navigate('/voice')}
    className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
  >
    <Users className="w-6 h-6 text-purple-500" />
    <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Диалоги</span>
  </button>

  <button
    onClick={() => navigate('/Games')}
    className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
  >
    <Gamepad2 className="w-6 h-6 text-green-500" />
    <span className="text-sm font-medium text-green-700 dark:text-green-400">Игры</span>
  </button>

  <button
    onClick={() => navigate('/grammar')}
    className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
  >
    <BookOpenCheck className="w-6 h-6 text-pink-500" />
    <span className="text-sm font-medium text-pink-700 dark:text-pink-400">Правила</span>
  </button>
</div>

      {/* Learning Path */}
      <UnitSection
        title="Basics"
        subtitle="Негіздері"
        color="#58CC02"
        lessons={lessons.filter(l => l.level === 'A1')}
        character={characters[0]}
      />

      <UnitSection
        title="Elementary"
        subtitle="Бастапқы"
        color="#1CB0F6"
        lessons={lessons.filter(l => l.level === 'A2')}
        character={characters[1]}
      />
    </div>
  );
};

export default Home;
