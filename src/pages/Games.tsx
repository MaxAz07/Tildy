import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

type GameItem = {
  id: string;
  title: string;
  description: string;
  route?: string; // маршрут может быть undefined
};

const games: GameItem[] = [
  { id: 'words', title: 'Слова', description: 'Учим новые слова', route: '/game/words' },
  { id: 'quiz', title: 'Викторина', description: 'Проверим ваши знания' },
  { id: 'memory', title: 'Память', description: 'Игра на память' },
];

export const Games: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Gamepad2 className="w-8 h-8" />
        Игры
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {game.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
            </div>
            {game.route ? (
              <Button
                onClick={() => navigate(game.route!)}
                className="mt-4 bg-green-500 hover:bg-green-600"
              >
                Играть
              </Button>
            ) : (
              <Button disabled className="mt-4 bg-gray-400 cursor-not-allowed">
                В разработке
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;