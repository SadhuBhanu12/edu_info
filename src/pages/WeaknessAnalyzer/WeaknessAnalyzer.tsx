import { useState, useMemo } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import { topics } from '../../data/topics';
import { TrendingDown, AlertTriangle, Target, BarChart3, Clock } from 'lucide-react';
import { ProblemCard } from '../../components/Cards/ProblemCard';
import './WeaknessAnalyzer.css';

interface TopicWeakness {
  topicId: string;
  topicName: string;
  totalProblems: number;
  attempted: number;
  solved: number;
  avgAttempts: number;
  avgConfidence: number;
  weaknessScore: number; // 0-100, higher = weaker
  problemsNeedingAttention: string[];
}

export function WeaknessAnalyzer() {
  const { progress, getProblemProgress } = useProgress();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Calculate weakness metrics for each topic
  const topicWeaknesses = useMemo((): TopicWeakness[] => {
    const weaknesses: TopicWeakness[] = [];

    topics.forEach(topic => {
      const topicProblems = striverSheetComplete.filter(p => p.topicId === topic.id);
      const totalProblems = topicProblems.length;

      let attempted = 0;
      let solved = 0;
      let totalAttempts = 0;
      let totalConfidence = 0;
      let problemsWithData = 0;
      const problemsNeedingAttention: string[] = [];

      topicProblems.forEach(problem => {
        const prog = getProblemProgress(problem.id);
        if (prog) {
          if (prog.attempts > 0) attempted++;
          if (prog.status === 'solved') solved++;
          
          totalAttempts += prog.attempts;
          totalConfidence += prog.confidence;
          problemsWithData++;

          // Problems needing attention: high attempts OR low confidence OR attempted but not solved
          if ((prog.attempts >= 3 && prog.status !== 'solved') || 
              (prog.confidence <= 2) ||
              (prog.attempts > 0 && prog.status !== 'solved')) {
            problemsNeedingAttention.push(problem.id);
          }
        }
      });

      const avgAttempts = problemsWithData > 0 ? totalAttempts / problemsWithData : 0;
      const avgConfidence = problemsWithData > 0 ? totalConfidence / problemsWithData : 0;
      const solveRate = attempted > 0 ? (solved / attempted) * 100 : 0;

      // Weakness score calculation (0-100, higher = weaker)
      let weaknessScore = 0;
      if (attempted > 0) {
        weaknessScore += (100 - solveRate) * 0.4; // 40% weight to solve rate
        weaknessScore += (avgAttempts / 5) * 100 * 0.3; // 30% weight to avg attempts
        weaknessScore += ((5 - avgConfidence) / 5) * 100 * 0.3; // 30% weight to confidence
      } else if (totalProblems > 0) {
        weaknessScore = 50; // Not attempted topics get medium weakness
      }

      weaknesses.push({
        topicId: topic.id,
        topicName: topic.name,
        totalProblems,
        attempted,
        solved,
        avgAttempts,
        avgConfidence,
        weaknessScore: Math.min(100, Math.max(0, weaknessScore)),
        problemsNeedingAttention
      });
    });

    return weaknesses.sort((a, b) => b.weaknessScore - a.weaknessScore);
  }, [progress, getProblemProgress]);

  // Get heatmap color based on weakness score
  const getHeatmapColor = (score: number): string => {
    if (score >= 75) return '#ef4444'; // Red - Very weak
    if (score >= 50) return '#f97316'; // Orange - Weak
    if (score >= 25) return '#eab308'; // Yellow - Moderate
    if (score > 0) return '#22c55e'; // Green - Strong
    return '#1e293b'; // Dark - No data
  };

  // Get difficulty level text
  const getDifficultyLevel = (score: number): string => {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'Needs Work';
    if (score >= 25) return 'Fair';
    if (score > 0) return 'Good';
    return 'Not Attempted';
  };

  const topWeaknesses = topicWeaknesses.filter(t => t.weaknessScore > 0).slice(0, 5);
  const selectedTopicData = selectedTopic 
    ? topicWeaknesses.find(t => t.topicId === selectedTopic)
    : null;

  const selectedProblems = selectedTopicData
    ? striverSheetComplete.filter(p => 
        selectedTopicData.problemsNeedingAttention.includes(p.id)
      )
    : [];

  return (
    <div className="weakness-analyzer">
      {/* Header */}
      <div className="analyzer-header">
        <div className="header-content">
          <h1 className="page-title">
            <TrendingDown className="title-icon" />
            Weakness Analyzer
          </h1>
          <p className="page-description">
            Identify and conquer your weak areas with data-driven insights
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="analyzer-stats">
        <div className="stat-card critical">
          <AlertTriangle size={28} />
          <div className="stat-content">
            <div className="stat-value">{topicWeaknesses.filter(t => t.weaknessScore >= 75).length}</div>
            <div className="stat-label">Critical Areas</div>
          </div>
        </div>

        <div className="stat-card needs-work">
          <Target size={28} />
          <div className="stat-content">
            <div className="stat-value">{topicWeaknesses.filter(t => t.weaknessScore >= 50 && t.weaknessScore < 75).length}</div>
            <div className="stat-label">Needs Work</div>
          </div>
        </div>

        <div className="stat-card total-weak">
          <BarChart3 size={28} />
          <div className="stat-content">
            <div className="stat-value">
              {topicWeaknesses.reduce((sum, t) => sum + t.problemsNeedingAttention.length, 0)}
            </div>
            <div className="stat-label">Problems to Review</div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="heatmap-section">
        <div className="section-header">
          <h2>Topic Weakness Heatmap</h2>
          <p>Darker colors indicate weaker areas requiring more attention</p>
        </div>

        <div className="heatmap-grid">
          {topicWeaknesses.map(topic => (
            <div
              key={topic.topicId}
              className={`heatmap-cell ${selectedTopic === topic.topicId ? 'selected' : ''}`}
              style={{ 
                backgroundColor: getHeatmapColor(topic.weaknessScore),
                borderColor: selectedTopic === topic.topicId ? '#22d3ee' : 'transparent'
              }}
              onClick={() => setSelectedTopic(selectedTopic === topic.topicId ? null : topic.topicId)}
              title={`${topic.topicName}: ${getDifficultyLevel(topic.weaknessScore)}`}
            >
              <div className="cell-content">
                <div className="cell-name">{topic.topicName}</div>
                <div className="cell-score">{Math.round(topic.weaknessScore)}</div>
                {topic.problemsNeedingAttention.length > 0 && (
                  <div className="cell-badge">{topic.problemsNeedingAttention.length}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Critical (75-100)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
            <span>Needs Work (50-74)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
            <span>Fair (25-49)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Good (1-24)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#1e293b' }}></div>
            <span>Not Attempted</span>
          </div>
        </div>
      </div>

      {/* Top Weaknesses List */}
      <div className="top-weaknesses-section">
        <div className="section-header">
          <h2>Top 5 Areas to Focus</h2>
          <p>Prioritize these topics for maximum improvement</p>
        </div>

        <div className="weaknesses-list">
          {topWeaknesses.map((topic, index) => (
            <div key={topic.topicId} className="weakness-item">
              <div className="weakness-rank">#{index + 1}</div>
              <div className="weakness-info">
                <h3>{topic.topicName}</h3>
                <div className="weakness-metrics">
                  <span className="metric">
                    <Clock size={14} />
                    {topic.avgAttempts.toFixed(1)} avg attempts
                  </span>
                  <span className="metric">
                    Solve Rate: {topic.attempted > 0 ? Math.round((topic.solved / topic.attempted) * 100) : 0}%
                  </span>
                  <span className="metric">
                    Confidence: {topic.avgConfidence.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <div className="weakness-score" style={{ color: getHeatmapColor(topic.weaknessScore) }}>
                {Math.round(topic.weaknessScore)}
              </div>
              <button 
                className="focus-btn"
                onClick={() => setSelectedTopic(topic.topicId)}
              >
                Review Problems
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Topic Problems */}
      {selectedTopicData && selectedProblems.length > 0 && (
        <div className="selected-topic-section">
          <div className="section-header">
            <h2>{selectedTopicData.topicName} - Problems Needing Attention</h2>
            <p>{selectedProblems.length} problems require review</p>
          </div>

          <div className="problems-grid">
            {selectedProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
