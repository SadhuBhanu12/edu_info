import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Target, Code2, Calendar, Trophy, CheckCircle, BarChart3, Brain, LogOut, Menu, X, Flame, CheckSquare, ChevronDown, TrendingUp } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useAuth } from '../../context/AuthContext';
import './ProfessionalHeader.css';
import { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';

export const ProfessionalHeader = memo(function ProfessionalHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getStreak, getTotalStats } = useProgress();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const streak = getStreak();
  const stats = getTotalStats();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  // TUF-style simplified navigation - 6 core items max
  const navItems = useMemo(() => [
    { path: '/course', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/course/topics', label: 'Topics', icon: BookOpen },
    { path: '/course/problems', label: 'Problems', icon: Target },
    { path: '/course/revision', label: 'Revision', icon: TrendingUp },
    { path: '/course/analytics', label: 'Analytics', icon: BarChart3 },
  ], []);

  const isActive = useCallback((path: string) => {
    return location.pathname === path || 
      (path !== '/course' && location.pathname.startsWith(path));
  }, [location.pathname]);

  const userName = useMemo(() => 
    user?.user_metadata?.full_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User',
    [user]
  );

  return (
    <header className="pro-navbar" role="banner">
      <div className="pro-navbar-wrapper">
        <div className="pro-navbar-container" role="navigation" aria-label="Main navigation">
          {/* Brand Section */}
          <div className="pro-brand">
            <Link to="/course" className="pro-brand-link" onClick={() => setMobileMenuOpen(false)}>
              <div className="pro-logo-icon">
                <LayoutDashboard size={22} strokeWidth={2.5} />
              </div>
              <div className="pro-logo-content">
                <span className="pro-logo-title">EDUINFO</span>
                <span className="pro-logo-subtitle">Master Data Structures</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="pro-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`pro-nav-item ${active ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="pro-nav-label">{item.label}</span>
                  {active && <div className="pro-active-bar" />}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="pro-user-section">
            {/* Stats Display */}
            <div className="pro-stats">
              <div className="pro-stat-item pro-streak">
                <Flame size={16} className="pro-stat-icon" />
                <span className="pro-stat-value">{streak}</span>
                <span className="pro-stat-label">Day Streak</span>
              </div>
              <div className="pro-stat-divider" />
              <div className="pro-stat-item pro-solved">
                <CheckSquare size={16} className="pro-stat-icon" />
                <span className="pro-stat-value">{stats.solved}</span>
                <span className="pro-stat-label">of {stats.total}</span>
              </div>
            </div>

            {/* User Dropdown */}
            <div className="pro-user-dropdown" ref={userMenuRef}>
              <button 
                className="pro-user-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <div className="pro-user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="pro-user-info">
                  <span className="pro-user-name">{userName}</span>
                  <span className="pro-user-email">{user?.email}</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`pro-dropdown-icon ${userMenuOpen ? 'open' : ''}`}
                />
              </button>

              {userMenuOpen && (
                <div className="pro-dropdown-menu">
                  <div className="pro-dropdown-header">
                    <div className="pro-header-avatar">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="pro-header-info">
                      <span className="pro-header-name">{userName}</span>
                      <span className="pro-header-email">{user?.email}</span>
                    </div>
                  </div>
                  <div className="pro-dropdown-divider" />
                  <Link to="/course" className="pro-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/course/analytics" className="pro-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <BarChart3 size={16} />
                    <span>My Progress</span>
                  </Link>
                  <div className="pro-dropdown-divider" />
                  <button onClick={handleLogout} className="pro-dropdown-item pro-logout">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              className="pro-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="pro-mobile-nav" id="mobile-navigation" role="navigation" aria-label="Mobile menu">
          <div className="pro-mobile-header">
            <div className="pro-mobile-user">
              <div className="pro-mobile-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="pro-mobile-info">
                <span className="pro-mobile-name">{userName}</span>
                <span className="pro-mobile-email">{user?.email}</span>
              </div>
            </div>
            <div className="pro-mobile-stats">
              <div className="pro-mobile-stat">
                <Flame size={14} />
                <span>{streak} days</span>
              </div>
              <div className="pro-mobile-stat">
                <CheckSquare size={14} />
                <span>{stats.solved}/{stats.total}</span>
              </div>
            </div>
          </div>

          <nav className="pro-mobile-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`pro-mobile-item ${active ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{item.label}</span>
                  {active && <div className="pro-mobile-dot" />}
                </Link>
              );
            })}
          </nav>

          <div className="pro-mobile-footer">
            <button onClick={handleLogout} className="pro-mobile-logout">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
});
