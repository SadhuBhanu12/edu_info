import { useState } from 'react';
import { Shuffle, Target, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import { useProgress } from '../../context/ProgressContext';
import { ProblemCard } from '../../components/Cards';
import type { Difficulty, Problem } from '../../types';
import './RevisionDashboard.css';

export function RevisionDashboard() {
  const { getProblemProgress } = useProgress();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [randomProblem, setRandomProblem] = useState<Problem | null>(null);

  // Get problems due for revision
  const getRevisionProblems = () => {
    const revisionList: Array<{
      problem: Problem;
      priority: 'urgent' | 'high' | 'medium' | 'low';
      daysOverdue: number;
      confidence: number;
    }> = [];

    striverSheetComplete.forEach(problem => {
      const problemProgress = getProblemProgress(problem.id);
      
      if (problemProgress?.status === 'solved' && problemProgress.solvedDate) {
        const confidence = problemProgress.confidence || 3;
        
        // Calculate next revision (simple: 1 day after first solve, then 3, 7, 14, 30)
        const daysSinceSolved = Math.floor(
          (new Date().getTime() - new Date(problemProgress.solvedDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Revision intervals based on confidence
        let nextRevision = 1;
        if (daysSinceSolved < 1) nextRevision = 1;
        else if (daysSinceSolved < 3) nextRevision = 3;
        else if (daysSinceSolved < 7) nextRevision = 7;
        else if (daysSinceSolved < 14) nextRevision = 14;
        else nextRevision = 30;
        
        const daysOverdue = daysSinceSolved - nextRevision;
        
        // Only include if due or overdue (and not super confident)
        if (daysOverdue >= 0 && confidence < 5) {
          const priority = daysOverdue > 3 && confidence <= 2 ? 'urgent' :
                          daysOverdue > 0 && confidence <= 3 ? 'high' :
                          daysOverdue >= 0 ? 'medium' : 'low';
          
          revisionList.push({ problem, priority, daysOverdue, confidence });
        }
      }
    });

    return revisionList.sort((a, b) => {
      // Sort by priority then by days overdue
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysOverdue - a.daysOverdue;
    });
  };

  // Get weak problems (low confidence or many attempts)
  const getWeakProblems = () => {
    const weakList: Array<{
      problem: Problem;
      confidence: number;
      attempts: number;
    }> = [];

    striverSheetComplete.forEach(problem => {
      const problemProgress = getProblemProgress(problem.id);
      
      if (problemProgress?.status === 'solved') {
        const confidence = problemProgress.confidence || 3;
        const attempts = problemProgress.attempts || 1;
        
        // Weak = confidence <= 2 OR attempts > 3
        if (confidence <= 2 || attempts > 3) {
          weakList.push({ problem, confidence, attempts });
        }
      }
    });

    return weakList.sort((a, b) => {
      // Sort by confidence (lower first) then attempts (higher first)
      if (a.confidence !== b.confidence) return a.confidence - b.confidence;
      return b.attempts - a.attempts;
    });
  };

  // Random problem picker
  const pickRandomProblem = () => {
    let filtered = striverSheetComplete.filter(problem => {
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesTopic = selectedTopic === 'all' || problem.topicId === selectedTopic;
      const progress = getProblemProgress(problem.id);
      const isUnsolved = !progress || progress.status === 'unsolved';
      
      return matchesDifficulty && matchesTopic && isUnsolved;
    });

    if (filtered.length === 0) {
      // If no unsolved, pick from all
      filtered = striverSheetComplete.filter(problem => {
        const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
        const matchesTopic = selectedTopic === 'all' || problem.topicId === selectedTopic;
        return matchesDifficulty && matchesTopic;
      });
    }

    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setRandomProblem(filtered[randomIndex]);
    }
  };

  const revisionProblems = getRevisionProblems();
  const weakProblems = getWeakProblems();
  const totalRevisionDue = revisionProblems.length;
  const urgentCount = revisionProblems.filter(p => p.priority === 'urgent').length;

  return (
    <div className="revision-dashboard">
      {/* Header */}
      <div className="revision-header">
        <div className="header-content">
          <h1 className="page-title">
            <TrendingUp className="title-icon" />
            Smart Revision System
          </h1>
          <p className="page-description">
            Spaced repetition powered learning - Remember what you solve!
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="revision-stats">
        <div className="stat-card urgent">
          <AlertCircle size={28} />
          <div className="stat-content">
            <div className="stat-value">{urgentCount}</div>
            <div className="stat-label">Urgent Revisions</div>
          </div>
        </div>

        <div className="stat-card total">
          <Clock size={28} />
          <div className="stat-content">
            <div className="stat-value">{totalRevisionDue}</div>
            <div className="stat-label">Due Today</div>
          </div>
        </div>

        <div className="stat-card weak">
          <Target size={28} />
          <div className="stat-content">
            <div className="stat-value">{weakProblems.length}</div>
            <div className="stat-label">Weak Areas</div>
          </div>
        </div>
      </div>

      {/* Random Problem Picker */}
      <section className="random-picker-section">
        <div className="section-header">
          <h2>🎲 Random Problem Picker</h2>
          <p>Challenge yourself with a surprise problem!</p>
        </div>

        <div className="picker-controls">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
            className="picker-select"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="picker-select"
          >
            <option value="all">All Topics</option>
            <option value="arrays-strings">Arrays & Strings</option>
            <option value="linked-lists">Linked Lists</option>
            <option value="stacks-queues">Stacks & Queues</option>
            <option value="trees-graphs">Trees & Graphs</option>
            <option value="dynamic-programming">Dynamic Programming</option>
            <option value="sorting-searching">Sorting & Searching</option>
          </select>

          <button onClick={pickRandomProblem} className="random-btn">
            <Shuffle size={20} />
            Pick Random Problem
          </button>
        </div>

        {randomProblem && (
          <div className="random-problem-result">
            <ProblemCard problem={randomProblem} showTopic />
          </div>
        )}
      </section>

      {/* Revision Due Today */}
      {totalRevisionDue > 0 && (
        <section className="revision-section">
          <div className="section-header">
            <h2>📅 Due for Revision Today</h2>
            <p>Review these problems to strengthen your memory</p>
          </div>

          <div className="revision-list">
            {revisionProblems.slice(0, 10).map(({ problem, priority, daysOverdue, confidence }) => (
              <div key={problem.id} className="revision-item">
                <div className={`priority-indicator ${priority}`}></div>
                <ProblemCard problem={problem} showTopic />
                <div className="revision-meta">
                  <span className="overdue-badge">
                    {daysOverdue > 0 ? `${daysOverdue}d overdue` : 'Due today'}
                  </span>
                  <span className="confidence-badge">
                    Confidence: {confidence}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Weak Areas */}
      {weakProblems.length > 0 && (
        <section className="weak-section">
          <div className="section-header">
            <h2>⚠️ Problems to Strengthen</h2>
            <p>Low confidence or multiple attempts - Focus here!</p>
          </div>

          <div className="weak-list">
            {weakProblems.slice(0, 8).map(({ problem, confidence, attempts }) => (
              <div key={problem.id} className="weak-item">
                <ProblemCard problem={problem} showTopic />
                <div className="weak-meta">
                  <span className="confidence-badge low">
                    Confidence: {confidence}/5
                  </span>
                  <span className="attempts-badge">
                    {attempts} attempts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
