import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { ExternalLink, Check, RotateCcw, Circle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import type { Problem, ProblemStatus } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import './ProblemCard.css';

interface ProblemCardProps {
  problem: Problem;
  showTopic?: boolean;
}

export const ProblemCard = memo(function ProblemCard({ problem, showTopic = false }: ProblemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { getProblemProgress, updateProblemStatus, updateProblemNotes, updateProblemConfidence } = useProgress();
  const progress = getProblemProgress(problem.id);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const status = progress?.status || 'unsolved';
  const notes = progress?.notes || '';
  const confidence = progress?.confidence || 3;

  // Sync local notes with progress notes when progress changes
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleStatusChange = useCallback((e: React.MouseEvent, newStatus: ProblemStatus) => {
    e.preventDefault();
    e.stopPropagation();
    updateProblemStatus(problem.id, newStatus);
  }, [problem.id, updateProblemStatus]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    setIsSaving(true);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the update - only save after 500ms of no typing
    debounceTimerRef.current = setTimeout(() => {
      updateProblemNotes(problem.id, newNotes);
      setIsSaving(false);
    }, 500);
  }, [problem.id, updateProblemNotes]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleConfidenceChange = useCallback((rating: number) => {
    updateProblemConfidence(problem.id, rating);
  }, [problem.id, updateProblemConfidence]);

  const getDifficultyClass = () => {
    return `difficulty-${problem.difficulty.toLowerCase()}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'solved':
        return <Check size={16} />;
      case 'revision':
        return <RotateCcw size={16} />;
      default:
        return <Circle size={16} />;
    }
  };

  return (
    <div className={`problem-card ${status}`}>
      <div className="problem-main" onClick={() => setExpanded(!expanded)}>
        <div className="problem-status">
          <button
            type="button"
            className={`status-btn ${status === 'solved' ? 'active' : ''}`}
            onClick={(e) => handleStatusChange(e, status === 'solved' ? 'unsolved' : 'solved')}
            title={status === 'solved' ? 'Mark as unsolved' : 'Mark as solved'}
          >
            {getStatusIcon()}
          </button>
        </div>

        <div className="problem-info">
          <div className="problem-title-row">
            <h4 className="problem-title">{problem.title}</h4>
            <span className={`difficulty-badge ${getDifficultyClass()}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="problem-tags">
            {problem.patterns.map((pattern) => (
              <span key={pattern} className="pattern-tag">
                {pattern}
              </span>
            ))}
            {showTopic && (
              <span className="topic-tag">{problem.topicId}</span>
            )}
          </div>
        </div>

        <div className="problem-actions">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`problem-link platform-${problem.platform.toLowerCase().replace(/\s+/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            title={`Open on ${problem.platform}`}
          >
            <span className="platform-logo">
              {problem.platform === 'LeetCode' ? '🔶' : '🟢'}
            </span>
            <span className="platform-name">{problem.platform}</span>
            <ExternalLink size={14} className="external-icon" />
          </a>
          <button className="expand-btn" title={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="problem-expanded">
          <div className="problem-details">
            <div className="detail-group">
              <label className="detail-label">Status</label>
              <div className="status-buttons">
                <button
                  className={`status-option ${status === 'unsolved' ? 'active' : ''}`}
                  onClick={(e) => handleStatusChange(e, 'unsolved')}
                >
                  <Circle size={14} />
                  Unsolved
                </button>
                <button
                  className={`status-option ${status === 'solved' ? 'active' : ''}`}
                  onClick={(e) => handleStatusChange(e, 'solved')}
                >
                  <Check size={14} />
                  Solved
                </button>
                <button
                  className={`status-option ${status === 'revision' ? 'active' : ''}`}
                  onClick={(e) => handleStatusChange(e, 'revision')}
                >
                  <RotateCcw size={14} />
                  Revision
                </button>
              </div>
            </div>

            {status === 'solved' && (
              <div className="detail-group">
                <label className="detail-label">Confidence Level</label>
                <div className="confidence-rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={`confidence-star ${rating <= confidence ? 'active' : ''}`}
                      onClick={() => handleConfidenceChange(rating)}
                    >
                      <Star size={18} fill={rating <= confidence ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className="confidence-label">
                    {confidence <= 2 ? 'Need more practice' : confidence <= 4 ? 'Getting there' : 'Mastered!'}
                  </span>
                </div>
              </div>
            )}

            <div className="detail-group">
              <div className="notes-header">
                <label className="detail-label">Notes</label>
                {isSaving && <span className="saving-indicator">Saving...</span>}
              </div>
              <textarea
                className="notes-input"
                placeholder="Add your notes, approach, or key insights..."
                value={localNotes}
                onChange={handleNotesChange}
                rows={3}
              />
            </div>

            {problem.companies && problem.companies.length > 0 && (
              <div className="detail-group">
                <label className="detail-label">Asked by</label>
                <div className="company-tags">
                  {problem.companies.map((company) => (
                    <span key={company} className="company-tag">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
