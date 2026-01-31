import { memo } from 'react';
import './ProgressCircle.css';

interface ProgressCircleProps {
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
  total: { solved: number; total: number };
}

export const ProgressCircle = memo(function ProgressCircle({ easy, medium, hard, total }: ProgressCircleProps) {
  const percentage = total.total > 0 ? Math.round((total.solved / total.total) * 100) : 0;
  
  // Calculate individual difficulty percentages
  const easyPercentage = easy.total > 0 ? (easy.solved / easy.total) * 100 : 0;
  const mediumPercentage = medium.total > 0 ? (medium.solved / medium.total) * 100 : 0;
  const hardPercentage = hard.total > 0 ? (hard.solved / hard.total) * 100 : 0;
  
  // SVG circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // Create multi-colored progress segments
  const easyStroke = (easyPercentage / 100) * circumference;
  const mediumStroke = (mediumPercentage / 100) * circumference;
  const hardStroke = (hardPercentage / 100) * circumference;
  
  // Weighted average for overall progress
  const totalStroke = (percentage / 100) * circumference;
  const dashOffset = circumference - totalStroke;

  return (
    <div className="tuf-progress-circle">
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
        </div>
        
        <div className="progress-visual">
          {/* Circular Progress */}
          <div className="circle-container">
            <svg viewBox="0 0 160 160" className="progress-svg">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="circle-bg"
                strokeWidth="12"
              />
              
              {/* Multi-segment progress */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="circle-progress"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="circle-content">
              <div className="percentage">{percentage}%</div>
              <div className="total-problems">{total.solved}/{total.total}</div>
            </div>
          </div>
          
          {/* Difficulty Breakdown */}
          <div className="difficulty-stats">
            <div className="diff-item">
              <div className="diff-indicator easy"></div>
              <span className="diff-label">Easy</span>
              <span className="diff-count">{easy.solved}/{easy.total}</span>
            </div>
            
            <div className="diff-item">
              <div className="diff-indicator medium"></div>
              <span className="diff-label">Medium</span>
              <span className="diff-count">{medium.solved}/{medium.total}</span>
            </div>
            
            <div className="diff-item">
              <div className="diff-indicator hard"></div>
              <span className="diff-label">Hard</span>
              <span className="diff-count">{hard.solved}/{hard.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
