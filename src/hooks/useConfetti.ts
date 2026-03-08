import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = (options?: confetti.Options) => {
    const defaults: confetti.Options = {
      spread: 360,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FF4B4B', '#FFD700'],
    };

    confetti({
      ...defaults,
      ...options,
    });
  };

  const triggerSuccess = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#58CC02', '#1CB0F6', '#FF9600'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#CE82FF', '#FF4B4B', '#FFD700'],
      });
    }, 250);
  };

  const triggerLevelUp = () => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.95,
      startVelocity: 45,
      colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500'],
    };

    confetti({
      ...defaults,
      particleCount: 100,
      origin: { x: 0.5, y: 0.5 },
    });

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.3, y: 0.5 },
      });
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: 0.7, y: 0.5 },
      });
    }, 200);
  };

  return { triggerConfetti, triggerSuccess, triggerLevelUp };
};
