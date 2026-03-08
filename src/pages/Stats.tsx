import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Clock, 
  BookOpen, 
  MessageCircle,
  Award,
  Zap,
  Calendar
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';

const SkillBar: React.FC<{ label: string; value: number; color: string; icon: React.ElementType }> = ({
  label,
  value,
  color,
  icon: Icon,
}) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color }} />
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="font-bold text-gray-800 dark:text-white">{value}%</span>
    </div>
    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: 0.3 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
}> = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </motion.div>
);

const AchievementBadge: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  color: string;
}> = ({ title, description, icon: Icon, unlocked, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-4 rounded-xl border-2 transition-all ${
      unlocked
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          unlocked ? '' : 'grayscale'
        }`}
        style={{ backgroundColor: color }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${unlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500'}`}>
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {unlocked && (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  </motion.div>
);

export const Stats: React.FC = () => {
  const { user, stats } = useAuth();

  // Calculate skill levels based on progress
  const skills = {
    listening: Math.min(stats.lessonsCompleted * 10 + 20, 100),
    speaking: Math.min(stats.dialogsCompleted * 15 + 10, 100),
    reading: Math.min(stats.lessonsCompleted * 12 + 15, 100),
    writing: Math.min(stats.lessonsCompleted * 8 + 5, 100),
  };

  const achievements = [
    {
      title: 'Первый шаг',
      description: 'Пройдите ваш первый урок',
      icon: BookOpen,
      unlocked: stats.lessonsCompleted >= 1,
      color: '#58CC02',
    },
    {
      title: 'Серия 3 дня',
      description: 'Поддерживайте 3-дневную серию',
      icon: Flame,
      unlocked: stats.streak >= 3,
      color: '#FF9600',
    },
    {
      title: 'Охотник на XP',
      description: 'Заработайте 1000 XP',
      icon: Zap,
      unlocked: stats.totalXp >= 1000,
      color: '#FFD700',
    },
    {
      title: 'Мастер общения',
      description: 'Пройдите 10 диалогов с ИИ',
      icon: MessageCircle,
      unlocked: stats.dialogsCompleted >= 10,
      color: '#1CB0F6',
    },
    {
      title: 'Усердный ученик',
      description: 'Учите язык 7 дней подрядй',
      icon: Calendar,
      unlocked: stats.streak >= 7,
      color: '#CE82FF',
    },
    {
      title: 'Чемпион',
      description: 'Достигните #1 в вашей лиге',
      icon: Award,
      unlocked: false,
      color: '#FF4B4B',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Ваш Прогресс
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Отслеживайте ваше обучение и достигайте новых высот! Ваши достижения, навыки и активность в одном месте.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Общий XP"
          value={stats.totalXp.toLocaleString()}
          subtitle="Отличная работа!"
          icon={Zap}
          color="#FFD700"
          delay={0}
        />
        <StatCard
          title="Текущая серия"
          value={stats.streak}
          subtitle={`Самая длинная: ${stats.longestStreak} дней`}
          icon={Flame}
          color="#FF9600"
          delay={0.1}
        />
        <StatCard
          title="Уроков пройдено"
          value={stats.lessonsCompleted}
          subtitle="Отличная работа!"
          icon={BookOpen}
          color="#58CC02"
          delay={0.2}
        />
        <StatCard
          title="Время обучения"
          value={`${stats.timeSpent} часов`}
          subtitle="Общее время обучения"
          icon={Clock}
          color="#1CB0F6"
          delay={0.3}
        />
      </div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Навыки</h2>
            <p className="text-sm text-gray-500">Ваши языковые навыки</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <SkillBar
            label="Слушание"
            value={skills.listening}
            color="#58CC02"
            icon={BookOpen}
          />
          <SkillBar
            label="Устно"
            value={skills.speaking}
            color="#1CB0F6"
            icon={MessageCircle}
          />
          <SkillBar
            label="Чтение"
            value={skills.reading}
            color="#FF9600"
            icon={BookOpen}
          />
          <SkillBar
            label="Грамматика и письмо"
            value={skills.writing}
            color="#CE82FF"
            icon={TrendingUp}
          />
        </div>
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Еженедельная активность</h2>
            <p className="text-sm text-gray-500">Ваша последовательность обучения</p>
          </div>
        </div>

        <div className="flex justify-between items-end h-32 gap-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
            const activity = [80, 100, 60, 90, 40, 70, stats.streak > 0 ? 100 : 0][index];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${activity}%` }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`w-full rounded-t-lg ${
                    activity > 0 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Достижения</h2>
            <p className="text-sm text-gray-500">
              {achievements.filter(a => a.unlocked).length} из {achievements.length} разблокировано
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.title}
              {...achievement}
            />
          ))}
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Текущий уровень</p>
            <p className="text-3xl font-bold">{user?.level || 'A1'}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-1">Следующий уровень</p>
            <p className="text-xl font-semibold">
              {user?.level === 'A1' ? 'A2' : 
               user?.level === 'A2' ? 'B1' :
               user?.level === 'B1' ? 'B2' :
               user?.level === 'B2' ? 'C1' :
               user?.level === 'C1' ? 'C2' : 'Max'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={45} className="h-2 bg-white/20" />
          <p className="text-sm text-white/70 mt-2">
            Продолжайте учиться, чтобы достичь следующего уровня!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;
