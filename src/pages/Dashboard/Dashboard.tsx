import { 
  Target, BookOpen, Trophy, TrendingUp, Zap, Award, 
  Calendar, CheckCircle, Flame, Brain, Code, BarChart3,
  Rocket, Star, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { TopicCard } from '../../components/Cards';
import { FeaturesOverview } from '../../components/FeaturesOverview';
import { ProgressCircle } from '../../components/ProgressCircle';
import { topics } from '../../data/topics';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import './Dashboard.css';

export function Dashboard() {
  const { getTotalStats, getStreak, progress } = useProgress();
  const stats = getTotalStats();
  const streak = getStreak();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getMotivationalMessage = () => {
    if (stats.solved === 0) return "Let's get started! Pick a topic to begin your journey.";
    if (stats.solved < 10) return "Great start! Keep the momentum going.";
    if (stats.solved < 50) return "You're making excellent progress!";
    if (stats.solved < 100) return "Halfway there! You're doing amazing.";
    return "Outstanding work! You're crushing it!";
  };

  const getRecommendedTopics = () => {
    return topics
      .filter(topic => {
        const topicProgress = progress.topicsProgress[topic.id];
        const hasStarted = topicProgress && Object.keys(topicProgress.problemsProgress).length > 0;
        const isCompleted = topicProgress && 
          Object.values(topicProgress.problemsProgress).filter(p => p.status === 'solved').length === topic.problemIds.length;
        return !isCompleted && (!hasStarted || (hasStarted && !topicProgress.theoryCompleted));
      })
      .slice(0, 3);
  };

  const getProgressPercentage = () => {
    return stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
  };

  const getDifficultyStats = () => {
    // Count total problems by difficulty
    const easyTotal = striverSheetComplete.filter(p => p.difficulty === 'Easy').length;
    const mediumTotal = striverSheetComplete.filter(p => p.difficulty === 'Medium').length;
    const hardTotal = striverSheetComplete.filter(p => p.difficulty === 'Hard').length;

    // Count solved problems by difficulty
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    Object.values(progress.topicsProgress).forEach(topicProgress => {
      Object.entries(topicProgress.problemsProgress).forEach(([problemId, problemProgress]) => {
        if (problemProgress.status === 'solved') {
          const problem = striverSheetComplete.find(p => p.id === problemId);
          if (problem) {
            if (problem.difficulty === 'Easy') easySolved++;
            else if (problem.difficulty === 'Medium') mediumSolved++;
            else if (problem.difficulty === 'Hard') hardSolved++;
          }
        }
      });
    });

    return {
      easy: { solved: easySolved, total: easyTotal },
      medium: { solved: mediumSolved, total: mediumTotal },
      hard: { solved: hardSolved, total: hardTotal },
      total: { solved: stats.solved, total: stats.total }
    };
  };

  const getWeeklyProgress = () => {
    // Calculate real weekly progress - updates daily based on actual user activity
    const weekData = Array(7).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all solved problems with their dates
    Object.values(progress.topicsProgress).forEach(topicProgress => {
      Object.values(topicProgress.problemsProgress || {}).forEach((problemProgress) => {
        if (problemProgress.status === 'solved' && problemProgress.solvedDate) {
          const solvedDate = new Date(problemProgress.solvedDate);
          solvedDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today.getTime() - solvedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Count problems solved in the last 7 days
          if (daysDiff >= 0 && daysDiff < 7) {
            weekData[6 - daysDiff]++;
          }
        }
      });
    });
    
    // Return actual user data - will show 0s if no activity
    return weekData;
  };

  const getTodaysSuggestion = () => {
    const suggestions = [
      { icon: Brain, text: "Start with Arrays - Master the fundamentals", color: "#3b82f6" },
      { icon: Code, text: "Practice 3 medium problems today", color: "#f59e0b" },
      { icon: Rocket, text: "Complete Binary Trees theory module", color: "#8b5cf6" },
      { icon: Zap, text: "Challenge yourself with a hard problem", color: "#ef4444" },
    ];
    return suggestions[new Date().getDay() % suggestions.length];
  };

  const recommendedTopics = getRecommendedTopics();
  const progressPercentage = getProgressPercentage();
  const weeklyData = getWeeklyProgress();
  const todaySuggestion = getTodaysSuggestion();

  return (
    <div className={`dashboard ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section with Enhanced Animation */}
      <section className="dashboard-hero">
        <div className="hero-background-effects">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="glow-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="welcome-badge">
            <Rocket size={16} />
            <span>Welcome Back</span>
          </div>
          <h1 className="hero-title">
            {stats.solved === 0 ? "Start Your DSA Journey! 🚀" :
             stats.solved < 10 ? "Great Start! Keep Going 💪" :
             stats.solved < 50 ? "You're Making Progress! 🔥" :
             stats.solved < 100 ? "Halfway to Mastery! ⭐" :
             "DSA Champion! 🏆"}
          </h1>
          <p className="hero-subtitle">{getMotivationalMessage()}</p>
          
          {/* Today's Suggestion */}
          <div className="today-suggestion" style={{ borderColor: todaySuggestion.color }}>
            <todaySuggestion.icon size={20} style={{ color: todaySuggestion.color }} />
            <span>{todaySuggestion.text}</span>
          </div>
        </div>

        {/* TUF-Style Progress Circle */}
        <div className="hero-progress">
          <ProgressCircle {...getDifficultyStats()} />
        </div>
      </section>

      {/* Interactive Stats Grid */}
      <section className="dashboard-stats-enhanced">
        <div className="stats-header">
          <h2>Your Performance</h2>
          <div className="timeframe-selector">
            <button 
              className={selectedTimeframe === 'week' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={selectedTimeframe === 'month' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={selectedTimeframe === 'all' ? 'active' : ''}
              onClick={() => setSelectedTimeframe('all')}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card featured">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                <Flame size={24} />
              </div>
              <div className="stat-trend">
                <TrendingUp size={16} />
                <span>+{streak > 0 ? streak : 0}</span>
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{streak} Days</h3>
              <p className="stat-label">Current Streak 🔥</p>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill"
                  style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="stat-sublabel">Keep it going!</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                <Target size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.solved}</h3>
              <p className="stat-label">Problems Solved</p>
              <span className="stat-sublabel">of {stats.total} total</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.easy}</h3>
              <p className="stat-label">Easy</p>
              <span className="stat-sublabel">Fundamentals</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                <Activity size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.medium}</h3>
              <p className="stat-label">Medium</p>
              <span className="stat-sublabel">Building Skills</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                <Zap size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.hard}</h3>
              <p className="stat-label">Hard</p>
              <span className="stat-sublabel">Expert Level</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #c084fc)' }}>
                <BookOpen size={24} />
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{Object.keys(progress.topicsProgress).length}</h3>
              <p className="stat-label">Topics Started</p>
              <span className="stat-sublabel">of {topics.length} total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Activity Chart */}
      <section className="activity-section">
        <div className="section-header">
          <h2>
            <BarChart3 className="section-icon" />
            Weekly Activity
          </h2>
          <span className="activity-summary">{weeklyData.reduce((a, b) => a + b, 0)} problems this week</span>
        </div>
        <div className="activity-chart">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const maxValue = Math.max(...weeklyData, 1); // Prevent division by 0
            const heightPercent = weeklyData[index] === 0 ? 5 : Math.max((weeklyData[index] / maxValue) * 100, 15);
            return (
              <div key={day} className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${heightPercent}%`,
                    animationDelay: `${index * 0.1}s`,
                    background: weeklyData[index] === 0 ? 'rgba(0,0,0,0.05)' : undefined
                  }}
                >
                  {weeklyData[index] > 0 && <span className="bar-value">{weeklyData[index]}</span>}
                </div>
                <span className="bar-label">{day}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Topics */}
      {recommendedTopics.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <BookOpen className="section-icon" />
              Recommended For You
            </h2>
            <Link to="/course/topics" className="view-all-link">
              View All Topics →
            </Link>
          </div>
          <div className="topics-grid">
            {recommendedTopics.map((topic, index) => (
              <div 
                key={topic.id} 
                className="topic-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TopicCard topic={topic} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions - Enhanced */}
      <section className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/course/topics" className="action-card action-primary">
            <div className="action-icon-wrapper">
              <BookOpen size={32} />
            </div>
            <div className="action-content">
              <h3>Browse Topics</h3>
              <p>Explore all data structures and algorithms</p>
              <div className="action-badge">
                <span>{topics.length} Topics</span>
              </div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/course/problems" className="action-card action-secondary">
            <div className="action-icon-wrapper">
              <Target size={32} />
            </div>
            <div className="action-content">
              <h3>Practice Problems</h3>
              <p>Solve curated coding challenges</p>
              <div className="action-badge">
                <span>{stats.total} Problems</span>
              </div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/course/analytics" className="action-card action-tertiary">
            <div className="action-icon-wrapper">
              <TrendingUp size={32} />
            </div>
            <div className="action-content">
              <h3>View Analytics</h3>
              <p>Track progress and insights</p>
              <div className="action-badge">
                <span>Live Data</span>
              </div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/course/study-plans" className="action-card action-accent">
            <div className="action-icon-wrapper">
              <Calendar size={32} />
            </div>
            <div className="action-content">
              <h3>Study Plans</h3>
              <p>Structured learning paths</p>
              <div className="action-badge">
                <span>New</span>
              </div>
            </div>
            <div className="action-arrow">→</div>
          </Link>
        </div>
      </section>

      {/* Achievement Card */}
      {stats.solved > 0 && (
        <section className="achievement-section">
          <div className="achievement-card">
            <div className="achievement-icon-wrapper">
              {stats.solved >= 100 ? <Trophy size={48} /> : 
               stats.solved >= 50 ? <Award size={48} /> :
               <Star size={48} />}
            </div>
            <div className="achievement-content">
              <h3 className="achievement-title">
                {stats.solved >= 100 ? "🎉 DSA Champion!" : 
                 stats.solved >= 50 ? "🚀 Rising Star!" :
                 "💪 Getting Started!"}
              </h3>
              <p className="achievement-description">
                {stats.solved >= 100 ? "Incredible! You've solved over 100 problems and are interview-ready!" :
                 stats.solved >= 50 ? "Amazing progress! You're building strong problem-solving skills." :
                 `Great job solving ${stats.solved} problems! Keep up the momentum.`}
              </p>
              <div className="achievement-badges">
                {stats.easy > 20 && (
                  <span className="badge badge-easy">
                    <CheckCircle size={14} />
                    Easy Master
                  </span>
                )}
                {stats.medium > 15 && (
                  <span className="badge badge-medium">
                    <Zap size={14} />
                    Medium Pro
                  </span>
                )}
                {stats.hard > 5 && (
                  <span className="badge badge-hard">
                    <Trophy size={14} />
                    Hard Crusher
                  </span>
                )}
                {streak >= 7 && (
                  <span className="badge badge-streak">
                    <Flame size={14} />
                    Week Warrior
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Overview */}
      <section className="features-section">
        <FeaturesOverview />
      </section>
    </div>
  );
}
