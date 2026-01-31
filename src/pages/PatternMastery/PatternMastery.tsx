import { useMemo } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import { DSA_PATTERNS, calculatePatternMastery, getPatternDifficulty, recommendNextPattern } from '../../utils/patternRecognition';
import { Award, TrendingUp, Target, CheckCircle2, BookOpen } from 'lucide-react';
import { ProblemCard } from '../../components/Cards/ProblemCard';
import './PatternMastery.css';

interface PatternStats {
  patternName: string;
  difficulty: string;
  totalProblems: number;
  solvedProblems: number;
  avgConfidence: number;
  masteryScore: number;
  exampleProblems: string[];
}

export function PatternMastery() {
  const { progress, getProblemProgress } = useProgress();

  // Calculate mastery for each pattern
  const patternStats = useMemo((): PatternStats[] => {
    const stats: PatternStats[] = [];

    DSA_PATTERNS.forEach(pattern => {
      const patternProblems = striverSheetComplete.filter(p => 
        p.patterns?.some(pName => pName.toLowerCase() === pattern.name.toLowerCase())
      );

      const totalProblems = patternProblems.length;
      let solvedProblems = 0;
      let totalConfidence = 0;
      let problemsWithConfidence = 0;

      patternProblems.forEach(problem => {
        const prog = getProblemProgress(problem.id);
        if (prog?.status === 'solved') {
          solvedProblems++;
          totalConfidence += prog.confidence;
          problemsWithConfidence++;
        }
      });

      const avgConfidence = problemsWithConfidence > 0 ? totalConfidence / problemsWithConfidence : 0;
      const completionRate = totalProblems > 0 ? solvedProblems / totalProblems : 0;
      const masteryScore = calculatePatternMastery(completionRate, avgConfidence);

      stats.push({
        patternName: pattern.name,
        difficulty: pattern.difficulty,
        totalProblems,
        solvedProblems,
        avgConfidence,
        masteryScore,
        exampleProblems: pattern.exampleProblems
      });
    });

    return stats.sort((a, b) => b.masteryScore - a.masteryScore);
  }, [progress, getProblemProgress]);

  const getMasteryLevel = (score: number): { level: string; color: string } => {
    if (score >= 90) return { level: 'Master', color: '#22c55e' };
    if (score >= 70) return { level: 'Advanced', color: '#22d3ee' };
    if (score >= 50) return { level: 'Intermediate', color: '#f59e0b' };
    if (score >= 25) return { level: 'Beginner', color: '#8b5cf6' };
    return { level: 'Not Started', color: '#6b7280' };
  };

  const getMasteryColor = (score: number): string => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#22d3ee';
    if (score >= 50) return '#f59e0b';
    if (score >= 25) return '#8b5cf6';
    return '#374151';
  };

  const getDifficultyColor = (difficulty: string): string => {
    if (difficulty === 'Easy') return '#22c55e';
    if (difficulty === 'Medium') return '#f59e0b';
    if (difficulty === 'Hard') return '#ef4444';
    return '#6b7280';
  };

  const masterPatterns = patternStats.filter(p => p.masteryScore >= 90);
  const advancedPatterns = patternStats.filter(p => p.masteryScore >= 70 && p.masteryScore < 90);
  const inProgressPatterns = patternStats.filter(p => p.masteryScore > 0 && p.masteryScore < 70);
  const notStartedPatterns = patternStats.filter(p => p.masteryScore === 0);

  const recommendedPattern = recommendNextPattern(
    patternStats.map(p => ({ pattern: p.patternName, masteryScore: p.masteryScore }))
  );
  const recommendedStats = patternStats.find(p => p.patternName === recommendedPattern);

  const overallMastery = patternStats.length > 0
    ? Math.round(patternStats.reduce((sum, p) => sum + p.masteryScore, 0) / patternStats.length)
    : 0;

  return (
    <div className="pattern-mastery">
      {/* Header */}
      <div className="mastery-header">
        <div className="header-content">
          <h1 className="page-title">
            <Award className="title-icon" />
            Pattern Mastery Dashboard
          </h1>
          <p className="page-description">
            Track your proficiency across 20+ DSA patterns used in top tech interviews
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="mastery-overview">
        <div className="overview-card main">
          <div className="overview-icon" style={{ background: `linear-gradient(135deg, ${getMasteryColor(overallMastery)}, ${getMasteryColor(overallMastery)}dd)` }}>
            <Award size={32} />
          </div>
          <div className="overview-content">
            <div className="overview-label">Overall Mastery</div>
            <div className="overview-value">{overallMastery}%</div>
            <div className="overview-sublabel">{getMasteryLevel(overallMastery).level}</div>
          </div>
          <div className="circular-progress" style={{ '--progress': `${overallMastery}%`, '--color': getMasteryColor(overallMastery) } as any}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="circle-bg" />
              <circle cx="50" cy="50" r="45" className="circle-progress" />
            </svg>
          </div>
        </div>

        <div className="overview-card">
          <CheckCircle2 size={24} style={{ color: '#22c55e' }} />
          <div className="overview-content">
            <div className="overview-value">{masterPatterns.length}</div>
            <div className="overview-label">Mastered Patterns</div>
          </div>
        </div>

        <div className="overview-card">
          <TrendingUp size={24} style={{ color: '#22d3ee' }} />
          <div className="overview-content">
            <div className="overview-value">{advancedPatterns.length}</div>
            <div className="overview-label">Advanced</div>
          </div>
        </div>

        <div className="overview-card">
          <Target size={24} style={{ color: '#f59e0b' }} />
          <div className="overview-content">
            <div className="overview-value">{inProgressPatterns.length}</div>
            <div className="overview-label">In Progress</div>
          </div>
        </div>

        <div className="overview-card">
          <BookOpen size={24} style={{ color: '#8b5cf6' }} />
          <div className="overview-content">
            <div className="overview-value">{notStartedPatterns.length}</div>
            <div className="overview-label">Not Started</div>
          </div>
        </div>
      </div>

      {/* Recommended Pattern */}
      {recommendedStats && recommendedStats.masteryScore < 90 && (
        <div className="recommended-section">
          <div className="section-header">
            <Target className="section-icon" style={{ color: '#22d3ee' }} />
            <div>
              <h2>Recommended Next Pattern</h2>
              <p>Focus on this pattern to maximize your learning efficiency</p>
            </div>
          </div>
          
          <div className="recommended-card">
            <div className="recommended-badge">
              <TrendingUp size={16} />
              Next Focus
            </div>
            <h3>{recommendedStats.patternName}</h3>
            <div className="recommended-stats">
              <div className="stat-item">
                <span className="stat-label">Difficulty:</span>
                <span className="stat-value" style={{ color: getDifficultyColor(recommendedStats.difficulty) }}>
                  {recommendedStats.difficulty}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progress:</span>
                <span className="stat-value">
                  {recommendedStats.solvedProblems}/{recommendedStats.totalProblems}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Mastery:</span>
                <span className="stat-value" style={{ color: getMasteryColor(recommendedStats.masteryScore) }}>
                  {Math.round(recommendedStats.masteryScore)}%
                </span>
              </div>
            </div>
            <div className="example-problems">
              <strong>Example Problems:</strong>
              <ul>
                {recommendedStats.exampleProblems.map((problem, idx) => (
                  <li key={idx}>{problem}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Grid */}
      <div className="patterns-section">
        <div className="section-header">
          <Award className="section-icon" style={{ color: '#8b5cf6' }} />
          <div>
            <h2>All Patterns ({patternStats.length})</h2>
            <p>Your proficiency across different DSA patterns</p>
          </div>
        </div>

        <div className="patterns-grid">
          {patternStats.map(pattern => {
            const masteryInfo = getMasteryLevel(pattern.masteryScore);
            const patternData = DSA_PATTERNS.find(p => p.name === pattern.patternName);
            
            return (
              <div key={pattern.patternName} className="pattern-card">
                <div className="pattern-header">
                  <div className="pattern-title-row">
                    <h3>{pattern.patternName}</h3>
                    <span 
                      className="difficulty-badge" 
                      style={{ 
                        background: `${getDifficultyColor(pattern.difficulty)}22`,
                        color: getDifficultyColor(pattern.difficulty),
                        borderColor: getDifficultyColor(pattern.difficulty)
                      }}
                    >
                      {pattern.difficulty}
                    </span>
                  </div>
                  <p className="pattern-description">{patternData?.description}</p>
                </div>

                <div className="pattern-mastery-bar">
                  <div className="mastery-bar-header">
                    <span className="mastery-label">{masteryInfo.level}</span>
                    <span className="mastery-percentage" style={{ color: masteryInfo.color }}>
                      {Math.round(pattern.masteryScore)}%
                    </span>
                  </div>
                  <div className="mastery-bar">
                    <div 
                      className="mastery-fill" 
                      style={{ 
                        width: `${pattern.masteryScore}%`,
                        background: `linear-gradient(90deg, ${masteryInfo.color}, ${masteryInfo.color}dd)`
                      }}
                    />
                  </div>
                </div>

                <div className="pattern-stats">
                  <div className="pattern-stat">
                    <span className="stat-label">Solved</span>
                    <span className="stat-value">{pattern.solvedProblems}/{pattern.totalProblems}</span>
                  </div>
                  <div className="pattern-stat">
                    <span className="stat-label">Confidence</span>
                    <span className="stat-value">
                      {pattern.avgConfidence > 0 ? pattern.avgConfidence.toFixed(1) : '-'}/5
                    </span>
                  </div>
                </div>

                {patternData && (
                  <div className="pattern-indicators">
                    <strong>Key Indicators:</strong>
                    <ul>
                      {patternData.keyIndicators.slice(0, 2).map((indicator, idx) => (
                        <li key={idx}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
