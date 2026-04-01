import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import DailyTip from './components/DailyTip';
import OnboardingGuide from './components/OnboardingGuide';
import AssessmentPage from './pages/AssessmentPage';
import ExercisePage from './pages/ExercisePage';
import TrackPage from './pages/TrackPage';
import KnowledgePage from './pages/KnowledgePage';
import ReminderPage from './pages/ReminderPage';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/assessment', label: '诊断评估', icon: '🩺' },
  { path: '/exercise', label: '康复方案', icon: '💪' },
  { path: '/track', label: '追踪记录', icon: '📊' },
  { path: '/report', label: '健康报告', icon: '📈' },
  { path: '/knowledge', label: '知识库', icon: '📚' },
  { path: '/reminder', label: '提醒', icon: '⏰' },
  { path: '/profile', label: '我的', icon: '👤' },
];

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦒</span>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">NeckGuard</h1>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">开源</span>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <a
                  href="https://github.com/aiyinluya/neckguard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  GitHub ⭐
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/reminder" element={<ReminderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50 md:hidden">
          <div className="flex justify-around items-center h-14">
            {navItems.slice(0, 5).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center text-xs gap-0.5 px-2 py-1 transition-colors ${
                    isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Side Navigation (Desktop) */}
        <nav className="hidden md:block fixed left-0 top-14 bottom-0 w-48 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Desktop content offset */}
        <div className="hidden md:block">
          <style>{`@media(min-width:768px){main{margin-left:12rem;}}</style>`}</style>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <DailyTip />
      <OnboardingGuide />
    </ThemeProvider>
  );
}

export default App;
