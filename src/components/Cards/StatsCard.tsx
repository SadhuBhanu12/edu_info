import * as Icons from 'lucide-react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatsCard({ title, value, subtitle, icon, color, trend }: StatsCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Activity;

  return (
    <div className="stats-card" style={{ '--card-color': color } as React.CSSProperties}>
      <div className="stats-card-header">
        <div className="stats-icon" style={{ background: `${color}20` }}>
          <IconComponent size={20} />
        </div>
        {trend && (
          <div className={`stats-trend ${trend.value >= 0 ? 'positive' : 'negative'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </div>
        )}
      </div>
      <div className="stats-content">
        <span className="stats-value">{value}</span>
        <span className="stats-title">{title}</span>
        {subtitle && <span className="stats-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
