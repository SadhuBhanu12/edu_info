import { useState } from 'react';
import { Brain, Sparkles, MessageSquare, Target, Zap, TrendingUp } from 'lucide-react';
import './AIFeaturesPage.css';

export default function AIFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string>('hints');

  const features = [
    {
      id: 'hints',
      icon: Brain,
      title: 'AI-Powered Hints',
      description: 'Get contextual hints that adapt to your progress',
      color: '#8b5cf6',
      status: 'Coming Soon'
    },
    {
      id: 'mock-interview',
      icon: Target,
      title: 'Mock Interview Simulator',
      description: 'Practice with AI interviewer for realistic preparation',
      color: '#3b82f6',
      status: 'Coming Soon'
    },
    {
      id: 'code-review',
      icon: Sparkles,
      title: 'AI Code Review',
      description: 'Get instant feedback on code quality and optimization',
      color: '#10b981',
      status: 'Coming Soon'
    },
    {
      id: 'personalized',
      icon: TrendingUp,
      title: 'Personalized Learning Path',
      description: 'AI generates custom study plans based on your goals',
      color: '#f59e0b',
      status: 'Coming Soon'
    },
    {
      id: 'chat',
      icon: MessageSquare,
      title: 'AI Tutor Chat',
      description: 'Ask questions and get detailed explanations',
      color: '#ec4899',
      status: 'Coming Soon'
    },
    {
      id: 'optimization',
      icon: Zap,
      title: 'Solution Optimization',
      description: 'AI suggests more efficient approaches',
      color: '#22d3ee',
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="ai-features-page">
      <div className="page-header">
        <h1>🤖 AI-Powered Features</h1>
        <p className="page-subtitle">
          Next-generation learning with artificial intelligence
        </p>
        <div className="beta-badge">Phase 5 - Advanced Features</div>
      </div>

      <div className="features-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`feature-card ${selectedFeature === feature.id ? 'active' : ''}`}
              onClick={() => setSelectedFeature(feature.id)}
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              <div className="feature-icon">
                <Icon size={32} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-status">{feature.status}</span>
            </div>
          );
        })}
      </div>

      <div className="roadmap-section">
        <h2>🗺️ Development Roadmap</h2>
        <div className="roadmap-timeline">
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h4>Phase 1-3: Foundation ✅</h4>
              <p>Core features, authentication, progress tracking</p>
            </div>
          </div>
          <div className="timeline-item completed">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h4>Phase 4: Advanced Components ✅</h4>
              <p>Study plans, leaderboard, analytics, code editor</p>
            </div>
          </div>
          <div className="timeline-item in-progress">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h4>Phase 5: AI Integration 🚧</h4>
              <p>AI hints, mock interviews, personalized learning</p>
              <span className="timeline-eta">ETA: Q2 2026</span>
            </div>
          </div>
          <div className="timeline-item upcoming">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h4>Phase 6: Social Features 📅</h4>
              <p>Discussion forums, code sharing, community</p>
              <span className="timeline-eta">ETA: Q3 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-box">
        <h3>🎯 Why AI-Powered Learning?</h3>
        <ul>
          <li><strong>Adaptive Difficulty:</strong> AI adjusts problem difficulty based on your performance</li>
          <li><strong>Personalized Hints:</strong> Get help tailored to your specific struggles</li>
          <li><strong>Interview Simulation:</strong> Practice with realistic AI interviewer behavior</li>
          <li><strong>Code Quality:</strong> Receive feedback on style, efficiency, and best practices</li>
          <li><strong>Learning Analytics:</strong> AI identifies patterns and suggests improvements</li>
        </ul>
      </div>

      <div className="cta-section">
        <h3>🚀 Want Early Access?</h3>
        <p>Join our beta program to test AI features before public release</p>
        <button className="cta-button">Join Beta Waitlist</button>
      </div>
    </div>
  );
}
