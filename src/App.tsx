import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';

// Pages
import { Auth } from '@/pages/Auth';
import { Onboarding } from '@/pages/Onboarding';
import { PlacementTest } from '@/pages/PlacementTest';
import { Home } from '@/pages/Home';
import { Chat } from '@/pages/Chat';
import { Characters } from '@/pages/Characters';
import { League } from '@/pages/League';
import { Stats } from '@/pages/Stats';
import { Settings } from '@/pages/Settings';
import { WordGame } from '@/pages/WordGame';
import VoiceChat from "@/pages/VoiceChat";

import './App.css';
import { Games } from './pages/Games';
import DictionaryPage from './pages/Dictionary';
import Grammar from './pages/Grammar';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <PlacementTest />
          </ProtectedRoute>
        }
      />

      {/* Main App Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/characters"
        element={
          <ProtectedRoute>
            <Layout>
              <Characters />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/league"
        element={
          <ProtectedRoute>
            <Layout>
              <League />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout>
              <Stats />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/words"
        element={
          <ProtectedRoute>
            <Layout>
              <WordGame />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/games"
        element={
          <ProtectedRoute>
            <Layout>
              <Games />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dictionary"
        element={
          <ProtectedRoute>
            <Layout>
              <DictionaryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/grammar"
        element={
          <ProtectedRoute>
            <Layout>
              <Grammar />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/voice"
        element={
          <ProtectedRoute>
            <Layout>
              <VoiceChat />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
