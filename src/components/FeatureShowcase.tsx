import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import './FeatureShowcase.css';

export function FeatureShowcase() {
  const features = [
    {
      icon: Sparkles,
      title: 'Professional Animations',
      description: 'Learn with stunning visual animations that make complex concepts simple',
      color: '#8b5cf6'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for smooth learning experience',
      color: '#3b82f6'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely',
      color: '#22d3ee'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your growth with detailed analytics and insights',
      color: '#10b981'
    }
  ];

  return (
    <div className="feature-showcase">
      <div className="showcase-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              className="showcase-card"
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              <div className="showcase-icon">
                <Icon size={28} />
              </div>
              <h4 className="showcase-title">{feature.title}</h4>
              <p className="showcase-description">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
