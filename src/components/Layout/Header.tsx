import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Target, Calendar, Trophy, CheckCircle, BarChart3, Brain, LogOut, Menu, X, User } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getStreak, getTotalStats } = useProgress();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const streak = getStreak();
  const stats = getTotalStats();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/course', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/course/topics', label: 'Topics', icon: BookOpen },
    { path: '/course/problems', label: 'Problems', icon: Target },
    { path: '/course/daily-question', label: 'Daily POTD', icon: Calendar },
    { path: '/course/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/course/completed', label: 'Completed', icon: CheckCircle },
    { path: '/course/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/course/ai-features', label: 'AI', icon: Brain },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/course' && location.pathname.startsWith(path));
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/course" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrapper">
            <LayoutDashboard size={24} />
          </div>
          <span className="logo-text">DSA Tracker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* User Stats */}
          <div className="user-stats">
            <div className="stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{streak}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.solved}</span>
              <span className="stat-text">/{stats.total}</span>
            </div>
          </div>

          {/* User Menu */}
          <div className="user-menu">
            <button className="user-button">
              <User size={18} />
              <span>{user?.user_metadata?.full_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'}</span>
            </button>
          </div>

          {/* Logout Button */}
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mobile-actions">
            <button className="btn-logout mobile" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
