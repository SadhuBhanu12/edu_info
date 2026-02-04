import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LeetCodeSyncProvider } from './components/LeetCodeSyncProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const SignUpPage = lazy(() => import('./pages/Auth/SignUpPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard/UserDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Topics = lazy(() => import('./pages/Topics').then(m => ({ default: m.Topics })));
const TopicDetail = lazy(() => import('./pages/TopicDetail').then(m => ({ default: m.TopicDetail })));
const Problems = lazy(() => import('./pages/Problems').then(m => ({ default: m.Problems })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const CompletedProblems = lazy(() => import('./pages/CompletedProblems').then(m => ({ default: m.CompletedProblems })));
const TheoryPage = lazy(() => import('./pages/Theory/TheoryPage'));
const AnimationShowcase = lazy(() => import('./pages/AnimationShowcase').then(m => ({ default: m.AnimationShowcase })));
const TopicAnimationPage = lazy(() => import('./pages/TopicAnimation'));
const StudyPlansPage = lazy(() => import('./pages/StudyPlans/StudyPlansPage'));
const LeaderboardPage = lazy(() => import('./pages/Leaderboard/LeaderboardPage'));
const PracticePage = lazy(() => import('./pages/Practice/PracticePage'));
const AdvancedAnalyticsPage = lazy(() => import('./pages/AdvancedAnalytics/AdvancedAnalyticsPage'));
const AIFeaturesPage = lazy(() => import('./pages/AIFeatures/AIFeaturesPage'));
const RevisionDashboard = lazy(() => import('./pages/RevisionDashboard').then(m => ({ default: m.RevisionDashboard })));
const WeaknessAnalyzer = lazy(() => import('./pages/WeaknessAnalyzer').then(m => ({ default: m.WeaknessAnalyzer })));
const PatternMastery = lazy(() => import('./pages/PatternMastery').then(m => ({ default: m.PatternMastery })));
const DailyQuestion = lazy(() => import('./pages/DailyQuestion/DailyQuestion'));

// Loading component for Suspense
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#ffffff'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(99, 102, 241, 0.1)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Progress Loader - shows while loading user progress from database
// TUF Standard: Disabled to prevent blocking UI
function ProgressLoader() {
  // Always return null - never block the user
  return null;
  
  /* DISABLED - Causes loading issues
  const { isLoadingProgress } = useProgress();
  
  if (!isLoadingProgress) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(99, 102, 241, 0.1)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <div style={{
        marginTop: '16px',
        color: '#6366f1',
        fontSize: '14px',
        fontWeight: 500
      }}>
        Loading your progress...
      </div>
    </div>
  );
  */
}

// App Content - contains all routes
function AppContent() {
  return (
    <>
      <ProgressLoader />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Protected Routes - User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

          {/* Protected Routes - DSA Tracker Course */}
          <Route path="/course" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="topics" element={<Topics />} />
            <Route path="topics/:topicId" element={<TopicDetail />} />
            <Route path="topics/:topicId/theory" element={<TheoryPage />} />
            <Route path="topics/:topicId/animation" element={<TopicAnimationPage />} />
            <Route path="problems" element={<Problems />} />
            <Route path="practice/:problemId" element={<PracticePage />} />
            <Route path="completed" element={<CompletedProblems />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="revision" element={<RevisionDashboard />} />
            <Route path="weakness" element={<WeaknessAnalyzer />} />
            <Route path="patterns" element={<PatternMastery />} />
            <Route path="advanced-analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="study-plans" element={<StudyPlansPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="daily-question" element={<DailyQuestion />} />
            <Route path="ai-features" element={<AIFeaturesPage />} />
            <Route path="animations" element={<AnimationShowcase />} />
          </Route>

          {/* Legacy redirect for /topics to /course/topics */}
          <Route path="/topics" element={<Navigate to="/course/topics" replace />} />
          <Route path="/topics/:topicId" element={<Navigate to="/course/topics/:topicId" replace />} />
          <Route path="/topics/:topicId/theory" element={<Navigate to="/course/topics/:topicId/theory" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <LeetCodeSyncProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </LeetCodeSyncProvider>
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
