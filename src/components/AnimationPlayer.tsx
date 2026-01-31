import React, { useState, useEffect } from 'react';
import type { AnimationStep } from '../types';
import './AnimationPlayer.css';

interface AnimationPlayerProps {
  steps: AnimationStep[];
  title: string;
}

export const AnimationPlayer: React.FC<AnimationPlayerProps> = ({ steps, title }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x

  const currentAnimation = steps[currentStep];

  useEffect(() => {
    if (!isPlaying) return;

    const duration = (currentAnimation?.duration || 1500) / speed;
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, currentAnimation, speed, steps.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };
  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };
  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const getTransitionClass = () => {
    const type = currentAnimation?.transitionType || 'fade';
    return `animation-content animation-${type}`;
  };

  return (
    <div className="animation-player">
      {/* Header */}
      <div className="animation-header">
        <h3 className="animation-title">{title}</h3>
        <div className="step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Main visualization area */}
      <div className="animation-viewport">
        <div className={getTransitionClass()} key={currentStep}>
          {currentAnimation?.visualContent && (
            <div 
              className="svg-container"
              dangerouslySetInnerHTML={{ __html: currentAnimation.visualContent }}
            />
          )}
        </div>
      </div>

      {/* Step description */}
      <div className="animation-description">
        <div className="step-title">{currentAnimation?.description}</div>
        {currentAnimation?.explanation && (
          <div className="step-explanation">{currentAnimation.explanation}</div>
        )}
      </div>

      {/* Code display */}
      {currentAnimation?.code && (
        <div className="code-display">
          <div className="code-header">
            <span className="code-icon">{'</>'}Code</span>
          </div>
          <pre className="code-content">
            <code>{currentAnimation.code}</code>
          </pre>
        </div>
      )}

      {/* Controls */}
      <div className="animation-controls">
        <div className="playback-controls">
          <button 
            onClick={handleReplay} 
            className="control-btn replay-btn"
            title="Replay"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>

          <button 
            onClick={handlePrevious} 
            className="control-btn"
            disabled={currentStep === 0}
            title="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" y1="19" x2="5" y2="5"/>
            </svg>
          </button>

          <button 
            onClick={isPlaying ? handlePause : handlePlay}
            className="control-btn play-btn"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          <button 
            onClick={handleNext}
            className="control-btn"
            disabled={currentStep === steps.length - 1}
            title="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4"/>
              <line x1="19" y1="5" x2="19" y2="19"/>
            </svg>
          </button>
        </div>

        {/* Speed control */}
        <div className="speed-control">
          <span className="speed-label">Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="step-dots">
        {steps.map((_, index) => (
          <button
            key={index}
            className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(index);
            }}
            title={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimationPlayer;
