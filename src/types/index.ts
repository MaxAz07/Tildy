// Types for QazaqTili App

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
}

export interface Lesson {
  id: string;
  title: string;
  titleKz: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  order: number;
  xpReward: number;
  isLocked: boolean;
  isCompleted: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'translate' | 'listen' | 'speak';
  question: string;
  questionKz?: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

export interface Character {
  id: string;
  name: string;
  nameKz: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  description: string;
  descriptionKz: string;
  color: string;
  isUnlocked: boolean;
  unlockXp: number;
  avatar: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface UserStats {
  totalXp: number;
  streak: number;
  longestStreak: number;
  lessonsCompleted: number;
  dialogsCompleted: number;
  timeSpent: number; // in minutes
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}
