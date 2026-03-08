import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Bell, 
  Volume2, 
  Globe, 
  User, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  onClick,
  danger 
}) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
      onClick ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
      danger 
        ? 'bg-red-100 dark:bg-red-900/30' 
        : 'bg-gray-100 dark:bg-gray-700'
    }`}>
      <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
    </div>
    <div className="flex-1 text-left">
      <p className={`font-medium ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
        {title}
      </p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
    {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
    {onClick && !action && (
      <ChevronRight className="w-5 h-5 text-gray-400" />
    )}
  </motion.button>
);

export const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Настройки
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Меняй все под себя - от внешнего вида до уведомлений и аккаунта. Все для твоего удобства!
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold">{user?.name[0].toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-white/80">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Level {user?.level}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {user?.xp} XP
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">Внешний вид</h2>
        </div>
        <div className="p-2">
          <SettingItem
            icon={isDark ? Moon : Sun}
            title="Темная тема"
            description={isDark ? 'Темная тема включена' : 'Светлая тема включена'}
            action={
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
            }
          />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">Уведомления</h2>
        </div>
        <div className="p-2 space-y-1">
          <SettingItem
            icon={Bell}
            title="Всплывающие уведомления"
            description="Получать уведомления о достижениях"
            action={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            }
          />
          <SettingItem
            icon={Volume2}
            title="Звуковые эффекты"
            description="Проигрывать звуки во время уроков"
            action={
              <Switch
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            }
          />
          <SettingItem
            icon={Mail}
            title="Ежедневное напоминание"
            description="Напоминать о ежедневной практике"
            action={
              <Switch
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            }
          />
        </div>
      </motion.div>

      {/* Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">Обучение</h2>
        </div>
        <div className="p-2 space-y-1">
          <SettingItem
            icon={Globe}
            title="Язык интерфейса"
            description="Русский (RU)"
            onClick={() => {}}
          />
          <SettingItem
            icon={User}
            title="Настройки аккаунта"
            description="Управление вашим профилем"
            onClick={() => {}}
          />
          <SettingItem
            icon={Shield}
            title="Конфиденциальность и безопасность"
            description="Настройки безопасности и конфиденциальности"
            onClick={() => {}}
          />
        </div>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-white">Support</h2>
        </div>
        <div className="p-2 space-y-1">
          <SettingItem
            icon={HelpCircle}
            title="Поддержка и FAQ"
            description="Получите помощь и ответы на часто задаваемые вопросы"
            onClick={() => {}}
          />
          <SettingItem
            icon={Lock}
            title="Правила и условия использования"
            onClick={() => {}}
          />
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
      >
        <div className="p-2">
          <SettingItem
            icon={LogOut}
            title="Выход из аккаунта"
            danger
            onClick={() => setShowLogoutConfirm(true)}
          />
        </div>
      </motion.div>

      {/* Version */}
      <p className="text-center text-sm text-gray-400">
        QazaqTili v1.0.0
      </p>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Выход из аккаунта
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Вы уверены, что хотите выйти из аккаунта? Ваш прогресс будет сохранен.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Выйти
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
