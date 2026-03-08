import type { LeaderboardUser } from '@/types';

export const leaderboardData: LeaderboardUser[] = [
  { id: '1', name: 'Aizhan K.', avatar: 'aizhan', xp: 15420, rank: 1 },
  { id: '2', name: 'Bakyt Y.', avatar: 'bakyt', xp: 14850, rank: 2 },
  { id: '3', name: 'Dana M.', avatar: 'dana', xp: 14200, rank: 3 },
  { id: '4', name: 'Erlan T.', avatar: 'erlan', xp: 13890, rank: 4 },
  { id: '5', name: 'Gulnaz S.', avatar: 'gulnaz', xp: 13200, rank: 5 },
  { id: '6', name: 'Aruzhan A.', avatar: 'aruzhan', xp: 12500, rank: 6 },
  { id: '7', name: 'Nursultan B.', avatar: 'nursultan', xp: 11800, rank: 7 },
  { id: '8', name: 'Madina K.', avatar: 'madina', xp: 11200, rank: 8 },
  { id: '9', name: 'Yerbolat O.', avatar: 'yerbolat', xp: 10500, rank: 9 },
  { id: '10', name: 'Zarina T.', avatar: 'zarina', xp: 9800, rank: 10 },
];

export const currentUserData: LeaderboardUser = {
  id: 'current',
  name: 'You',
  avatar: 'user',
  xp: 8750,
  rank: 15,
  isCurrentUser: true,
};
