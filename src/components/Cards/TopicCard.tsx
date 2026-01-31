import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Topic } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import './TopicCard.css';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const { getTopicStats, progress } = useProgress();
  const stats = getTopicStats(topic.id);
  const topicProgress = progress.topicsProgress[topic.id];
  const theoryCompleted = topicProgress?.theoryCompleted ?? false;

  // Dynamically get the icon component
  const IconComponent = (Icons as any)[topic.icon] || Icons.BookOpen;

  return (
    <Link to={`/course/topics/${topic.id}`} className="topic-card" style={{ '--topic-color': topic.color } as React.CSSProperties}>
      <div className="topic-card-header">
        <div className="topic-icon" style={{ background: `${topic.color}20`, color: topic.color }}>
          <IconComponent size={24} className="icon" />
        </div>
        <div className="topic-meta">
          <span className="topic-hours">{topic.estimatedHours}h estimated</span>
          {theoryCompleted && <span className="theory-badge">Theory ✓</span>}
        </div>
      </div>

      <h3 className="topic-name">{topic.name}</h3>
      <p className="topic-description">{topic.description}</p>

      <div className="topic-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.percentage}%`, background: topic.color }}
          />
        </div>
        <div className="progress-stats">
          <span className="progress-count">{stats.solved} / {stats.total} problems</span>
          <span className="progress-percent">{stats.percentage}%</span>
        </div>
      </div>

      {topic.prerequisites.length > 0 && (
        <div className="topic-prereqs">
          <span className="prereq-label">Requires:</span>
          {topic.prerequisites.map(prereq => (
            <span key={prereq} className="prereq-tag">{prereq}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
