export const mockAIResponses: Record<string, string[]> = {
  greeting: [
    'Сәлем! Қазақ тілін үйренуге қош келдіңіз! (Hello! Welcome to learning Kazakh!)',
    'Қайырлы күн! Бүгін қазақ тілін үйренейік! (Good day! Let\'s learn Kazakh today!)',
    'Сәлеметсіз бе! Мен сізге көмектесуге дайынмын! (Hello! I\'m ready to help you!)',
  ],
  default: [
    'Қызықты сұрақ! (Interesting question!)',
    'Қазақ тілінде бұл былай айтылады... (In Kazakh, this is said as...)',
    'Жақсы сұрақ! Мен түсіндіріп берейін. (Good question! Let me explain.)',
    'Бұл сөздің мағынасы... (The meaning of this word is...)',
    'Қазақ тілінде бұл ереже маңызды. (This rule is important in Kazakh.)',
  ],
  grammar: [
    'Қазақ тілінде сөз тәртібі: Етістік-Зат Есім-Есімдік (Kazakh word order: Subject-Object-Verb)',
    'Жалғаулар қазақ тілінде өте маңызды. (Suffixes are very important in Kazakh.)',
    'Қазақ тілінде 7 көмекші сөз бар. (There are 7 cases in Kazakh.)',
  ],
  vocabulary: [
    'Бұл күнде қолданылатын кең тараған сөз. (This is a commonly used word.)',
    'Синонимдер: ... (Synonyms: ...)',
    'Бұл сөзді былай қолдануға болады... (This word can be used like this...)',
  ],
  pronunciation: [
    'Дыбысты былай айту керек... (The sound should be pronounced like this...)',
    'Қазақ тілінде буындар маңызды. (Syllables are important in Kazakh.)',
    'Ескерту: қазақ тілінде "ә" дыбысы ерекше. (Note: the sound "ә" is special in Kazakh.)',
  ],
  culture: [
    'Қазақ мәдениетінде бұл дәстүр... (In Kazakh culture, this tradition...)',
    'Қазақстанда бұл мейрам былай тойланады... (In Kazakhstan, this holiday is celebrated like this...)',
    'Қазақ халқының салты бойынша... (According to Kazakh customs...)',
  ],
  encouragement: [
    'Өте жақсы! (Very good!)',
    'Керемет! (Excellent!)',
    'Сіз прогресс жасап жатырсыз! (You are making progress!)',
    'Жарайсыз! (Well done!)',
    'Талпындырыңыз! (Keep trying!)',
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
