import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MentorAvatar } from '@/characters/MentorAvatar';

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to QazaqTili!',
    subtitle: 'Сәлеметсіз бе!',
    message:
      'I am Ilyas Zhansugurov, your guide on this exciting journey to learn the beautiful Kazakh language. Together, we will explore the rich culture and heritage of Kazakhstan.',
    emotion: 'happy' as const,
  },
  {
    id: 2,
    title: 'Learn Through Play',
    subtitle: 'Ойын арқылы үйрену',
    message:
      'Our lessons are designed like games - complete challenges, earn XP, maintain your streak, and unlock new characters as you progress from A1 to C2 level.',
    emotion: 'excited' as const,
  },
  {
    id: 3,
    title: 'Practice with AI',
    subtitle: 'AI-мен практика жасау',
    message:
      'Chat with our AI companion to practice conversations anytime. Get instant feedback and improve your speaking skills in a safe, supportive environment.',
    emotion: 'thinking' as const,
  },
  {
    id: 4,
    title: 'Join the Community',
    subtitle: 'Қауымдастыққа қосылу',
    message:
      'Compete with learners worldwide in leagues, earn achievements, and celebrate your progress. Learning is more fun together!',
    emotion: 'celebrating' as const,
  },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/test');
    }, 500);
  };

  const handleSkip = () => {
    navigate('/test');
  };

  const step = onboardingSteps[currentStep];

  // Список допустимых эмоций для MentorAvatar
  const allowedEmotions = ['happy', 'angry', 'normal', 'question', 'sad'] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isExiting && (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex gap-2 justify-center">
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-green-500 w-8' : 'bg-gray-300 dark:bg-gray-600 w-4'
                    }`}
                    initial={false}
                    animate={{ width: index <= currentStep ? 32 : 16 }}
                  />
                ))}
              </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12">
              {/* Skip button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Skip
                </button>
              </div>

              {/* Character */}
              <div className="flex justify-center mb-8">
                <MentorAvatar
                  size="lg"
                  emotion={
                    allowedEmotions.includes(step.emotion as any)
                      ? (step.emotion as any)
                      : 'normal'
                  }
                />
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                    {step.title}
                  </h2>
                  <p className="text-xl text-green-500 font-medium mb-4">{step.subtitle}</p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
                >
                  {step.message}
                </motion.p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} / {onboardingSteps.length}
                  </span>
                </div>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Start
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;