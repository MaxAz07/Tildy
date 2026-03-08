// pages/Dictionary.tsx
import React, { useState } from "react";
import wordsDataRaw from "../data/words.json"; // путь к твоему JSON (от папки pages)
import { Input } from "../components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";

type Word = {
  ru: string;
  kk: string;
};

// тип словаря категорий, ключи соответствуют ключам JSON
export type Category = Record<string, Word[]>;

// приводим импорт к нужному типу
const wordsData = wordsDataRaw as Category;

const DictionaryPage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"ru" | "kk">("ru");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const categories = Object.keys(wordsData) as Array<keyof typeof wordsData>;

  // генерируем буквы алфавита
  const getAlphabet = () => {
    if (sortBy === "ru") {
      return "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
    } else {
      // Казахские буквы
      return "ААЁБГГДЕЁЖЗИЙККΛМННОӨПЁСТУҰФХХЦЧШЩТЫІЇЭЎА".split("").filter((v, i, a) => a.indexOf(v) === i).sort();
    }
  };

  const alphabet = getAlphabet();

  // результат после поиска/сортировки/фильтра по букве, сгруппированный по категориям
  const filteredByCategory: Record<string, Word[]> = React.useMemo(() => {
    const result: Record<string, Word[]> = {};
    const searchLower = search.toLowerCase();
    categories.forEach((cat) => {
      let words = wordsData[cat] || [];
      if (searchLower) {
        words = words.filter(
          (w) =>
            w.ru.toLowerCase().includes(searchLower) ||
            w.kk.toLowerCase().includes(searchLower)
        );
      }
      // фильтр по букве
      if (selectedLetter) {
        words = words.filter((w) => {
          const firstChar = w[sortBy].charAt(0).toUpperCase();
          return firstChar === selectedLetter;
        });
      }
      words = [...words].sort((a, b) => a[sortBy].localeCompare(b[sortBy], "ru"));
      result[cat] = words;
    });
    return result;
  }, [search, sortBy, selectedLetter, categories]);

  // посчитать общее количество слов
  const totalWordsCount = Object.values(filteredByCategory).reduce((sum, words) => sum + words.length, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Словарь</h1>

      <div className="flex flex-col gap-4 mb-6">
        <Input
          placeholder="Поиск слова..."
          className="w-full"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setSelectedLetter(null);
          }}
        />

        {/* выбор лангуажа для фильтра по буквам */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setSortBy("ru")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === "ru"
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Русский
          </button>
          <button
            onClick={() => setSortBy("kk")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === "kk"
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Казахский
          </button>
        </div>

        {/* алфавит для фильтра по первой букве */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedLetter === null
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Все
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Показываем общие коунты слов когда есть рер */}
      {(search !== "" || selectedLetter !== null) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Найдено слов: <span className="font-semibold">{totalWordsCount}</span>
        </p>
      )}

      {/* если есть слова после фильтра - показываем в одной таблице с названиями категорий */}
      {totalWordsCount > 0 && (
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Русский</TableHead>
              <TableHead>Казахский</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {categories
              .filter((cat) => filteredByCategory[cat].length > 0)
              .map((cat) => {
                const words = filteredByCategory[cat];
                return (
                  <React.Fragment key={cat}>
                    {/* Название категории */}
                    <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                      <TableCell colSpan={2} className="font-semibold text-gray-700 dark:text-gray-200">
                        {cat}
                      </TableCell>
                    </TableRow>
                    {/* Слова этой категории */}
                    {words.map((w, idx) => (
                      <TableRow key={`${cat}-${idx}`}>
                        <TableCell>{w.ru}</TableCell>
                        <TableCell>{w.kk}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
          </TableBody>
        </Table>
      )}

      {/* если нет ни одного слова при фильтрации */}
      {totalWordsCount === 0 && (search !== "" || selectedLetter !== null) && (
        <p className="text-center text-gray-500 py-8">Слова не найдены</p>
      )}
    </div>
  );
};

export default DictionaryPage;