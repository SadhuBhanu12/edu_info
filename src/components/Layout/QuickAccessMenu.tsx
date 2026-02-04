import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Calendar, 
  Trophy, 
  Brain, 
  TrendingUp, 
  PlayCircle, 
  X,
  Sparkles 
} from 'lucide-react';
import './QuickAccessMenu.css';

export function QuickAccessMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    {
      to: '/course/daily-question',
      icon: Code2,
      label: 'Daily POTD',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
    },
    {
      to: '/course/study-plans',
      icon: Calendar,
      label: 'Study Plans',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
    },
    {
      to: '/course/leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    },
    {
      to: '/course/ai-features',
      icon: Brain,
      label: 'AI Features',
      color: '#22d3ee',
      gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)'
    },
    {
      to: '/course/advanced-analytics',
      icon: TrendingUp,
      label: 'Analytics',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    }
  ];

  return (
    <>
      <button
        className={`quick-access-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Access Menu"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      <div className={`quick-access-menu ${isOpen ? 'open' : ''}`}>
        <div className="quick-access-header">
          <h3>⚡ Quick Access</h3>
          <p>Jump to any feature instantly</p>
        </div>
        
        <div className="quick-links-grid">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="quick-link"
                onClick={() => setIsOpen(false)}
                style={{ 
                  '--link-color': link.color,
                  '--link-gradient': link.gradient 
                } as React.CSSProperties}
              >
                <div className="quick-link-icon">
                  <Icon size={24} />
                </div>
                <span className="quick-link-label">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="quick-access-tip">
          <PlayCircle size={16} />
          <span>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> for quick search</span>
        </div>
      </div>

      {isOpen && (
        <div 
          className="quick-access-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
