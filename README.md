# QazaqTili - Learn Kazakh Language

A gamified language learning application built with React, TypeScript, and Tailwind CSS. Inspired by Duolingo, this app helps users learn the Kazakh language through interactive lessons, AI chat, and engaging game mechanics.

![QazaqTili Preview](https://via.placeholder.com/800x400/58CC02/FFFFFF?text=QazaqTili+App)

## Features

### Core Features
- **Authentication** - Email/password login with social login options (Google, Apple)
- **Onboarding** - Interactive introduction with animated mentor character (Ilyas Zhansugurov)
- **Placement Test** - Quick assessment to determine your starting level (A1-C2)
- **Interactive Lessons** - Gamified learning with multiple question types
- **AI Chat** - Practice conversations with an AI language teacher
- **Characters** - Unlock 6 unique characters as you progress through levels
- **Leagues** - Compete with other learners on the leaderboard
- **Statistics** - Track your progress, streak, and skill development
- **Settings** - Customize your experience with dark/light mode

### Game Mechanics
- **XP System** - Earn experience points for completing lessons
- **Streak** - Maintain daily learning streaks
- **Levels** - Progress through CEFR levels (A1, A2, B1, B2, C1, C2)
- **Achievements** - Unlock badges for reaching milestones
- **Leaderboards** - Compete with other learners in weekly leagues

### Technical Features
- **Dark Mode** - Full dark theme support
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Local Storage** - Progress saved locally between sessions
- **Smooth Animations** - Framer Motion powered transitions
- **Confetti Effects** - Celebration animations for achievements

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qazaqtili
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── characters/        # 2D character components with animations
│   ├── CharacterAvatar.tsx
│   └── MentorAvatar.tsx
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   └── Layout.tsx    # Main layout with navigation
├── context/          # React context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── data/             # Static data
│   ├── characters.ts
│   ├── chatResponses.ts
│   ├── leaderboard.ts
│   └── lessons.ts
├── hooks/            # Custom React hooks
│   ├── useConfetti.ts
│   └── useLocalStorage.ts
├── pages/            # Application pages
│   ├── Auth.tsx
│   ├── Characters.tsx
│   ├── Chat.tsx
│   ├── Home.tsx
│   ├── League.tsx
│   ├── Onboarding.tsx
│   ├── PlacementTest.tsx
│   ├── Settings.tsx
│   └── Stats.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app component
├── App.css           # App-specific styles
└── main.tsx          # Entry point
```

## Pages Overview

### 1. Authentication (`/login`)
- Email/password login
- Social login buttons (Google, Apple)
- Toggle between login and register
- Demo mode - any credentials work

### 2. Onboarding (`/onboarding`)
- 4-step introduction
- Animated mentor character
- Progress indicators
- Skip option available

### 3. Placement Test (`/test`)
- 4-question assessment
- Multiple choice questions
- Instant feedback
- Level recommendation
- XP reward for completion

### 4. Home (`/`)
- Learning path visualization
- Lesson cards with progress
- Quick action buttons
- Character guides
- Interactive lesson modal

### 5. AI Chat (`/chat`)
- Real-time messaging interface
- Mock AI responses
- Quick prompt suggestions
- Message actions (copy, listen)
- Typing indicators

### 6. Characters (`/characters`)
- 6 unlockable characters (A1-C2)
- Character details and lore
- Unlock progress tracking
- Level requirements display

### 7. League (`/league`)
- Weekly leaderboard
- League tier progression
- User rankings
- XP statistics
- League tier information

### 8. Statistics (`/stats`)
- XP and streak overview
- Skill progress bars
- Weekly activity chart
- Achievement badges
- Level progression

### 9. Settings (`/settings`)
- Dark mode toggle
- Notification preferences
- Account settings
- Privacy options
- Logout functionality

## Customization

### Adding New Lessons
Edit `src/data/lessons.ts`:

```typescript
export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Lesson Name',
    titleKz: 'Қазақша атауы',
    description: 'Lesson description',
    level: 'A1',
    order: 1,
    xpReward: 50,
    isLocked: false,
    isCompleted: false,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'Question text?',
        options: ['Option 1', 'Option 2', 'Option 3'],
        correctAnswer: 'Option 1',
        hint: 'Helpful hint',
      },
    ],
  },
];
```

### Adding New Characters
Edit `src/data/characters.ts`:

```typescript
{
  id: '7',
  name: 'NewCharacter',
  nameKz: 'ЖаңаПерсонаж',
  level: 'C2',
  description: 'Character description',
  descriptionKz: 'Қазақша сипаттама',
  color: '#FF5733',
  isUnlocked: false,
  unlockXp: 15000,
  avatar: 'newcharacter',
}
```

### Customizing AI Responses
Edit `src/data/chatResponses.ts`:

```typescript
export const mockAIResponses: Record<string, string[]> = {
  yourCategory: [
    'Response 1',
    'Response 2',
    'Response 3',
  ],
};
```

## Connecting to Real API

The app uses mock data by default. To connect to a real API:

1. Create an API service in `src/services/api.ts`
2. Update the auth context to use real authentication
3. Replace mock data fetching with API calls
4. Update the chat component to use a real AI service (OpenAI, etc.)

Example API integration:
```typescript
// src/services/api.ts
export const api = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  // ... other methods
};
```

## Environment Variables

Create a `.env` file for configuration:

```env
VITE_API_URL=https://your-api.com
VITE_AI_API_KEY=your-openai-key
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Design inspired by Duolingo
- Character designs inspired by Kazakh culture
- Icons by Lucide
- UI components by shadcn/ui

## Support

For issues or questions, please create an issue in the repository.

---

**QazaqTili** - Learn Kazakh with joy! 🇰🇿
