import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Volume2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { placementTestQuestions } from '@/data/lessons';
import { useAuth } from '@/context/AuthContext';
import { useConfetti } from '@/hooks/useConfetti';

export const PlacementTest: React.FC = () => {
  const navigate = useNavigate();
  const { addXp } = useAuth();
  const { triggerSuccess } = useConfetti();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = placementTestQuestions[currentQuestion];
  const progress = ((currentQuestion) / placementTestQuestions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < placementTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setShowResults(true);
      if (score >= 2) {
        triggerSuccess();
        addXp(100);
      }
    }
  };

  const handleFinish = () => {
    navigate('/');
  };

  const getRecommendedLevel = () => {
    if (score <= 1) return 'A1';
    if (score === 2) return 'A2';
    if (score === 3) return 'B1';
    return 'B2';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-4xl font-bold text-white">{score}/{placementTestQuestions.length}</span>
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Test Complete!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Based on your answers, we recommend starting at level:
          </p>

          <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl mb-6">
            <span className="text-4xl font-bold">{getRecommendedLevel()}</span>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
              <span>+100 XP earned!</span>
            </div>
            <p className="text-sm text-gray-500">
              You can always adjust your level in settings later.
            </p>
          </div>

          <Button
            onClick={handleFinish}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl"
          >
            Start Learning
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Placement Test
            </h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {placementTestQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 lg:p-8"
          >
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                {question.type === 'listen' && (
                  <button className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-6 h-6 text-blue-500" />
                  </button>
                )}
                <div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    {question.question}
                  </h3>
                  {question.questionKz && (
                    <p className="text-gray-500 dark:text-gray-400">{question.questionKz}</p>
                  )}
                </div>
              </div>

              {/* Hint */}
              {question.hint && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <Lightbulb className="w-4 h-4" />
                  <span>Hint: {question.hint}</span>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === question.correctAnswer;
                
                let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ';
                
                if (!isAnswered) {
                  buttonClass += 'border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20';
                } else if (isCorrectAnswer) {
                  buttonClass += 'border-green-500 bg-green-100 dark:bg-green-900/30';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += 'border-red-500 bg-red-100 dark:bg-red-900/30';
                } else {
                  buttonClass += 'border-gray-200 dark:border-gray-700 opacity-50';
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={buttonClass}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 dark:text-white font-medium">{option}</span>
                      {isAnswered && isCorrectAnswer && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {isAnswered && isSelected && !isCorrectAnswer && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl ${
                  isCorrect
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {isCorrect ? (
                    <>
                      <Check className="w-5 h-5" />
                      Correct! Well done!
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      Incorrect. The answer is: {question.correctAnswer}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl"
                >
                  {currentQuestion === placementTestQuestions.length - 1 ? 'Finish' : 'Continue'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PlacementTest;
