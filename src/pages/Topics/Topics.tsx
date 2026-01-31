import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { TopicCard } from '../../components/Cards';
import { topics } from '../../data/topics';
import { useProgress } from '../../context/ProgressContext';
import './Topics.css';

export function Topics() {
  const { progress, getTopicStats } = useProgress();

  const getTopicStatus = (topicId: string) => {
    const topicProgress = progress.topicsProgress[topicId];
    if (!topicProgress) return 'not-started';
    
    const stats = getTopicStats(topicId);
    if (stats.percentage === 100) return 'completed';
    if (stats.percentage > 0) return 'in-progress';
    return 'not-started';
  };

  const sortedTopics = [...topics].sort((a, b) => a.order - b.order);
  
  const notStartedTopics = sortedTopics.filter(t => getTopicStatus(t.id) === 'not-started');
  const inProgressTopics = sortedTopics.filter(t => getTopicStatus(t.id) === 'in-progress');
  const completedTopics = sortedTopics.filter(t => getTopicStatus(t.id) === 'completed');

  return (
    <div className="topics-page">
      <header className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Learning Topics</h1>
          <p className="page-description">
            Master data structures and algorithms through structured learning paths
          </p>
        </div>
        <div className="topics-summary">
          <div className="summary-item">
            <Clock size={18} />
            <span>{notStartedTopics.length} Not Started</span>
          </div>
          <div className="summary-item in-progress">
            <BookOpen size={18} />
            <span>{inProgressTopics.length} In Progress</span>
          </div>
          <div className="summary-item completed">
            <CheckCircle2 size={18} />
            <span>{completedTopics.length} Completed</span>
          </div>
        </div>
      </header>

      {inProgressTopics.length > 0 && (
        <section className="topics-section">
          <h2 className="section-heading">
            <BookOpen className="heading-icon" />
            Continue Learning
          </h2>
          <div className="topics-grid">
            {inProgressTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {notStartedTopics.length > 0 && (
        <section className="topics-section">
          <h2 className="section-heading">
            <Clock className="heading-icon" />
            {inProgressTopics.length > 0 ? 'Explore More' : 'Get Started'}
          </h2>
          <div className="topics-grid">
            {notStartedTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {completedTopics.length > 0 && (
        <section className="topics-section">
          <h2 className="section-heading">
            <CheckCircle2 className="heading-icon" />
            Completed
          </h2>
          <div className="topics-grid">
            {completedTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
