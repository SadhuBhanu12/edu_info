import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { StatsCard } from '../../components/Cards';
import { topics } from '../../data/topics';
import './Analytics.css';

export function Analytics() {
  const { progress, getTotalStats, getTopicStats, getStreak } = useProgress();
  const stats = getTotalStats();
  const streak = getStreak();

  const getWeakTopics = () => {
    return topics
      .map(topic => ({
        ...topic,
        stats: getTopicStats(topic.id),
      }))
      .filter(t => t.stats.solved > 0 && t.stats.percentage < 50)
      .sort((a, b) => a.stats.percentage - b.stats.percentage)
      .slice(0, 3);
  };

  const getStrongTopics = () => {
    return topics
      .map(topic => ({
        ...topic,
        stats: getTopicStats(topic.id),
      }))
      .filter(t => t.stats.percentage >= 75)
      .sort((a, b) => b.stats.percentage - a.stats.percentage);
  };

  const getRecentActivity = () => {
    const activities: { date: string; count: number }[] = [];
    const problemsWithProgress = Object.values(progress.topicsProgress).flatMap(tp =>
      Object.values(tp.problemsProgress).filter(p => p.lastAttempted)
    );

    const dateMap = new Map<string, number>();
    problemsWithProgress.forEach(p => {
      if (p.lastAttempted) {
        const date = new Date(p.lastAttempted).toLocaleDateString();
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      }
    });

    dateMap.forEach((count, date) => {
      activities.push({ date, count });
    });

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);
  };

  const getInterviewReadiness = () => {
    const totalProblems = stats.total;
    const solvedProblems = stats.solved;
    const easyPercentage = stats.easy > 0 ? 30 : 0;
    const mediumPercentage = stats.medium > 0 ? 50 : 0;
    const hardPercentage = stats.hard > 0 ? 20 : 0;
    const overallPercentage = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;

    return Math.min(100, Math.round((easyPercentage + mediumPercentage + hardPercentage + overallPercentage) / 2));
  };

  const weakTopics = getWeakTopics();
  const strongTopics = getStrongTopics();
  const recentActivity = getRecentActivity();
  const interviewReadiness = getInterviewReadiness();

  return (
    <div className="analytics-page">
      <header className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <BarChart3 className="title-icon" />
            Analytics & Insights
          </h1>
          <p className="page-description">
            Track your progress and identify areas for improvement
          </p>
        </div>
      </header>

      <section className="analytics-stats">
        <StatsCard
          title="Total Solved"
          value={stats.solved}
          subtitle={`${Math.round((stats.solved / stats.total) * 100)}% complete`}
          icon="Target"
          color="#3b82f6"
        />
        <StatsCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle={streak > 7 ? 'Amazing consistency!' : 'Keep going!'}
          icon="Flame"
          color="#f59e0b"
        />
        <StatsCard
          title="Interview Readiness"
          value={`${interviewReadiness}%`}
          subtitle={interviewReadiness >= 75 ? 'Ready to ace it!' : 'Keep practicing'}
          icon="Award"
          color={interviewReadiness >= 75 ? '#22c55e' : '#f59e0b'}
        />
        <StatsCard
          title="Topics Mastered"
          value={strongTopics.length}
          subtitle={`${topics.length - strongTopics.length} remaining`}
          icon="BookOpen"
          color="#8b5cf6"
        />
      </section>

      <div className="analytics-grid">
        <section className="analytics-card">
          <h2 className="card-title">
            <TrendingUp className="card-icon" />
            Difficulty Distribution
          </h2>
          <div className="difficulty-bars">
            <div className="difficulty-bar-item">
              <div className="difficulty-bar-header">
                <span className="difficulty-label easy">Easy</span>
                <span className="difficulty-count">{stats.easy}</span>
              </div>
              <div className="difficulty-bar">
                <div
                  className="difficulty-bar-fill easy"
                  style={{ width: `${stats.total > 0 ? (stats.easy / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="difficulty-bar-item">
              <div className="difficulty-bar-header">
                <span className="difficulty-label medium">Medium</span>
                <span className="difficulty-count">{stats.medium}</span>
              </div>
              <div className="difficulty-bar">
                <div
                  className="difficulty-bar-fill medium"
                  style={{ width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="difficulty-bar-item">
              <div className="difficulty-bar-header">
                <span className="difficulty-label hard">Hard</span>
                <span className="difficulty-count">{stats.hard}</span>
              </div>
              <div className="difficulty-bar">
                <div
                  className="difficulty-bar-fill hard"
                  style={{ width: `${stats.total > 0 ? (stats.hard / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {recentActivity.length > 0 && (
          <section className="analytics-card">
            <h2 className="card-title">
              <Calendar className="card-icon" />
              Recent Activity
            </h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-date">{activity.date}</span>
                  <div className="activity-bar">
                    <div
                      className="activity-bar-fill"
                      style={{ width: `${(activity.count / Math.max(...recentActivity.map(a => a.count))) * 100}%` }}
                    />
                  </div>
                  <span className="activity-count">{activity.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {strongTopics.length > 0 && (
        <section className="analytics-card">
          <h2 className="card-title">
            <Award className="card-icon" />
            Strong Topics
          </h2>
          <div className="topics-list">
            {strongTopics.map(topic => (
              <div key={topic.id} className="topic-item strong">
                <div className="topic-item-info">
                  <span className="topic-item-name">{topic.name}</span>
                  <span className="topic-item-progress">{topic.stats.solved} / {topic.stats.total} solved</span>
                </div>
                <div className="topic-item-badge">{topic.stats.percentage}%</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {weakTopics.length > 0 && (
        <section className="analytics-card">
          <h2 className="card-title">
            <TrendingUp className="card-icon" />
            Areas for Improvement
          </h2>
          <div className="topics-list">
            {weakTopics.map(topic => (
              <div key={topic.id} className="topic-item weak">
                <div className="topic-item-info">
                  <span className="topic-item-name">{topic.name}</span>
                  <span className="topic-item-progress">{topic.stats.solved} / {topic.stats.total} solved</span>
                </div>
                <div className="topic-item-badge">{topic.stats.percentage}%</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats.solved === 0 && (
        <div className="empty-analytics">
          <BarChart3 size={64} className="empty-icon" />
          <h3 className="empty-title">No data yet</h3>
          <p className="empty-description">
            Start solving problems to see your analytics and insights
          </p>
        </div>
      )}
    </div>
  );
}
