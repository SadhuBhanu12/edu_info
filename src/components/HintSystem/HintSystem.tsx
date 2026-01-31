import { useState } from 'react';
import { Lightbulb, Eye, Code, CheckCircle, ChevronRight } from 'lucide-react';
import './HintSystem.css';

export interface Hint {
  level: 'insight' | 'approach' | 'pseudocode' | 'solution';
  title: string;
  content: string;
  code?: string;
}

interface HintSystemProps {
  problemId: string;
  hints: Hint[];
  onHintRevealed?: (level: string) => void;
}

const HINT_LEVELS = [
  { 
    level: 'insight', 
    icon: Lightbulb, 
    color: '#22d3ee',
    title: 'Insight',
    description: 'Key observation or pattern'
  },
  { 
    level: 'approach', 
    icon: Eye, 
    color: '#8b5cf6',
    title: 'Approach',
    description: 'High-level strategy'
  },
  { 
    level: 'pseudocode', 
    icon: Code, 
    color: '#f59e0b',
    title: 'Pseudocode',
    description: 'Step-by-step logic'
  },
  { 
    level: 'solution', 
    icon: CheckCircle, 
    color: '#22c55e',
    title: 'Full Solution',
    description: 'Complete implementation'
  }
];

export function HintSystem({ problemId: _, hints, onHintRevealed }: HintSystemProps) {
  const [revealedLevels, setRevealedLevels] = useState<Set<string>>(new Set());
  const [animatingLevel, setAnimatingLevel] = useState<string | null>(null);

  const handleRevealHint = (level: string) => {
    if (revealedLevels.has(level)) return;

    setAnimatingLevel(level);
    setTimeout(() => {
      setRevealedLevels(prev => new Set([...prev, level]));
      setAnimatingLevel(null);
      onHintRevealed?.(level);
    }, 300);
  };

  const getCurrentHintIndex = () => {
    return HINT_LEVELS.findIndex(h => !revealedLevels.has(h.level));
  };

  const allRevealed = revealedLevels.size === hints.length;
  const currentIndex = getCurrentHintIndex();
  const canRevealNext = currentIndex !== -1;

  return (
    <div className="hint-system">
      <div className="hint-header">
        <div className="hint-header-content">
          <h3>Progressive Hints</h3>
          <p>Reveal hints gradually to maintain the learning challenge</p>
        </div>
        <div className="hint-progress">
          <span>{revealedLevels.size} / {hints.length} revealed</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(revealedLevels.size / hints.length) * 100}%`,
                background: 'linear-gradient(90deg, #22d3ee, #8b5cf6)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="hint-levels">
        {HINT_LEVELS.map((levelInfo, index) => {
          const hint = hints.find(h => h.level === levelInfo.level);
          if (!hint) return null;

          const isRevealed = revealedLevels.has(levelInfo.level);
          const isAnimating = animatingLevel === levelInfo.level;
          const isLocked = currentIndex < index;

          const Icon = levelInfo.icon;

          return (
            <div
              key={levelInfo.level}
              className={`hint-level ${isRevealed ? 'revealed' : ''} ${isAnimating ? 'animating' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div className="hint-level-header">
                <div className="hint-level-info">
                  <div 
                    className="hint-icon-wrapper"
                    style={{ 
                      background: isRevealed 
                        ? `linear-gradient(135deg, ${levelInfo.color}, ${levelInfo.color}dd)`
                        : 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Icon 
                      size={20} 
                      style={{ color: isRevealed ? '#ffffff' : '#666666' }}
                    />
                  </div>
                  <div>
                    <h4 style={{ color: isRevealed ? levelInfo.color : '#a3a3a3' }}>
                      {levelInfo.title}
                    </h4>
                    <p>{levelInfo.description}</p>
                  </div>
                </div>

                {!isRevealed && !isLocked && (
                  <button
                    className="reveal-btn"
                    onClick={() => handleRevealHint(levelInfo.level)}
                    style={{ borderColor: levelInfo.color, color: levelInfo.color }}
                  >
                    Reveal <ChevronRight size={16} />
                  </button>
                )}

                {isLocked && (
                  <span className="locked-badge">Locked</span>
                )}
              </div>

              {isRevealed && (
                <div className="hint-content">
                  <div className="hint-text">
                    {hint.content}
                  </div>
                  
                  {hint.code && (
                    <div className="hint-code">
                      <div className="code-header">
                        <Code size={14} />
                        <span>Code Example</span>
                      </div>
                      <pre><code>{hint.code}</code></pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!allRevealed && canRevealNext && (
        <div className="hint-footer">
          <div className="hint-tip">
            💡 <strong>Tip:</strong> Try solving without hints first. Each hint revealed reduces your learning opportunity.
          </div>
        </div>
      )}

      {allRevealed && (
        <div className="hint-completion">
          <CheckCircle size={24} style={{ color: '#22c55e' }} />
          <div>
            <strong>All hints revealed!</strong>
            <p>Make sure you understand the solution before moving on.</p>
          </div>
        </div>
      )}
    </div>
  );
}
