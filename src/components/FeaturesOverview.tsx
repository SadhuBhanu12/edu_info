import { Link } from 'react-router-dom';
import { 
  Code2, 
  Calendar, 
  Trophy, 
  Brain, 
  TrendingUp, 
  PlayCircle,
  Sparkles,
  Target,
  BookOpen,
  Zap,
  ArrowRight
} from 'lucide-react';
import './FeaturesOverview.css';

export function FeaturesOverview() {
  const features = [
    {
      id: 'daily-question',
      icon: Code2,
      title: 'Daily POTD',
      description: 'Practice with a new random coding problem every day',
      link: '/course/daily-question',
      color: '#8b5cf6',
      status: 'Active',
      highlights: ['Random problems', 'Daily challenge', 'Track progress']
    },
    {
      id: 'study-plans',
      icon: Calendar,
      title: 'Study Plans',
      description: 'Create personalized study plans with progress tracking',
      link: '/course/study-plans',
      color: '#8b5cf6',
      status: 'Active',
      highlights: ['Custom schedules', 'Topic selection', 'Progress analytics']
    },
    {
      id: 'leaderboard',
      icon: Trophy,
      title: 'Leaderboard',
      description: 'Compete with peers and earn achievements',
      link: '/course/leaderboard',
      color: '#fbbf24',
      status: 'Active',
      highlights: ['Global rankings', 'Badges', 'Achievements']
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights into your learning patterns',
      link: '/course/advanced-analytics',
      color: '#10b981',
      status: 'Active',
      highlights: ['Performance metrics', 'Heatmaps', 'Recommendations']
    },
    {
      id: 'ai-features',
      icon: Brain,
      title: 'AI Features',
      description: 'Next-gen learning with AI assistance',
      link: '/course/ai-features',
      color: '#22d3ee',
      status: 'Coming Soon',
      highlights: ['AI hints', 'Mock interviews', 'Code review']
    },
    {
      id: 'animations',
      icon: PlayCircle,
      title: 'Visual Animations',
      description: 'Interactive algorithm visualizations',
      link: '/course/animations',
      color: '#ec4899',
      status: 'Active',
      highlights: ['Step-by-step', 'Interactive', 'Educational']
    }
  ];

  return (
    <div className="features-overview">
      <div className="overview-header">
        <div className="header-content">
          <Sparkles className="header-icon" />
          <h2>🚀 All Features</h2>
          <p>Everything you need to master DSA</p>
        </div>
      </div>

      <div className="features-grid-overview">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.id}
              to={feature.link}
              className="feature-card-overview"
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              <div className="feature-header-card">
                <div className="feature-icon-wrapper">
                  <Icon size={28} />
                </div>
                <span className={`feature-status ${feature.status.toLowerCase().replace(' ', '-')}`}>
                  {feature.status}
                </span>
              </div>

              <h3 className="feature-title-card">{feature.title}</h3>
              <p className="feature-description-card">{feature.description}</p>

              <div className="feature-highlights">
                {feature.highlights.map((highlight, idx) => (
                  <span key={idx} className="highlight-badge">
                    <Zap size={12} />
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="feature-action">
                <span>Explore</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <BookOpen size={24} />
          <div className="stat-content">
            <span className="stat-value">1,680+</span>
            <span className="stat-label">Problems</span>
          </div>
        </div>
        <div className="stat-card">
          <Target size={24} />
          <div className="stat-content">
            <span className="stat-value">8+</span>
            <span className="stat-label">Topics</span>
          </div>
        </div>
        <div className="stat-card">
          <PlayCircle size={24} />
          <div className="stat-content">
            <span className="stat-value">50+</span>
            <span className="stat-label">Animations</span>
          </div>
        </div>
        <div className="stat-card">
          <Sparkles size={24} />
          <div className="stat-content">
            <span className="stat-value">15+</span>
            <span className="stat-label">Features</span>
          </div>
        </div>
      </div>
    </div>
  );
}
