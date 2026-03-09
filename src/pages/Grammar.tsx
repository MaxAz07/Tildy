import React from 'react';
import { useNavigate } from 'react-router-dom';

const RulesAndDictionaryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Правила и грамматика
      </h1>

      {/* Основной блок для правил */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Здесь собраны все правила казахского языка
        </h2>
      </div>

      {/* Мини-блок словаря */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-md flex justify-between items-center">
        <p className="text-gray-800 dark:text-white font-medium">
          Словарь (9000 слов)
        </p>
        <button
          onClick={() => navigate('/dictionary')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Перейти в словарь
        </button>
      </div>
    </div>
  );
};

export default RulesAndDictionaryPage;