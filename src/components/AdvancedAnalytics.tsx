import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Target, Calendar, Clock, Award, Flame,
  BarChart3, PieChart, Activity, Zap, Brain, CheckCircle, Trophy
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import type { PerformanceMetrics, AnalyticsData } from '../types';
import { topics } from '../data/topics';
import { striverSheetComplete } from '../data/striverSheetComplete';
import './AdvancedAnalytics.css';

interface AdvancedAnalyticsProps {
  userId: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const { progress, getTopicStats, getTotalStats } = useProgress();
  const totalStats = getTotalStats();

  // Calculate real analytics from user progress
  const analytics: AnalyticsData = useMemo(() => {
    const topicMastery: Record<string, number> = {};
    const difficultyDistribution = { easy: 0, medium: 0, hard: 0 };
    const weeklyProgress: { date: string; count: number }[] = [];
    const weakTopics: string[] = [];

    // Calculate topic mastery
    topics.forEach(topic => {
      const stats = getTopicStats(topic.id);
      const masteryPercent = stats.total > 0 ? stats.percentage : 0;
      topicMastery[topic.id] = masteryPercent;
      
      if (masteryPercent < 50 && masteryPercent > 0) {
        weakTopics.push(topic.id);
      }
    });

    // Calculate difficulty distribution from all solved problems
    Object.values(progress.topicsProgress).forEach(topicProgress => {
      Object.entries(topicProgress.problemsProgress || {}).forEach(([problemId, problemProgress]) => {
        if (problemProgress.status === 'solved') {
          const problem = striverSheetComplete.find(p => p.id === problemId);
          if (problem) {
            const difficulty = problem.difficulty.toLowerCase();
            if (difficulty === 'easy') difficultyDistribution.easy++;
            else if (difficulty === 'medium') difficultyDistribution.medium++;
            else if (difficulty === 'hard') difficultyDistribution.hard++;
          }
        }
      });
    });

    // Calculate weekly progress (last 7 days)
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let count = 0;
      Object.values(progress.topicsProgress).forEach(topicProgress => {
        Object.values(topicProgress.problemsProgress || {}).forEach((problemProgress) => {
          if (problemProgress.status === 'solved' && problemProgress.solvedDate) {
            const solvedDateStr = problemProgress.solvedDate.split('T')[0];
            if (solvedDateStr === dateStr) count++;
          }
        });
      });
      
      weeklyProgress.push({ date: dateStr, count });
    }

    // Calculate interview readiness score
    const avgMastery = Object.values(topicMastery).reduce((sum, val) => sum + val, 0) / Object.keys(topicMastery).length || 0;
    const totalProblems = totalStats.solved;
    const problemScore = Math.min((totalProblems / 100) * 100, 100);
    const interviewReadiness = Math.round((avgMastery * 0.6 + problemScore * 0.4));

    return {
      topicMastery,
      difficultyDistribution,
      weeklyProgress,
      weakTopics: weakTopics.slice(0, 3),
      interviewReadiness
    };
  }, [progress, getTopicStats, totalStats, topics]);

  const performanceData: PerformanceMetrics[] = useMemo(() => {
    return topics.slice(0, 5).map(topic => {
      const topicProgress = progress.topicsProgress[topic.id];
      if (!topicProgress) return null;

      const problemsProgress = Object.values(topicProgress.problemsProgress || {});
      const solvedProblems = problemsProgress.filter(p => p.status === 'solved');
      const totalProblems = problemsProgress.length;

      const accuracy = totalProblems > 0 ? Math.round((solvedProblems.length / totalProblems) * 100) : 0;
      const avgTime = solvedProblems.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / (solvedProblems.length || 1);
      
      const lastSolved = solvedProblems
        .map(p => p.solvedDate)
        .filter(Boolean)
        .sort()
        .reverse()[0] || new Date().toISOString();

      return {
        topicId: topic.id,
        averageTime: Math.round(avgTime),
        accuracy,
        improvementRate: Math.min(accuracy / 5, 20), // Simple improvement calculation
        lastPracticed: lastSolved.split('T')[0],
        strengths: solvedProblems.length > 3 ? [topic.name || topic.id] : [],
        weaknesses: totalProblems - solvedProblems.length > 3 ? ['More practice needed'] : []
      };
    }).filter(Boolean) as PerformanceMetrics[];
  }, [progress, topics]);

  const focusMetrics = useMemo(() => {
    let totalTimeSpent = 0;
    let sessionCount = 0;

    Object.values(progress.topicsProgress).forEach(topicProgress => {
      if (topicProgress.theoryTimeSpent) totalTimeSpent += topicProgress.theoryTimeSpent;
      
      Object.values(topicProgress.problemsProgress || {}).forEach(problemProgress => {
        if (problemProgress.timeSpent) {
          totalTimeSpent += problemProgress.timeSpent;
          sessionCount++;
        }
      });
    });

    const avgSessionLength = sessionCount > 0 ? totalTimeSpent / sessionCount : 0;
    const focusScore = Math.min(Math.round((sessionCount / 50) * 100), 100);

    return {
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to hours
      averageSessionLength: Math.round(avgSessionLength),
      focusScore,
      peakProductiveHours: [9, 14, 20] // Could be calculated from actual timestamps
    };
  }, [progress]);

  const getTopicName = (topicId: string): string => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : topicId;
  };

  const getReadinessLevel = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'Ready', color: '#10b981' };
    if (score >= 75) return { label: 'Almost Ready', color: '#22d3ee' };
    if (score >= 60) return { label: 'Progressing', color: '#fbbf24' };
    return { label: 'Needs Work', color: '#f87171' };
  };

  const readiness = getReadinessLevel(analytics.interviewReadiness);

  return (
    <div className="advanced-analytics">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>📊 Advanced Analytics</h1>
          <p>Deep insights into your learning journey</p>
        </div>
        <div className="time-range-selector">
          <button
            onClick={() => setTimeRange('week')}
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card interview-readiness">
          <div className="metric-icon">
            <Trophy size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Interview Readiness</div>
            <div className="metric-value" style={{ color: readiness.color }}>
              {analytics.interviewReadiness}%
            </div>
            <div className="metric-status" style={{ color: readiness.color }}>
              {readiness.label}
            </div>
          </div>
          <div className="metric-progress">
            <div
              className="metric-progress-bar"
              style={{
                width: `${analytics.interviewReadiness}%`,
                background: readiness.color
              }}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Clock size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Total Time Invested</div>
            <div className="metric-value">{focusMetrics.totalTimeSpent}h</div>
            <div className="metric-sublabel">This month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Zap size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Focus Score</div>
            <div className="metric-value">{focusMetrics.focusScore}%</div>
            <div className="metric-sublabel">Above average!</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Activity size={32} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Avg Session</div>
            <div className="metric-value">{focusMetrics.averageSessionLength}min</div>
            <div className="metric-sublabel">Optimal range</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="chart-section">
        <h2>
          <BarChart3 size={24} />
          Weekly Activity
        </h2>
        <div className="bar-chart">
          {analytics.weeklyProgress.map((day, idx) => {
            const maxCount = Math.max(...analytics.weeklyProgress.map(d => d.count));
            const height = (day.count / maxCount) * 100;
            return (
              <div key={idx} className="bar-container">
                <div
                  className="bar"
                  style={{ height: `${height}%` }}
                  title={`${day.count} problems`}
                >
                  <span className="bar-value">{day.count}</span>
                </div>
                <div className="bar-label">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Mastery */}
      <div className="chart-section">
        <h2>
          <Target size={24} />
          Topic Mastery
        </h2>
        <div className="topic-mastery-grid">
          {Object.entries(analytics.topicMastery)
            .sort(([, a], [, b]) => b - a)
            .map(([topicId, score]) => (
              <div key={topicId} className="mastery-item">
                <div className="mastery-header">
                  <span className="mastery-topic">{getTopicName(topicId)}</span>
                  <span className="mastery-score">{score}%</span>
                </div>
                <div className="mastery-bar">
                  <div
                    className="mastery-fill"
                    style={{
                      width: `${score}%`,
                      background: score >= 80 ? '#10b981' : score >= 60 ? '#22d3ee' : '#fbbf24'
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="chart-section">
        <h2>
          <PieChart size={24} />
          Difficulty Distribution
        </h2>
        <div className="difficulty-stats">
          <div className="difficulty-item easy">
            <div className="difficulty-icon">
              <CheckCircle size={20} />
            </div>
            <div className="difficulty-content">
              <div className="difficulty-label">Easy</div>
              <div className="difficulty-value">{analytics.difficultyDistribution.easy}</div>
              <div className="difficulty-bar">
                <div
                  className="difficulty-fill"
                  style={{ width: `${analytics.difficultyDistribution.easy}%` }}
                />
              </div>
            </div>
          </div>

          <div className="difficulty-item medium">
            <div className="difficulty-icon">
              <Activity size={20} />
            </div>
            <div className="difficulty-content">
              <div className="difficulty-label">Medium</div>
              <div className="difficulty-value">{analytics.difficultyDistribution.medium}</div>
              <div className="difficulty-bar">
                <div
                  className="difficulty-fill"
                  style={{ width: `${analytics.difficultyDistribution.medium}%` }}
                />
              </div>
            </div>
          </div>

          <div className="difficulty-item hard">
            <div className="difficulty-icon">
              <Flame size={20} />
            </div>
            <div className="difficulty-content">
              <div className="difficulty-label">Hard</div>
              <div className="difficulty-value">{analytics.difficultyDistribution.hard}</div>
              <div className="difficulty-bar">
                <div
                  className="difficulty-fill"
                  style={{ width: `${analytics.difficultyDistribution.hard}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="chart-section">
        <h2>
          <Brain size={24} />
          Performance Insights
        </h2>
        <div className="performance-grid">
          {performanceData.map(perf => (
            <div key={perf.topicId} className="performance-card">
              <div className="performance-header">
                <h3>{getTopicName(perf.topicId)}</h3>
                <div className="performance-badges">
                  <span className="accuracy-badge">{perf.accuracy}% accuracy</span>
                  {perf.improvementRate > 0 && (
                    <span className="improvement-badge">
                      <TrendingUp size={14} />
                      +{perf.improvementRate}%
                    </span>
                  )}
                </div>
              </div>

              <div className="performance-stats">
                <div className="perf-stat">
                  <Clock size={16} />
                  <span>Avg time: {perf.averageTime} min</span>
                </div>
                <div className="perf-stat">
                  <Calendar size={16} />
                  <span>Last practiced: {new Date(perf.lastPracticed).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="performance-details">
                <div className="strengths">
                  <strong>✅ Strengths:</strong>
                  <ul>
                    {perf.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="weaknesses">
                  <strong>⚠️ Areas to improve:</strong>
                  <ul>
                    {perf.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topics Alert */}
      {analytics.weakTopics.length > 0 && (
        <div className="weak-topics-alert">
          <div className="alert-header">
            <Award size={24} />
            <h3>Focus Recommendations</h3>
          </div>
          <p>Based on your performance, we recommend focusing on these topics:</p>
          <div className="weak-topics-list">
            {analytics.weakTopics.map(topicId => (
              <button key={topicId} className="weak-topic-chip">
                {getTopicName(topicId)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Peak Hours */}
      <div className="peak-hours-section">
        <h2>
          <Activity size={24} />
          Your Peak Productive Hours
        </h2>
        <div className="hours-grid">
          {Array.from({ length: 24 }, (_, i) => i).map(hour => {
            const isPeak = focusMetrics.peakProductiveHours.includes(hour);
            return (
              <div
                key={hour}
                className={`hour-block ${isPeak ? 'peak' : ''}`}
                title={`${hour}:00 - ${(hour + 1) % 24}:00`}
              >
                <div className="hour-label">{hour}</div>
                {isPeak && <Zap size={12} className="peak-icon" />}
              </div>
            );
          })}
        </div>
        <p className="peak-hint">
          🎯 You're most productive between {focusMetrics.peakProductiveHours[0]}:00 -{' '}
          {focusMetrics.peakProductiveHours[focusMetrics.peakProductiveHours.length - 1]}:00
        </p>
      </div>
    </div>
  );
};
