export const mockAIResponses: Record<string, string[]> = {
  greeting: [
    'Сәлем! Қазақ тілін үйренуге қош келдіңіз! (Привет! Добро пожаловать в изучение казахского языка!)',
    'Қайырлы күн! Бүгін қазақ тілін үйренейік! (Добрый день! Давайте сегодня изучать казахский язык!)',
    'Сәлеметсіз бе! Мен сізге көмектесуге дайынмын! (Здравствуйте! Я готов вам помочь!)',
  ],
  default: [
    'Қызықты сұрақ! (Интересный вопрос!)',
    'Қазақ тілінде бұл былай айтылады... (На казахском это говорится так...)',
    'Жақсы сұрақ! Мен түсіндіріп берейін. (Хороший вопрос! Позвольте объяснить.)',
    'Бұл сөздің мағынасы... (Значение этого слова...)',
    'Қазақ тілінде бұл ереже маңызды. (Это правило важно в казахском языке.)',
  ],
  grammar: [
    'Қазақ тілінде сөз тәртібі: Етістік-Зат Есім-Есімдік (Порядок слов в казахском языке: Подлежащее-Дополнение-Глагол)',
    'Жалғаулар қазақ тілінде өте маңызды. (Суффиксы очень важны в казахском языке.)',
    'Қазақ тілінде 7 көмекші сөз бар. (В казахском языке 7 падежей.)',
  ],
  vocabulary: [
    'Бұл күнде қолданылатын кең тараған сөз. (Это часто используемое слово.)',
    'Синонимдер: ... (Синонимы: ...)',
    'Бұл сөзді былай қолдануға болады... (Это слово можно использовать так...)',
  ],
  pronunciation: [
    'Дыбысты былай айту керек... (Звук нужно произносить так...)',
    'Қазақ тілінде буындар маңызды. (Слоги важны в казахском языке.)',
    'Ескерту: қазақ тілінде "ә" дыбысы ерекше. (Примечание: звук "ә" особенный.)',
  ],
  culture: [
    'Қазақ мәдениетінде бұл дәстүр... (В казахской культуре эта традиция...)',
    'Қазақстанда бұл мейрам былай тойланады... (В Казахстане этот праздник отмечают так...)',
    'Қазақ халқының салты бойынша... (Согласно казахским обычаям...)',
  ],
  encouragement: [
    'Өте жақсы! (Очень хорошо!)',
    'Керемет! (Отлично!)',
    'Сіз прогресс жасап жатырсыз! (Вы делаете прогресс!)',
    'Жарайсыз! (Молодец!)',
    'Талпындырыңыз! (Продолжайте стараться!)',
  ],
};

export const getRandomResponse = (category: keyof typeof mockAIResponses): string => {
  const responses = mockAIResponses[category] || mockAIResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
};

export const detectCategory = (message: string): keyof typeof mockAIResponses => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('grammar') || lowerMessage.includes('rule') || lowerMessage.includes('suffix')) {
    return 'grammar';
  }
  if (lowerMessage.includes('word') || lowerMessage.includes('vocabulary') || lowerMessage.includes('mean')) {
    return 'vocabulary';
  }
  if (lowerMessage.includes('pronounce') || lowerMessage.includes('sound') || lowerMessage.includes('say')) {
    return 'pronunciation';
  }
  if (lowerMessage.includes('culture') || lowerMessage.includes('tradition') || lowerMessage.includes('custom')) {
    return 'culture';
  }
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('сәлем')) {
    return 'greeting';
  }
  if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('thanks')) {
    return 'encouragement';
  }
  
  return 'default';
};