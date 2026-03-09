import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Zap, TrendingUp, Clock, Users } from 'lucide-react';
import { leaderboardData, currentUserData } from '@/data/leaderboard';
import { useAuth } from '@/context/AuthContext';

const leagueTiers = [
  { name: 'Бронза', color: '#CD7F32', minXp: 0 },
  { name: 'Серебро', color: '#C0C0C0', minXp: 1000 },
  { name: 'Золото', color: '#FFD700', minXp: 3000 },
  { name: 'Сапфир', color: '#0F52BA', minXp: 6000 },
  { name: 'Рубин', color: '#E0115F', minXp: 10000 },
  { name: 'Алмаз', color: '#B9F2FF', minXp: 15000 },
];

const getLeagueForXp = (xp: number) => {
  for (let i = leagueTiers.length - 1; i >= 0; i--) {
    if (xp >= leagueTiers[i].minXp) {
      return leagueTiers[i];
    }
  }
  return leagueTiers[0];
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">{rank}</span>;
  }
};

export const League: React.FC = () => {
  const { stats } = useAuth();
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');
  
  const currentLeague = getLeagueForXp(stats.totalXp);
  const nextLeague = leagueTiers.find(t => t.minXp > stats.totalXp);
  const progressToNext = nextLeague 
    ? ((stats.totalXp - currentLeague.minXp) / (nextLeague.minXp - currentLeague.minXp)) * 100
    : 100;

  const allUsers = [...leaderboardData];
  const userInLeaderboard = allUsers.find(u => u.isCurrentUser);
  if (!userInLeaderboard) {
    allUsers.push({ ...currentUserData, xp: stats.totalXp });
  }
  
  const sortedUsers = allUsers.sort((a, b) => b.xp - a.xp);
  
  sortedUsers.forEach((user, index) => {
    user.rank = index + 1;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Алмазная лига
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Соревнуйтесь с учениками со всего мира
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentLeague.color }}
            >
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Текущая лига</p>
              <p className="text-2xl font-bold">{currentLeague.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Ваш ранг</p>
            <p className="text-3xl font-bold">#{currentUserData.rank}</p>
          </div>
        </div>

        {nextLeague && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Прогресс до {nextLeague.name}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-sm text-white/70 mt-2">
              Нужно {nextLeague.minXp - stats.totalXp} XP для {nextLeague.name}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalXp}</p>
          <p className="text-sm text-gray-500">Всего XP</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.streak}</p>
          <p className="text-sm text-gray-500">Дней подряд</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{sortedUsers.length}</p>
          <p className="text-sm text-gray-500">Участники</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'weekly'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Эта неделя
        </button>
        <button
          onClick={() => setActiveTab('alltime')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'alltime'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          За всё время
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white">Таблица лидеров</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Сброс через 3 дня</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {sortedUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 ${
                user.isCurrentUser
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="w-10 flex justify-center">
                {getRankIcon(user.rank)}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.name[0].toUpperCase()}
                </span>
              </div>

              <div className="flex-1">
                <p className={`font-semibold ${
                  user.isCurrentUser
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {user.name}
                  {user.isCurrentUser && (
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      ВЫ
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-800 dark:text-white">
                  {user.xp.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Уровни лиги
        </h3>
        <div className="flex flex-wrap gap-3">
          {leagueTiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                tier.name === currentLeague.name
                  ? 'ring-2 ring-offset-2 ring-green-500'
                  : ''
              }`}
              style={{ backgroundColor: `${tier.color}20` }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {tier.name}
              </span>
              <span className="text-xs text-gray-500">
                {tier.minXp.toLocaleString()}+
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default League;