import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserStats } from '@/types';

interface AuthContextType {
  user: User | null;
  stats: UserStats;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
}

const defaultStats: UserStats = {
  totalXp: 0,
  streak: 0,
  longestStreak: 0,
  lessonsCompleted: 0,
  dialogsCompleted: 0,
  timeSpent: 0,
  skills: {
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('qazaqtili-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('qazaqtili-stats');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('qazaqtili-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qazaqtili-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('qazaqtili-stats', JSON.stringify(stats));
  }, [stats]);

  // Check streak on mount
  useEffect(() => {
    if (user) {
      const lastActive = new Date(user.lastActive);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Streak broken
        setStats(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, [user]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      level: 'A1',
      xp: stats.totalXp,
      streak: stats.streak,
      lastActive: new Date().toISOString(),
      completedLessons: [],
    };
    setUser(mockUser);
    return true;
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    // Mock register
    const mockUser: User = {
      id: '1',
      email,
      name,
      level: 'A1',
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      completedLessons: [],
    };
    setUser(mockUser);
    setStats(defaultStats);
    return true;
  };

  const logout = () => {
    setUser(null);
    setStats(defaultStats);
    localStorage.removeItem('qazaqtili-user');
    localStorage.removeItem('qazaqtili-stats');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateStats = (updates: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  };

  const addXp = (amount: number) => {
    setStats(prev => {
      const newTotalXp = prev.totalXp + amount;
      return { ...prev, totalXp: newTotalXp };
    });
    if (user) {
      setUser(prev => prev ? { ...prev, xp: prev.xp + amount } : null);
    }
  };

  const completeLesson = (lessonId: string) => {
    if (user && !user.completedLessons.includes(lessonId)) {
      const updatedLessons = [...user.completedLessons, lessonId];
      setUser({ ...user, completedLessons: updatedLessons });
      setStats(prev => ({
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        updateStats,
        addXp,
        completeLesson,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
