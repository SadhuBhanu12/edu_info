import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, Users, Plus, Minus, CheckCircle, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import '../ArrayAnimation/ArrayAnimation.css';
import './QueueAnimation.css';

interface QueueElement {
  id: string;
  value: number;
  isActive?: boolean;
  isNew?: boolean;
  isRemoving?: boolean;
}

interface AnimationStep {
  title: string;
  description: string;
  explanation: string;
  elements: QueueElement[];
  operation: 'initial' | 'enqueue' | 'dequeue' | 'complete';
  visualCue?: string;
  benefit?: string;
}

const QueueAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const steps: AnimationStep[] = [
    {
      title: '👥 What is a Queue?',
      description: 'Think of a line at a store - First In, First Out (FIFO)',
      explanation: 'First person in line is first served. Fair and orderly!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
      ],
      operation: 'initial',
      visualCue: '💡 Front exits, Rear enters',
      benefit: 'Perfect for task scheduling, print queues'
    },
    {
      title: '➕ Enqueue Operation',
      description: 'Adding element 40 to the rear',
      explanation: 'New person joins the back of the line. The queue grows at the rear!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
        { id: 'new', value: 40, isNew: true, isActive: true },
      ],
      operation: 'enqueue',
      visualCue: '👉 Join at the back',
      benefit: 'O(1) - Constant time to add'
    },
    {
      title: '➖ Dequeue Operation',
      description: 'Removing from the front',
      explanation: 'First person in line leaves. Everyone else moves forward!',
      elements: [
        { id: '0', value: 10, isRemoving: true, isActive: true },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
        { id: 'new', value: 40 },
      ],
      operation: 'dequeue',
      visualCue: '👈 Leave from the front',
      benefit: 'O(1) - Instant removal from front'
    },
    {
      title: '✅ Queue Complete!',
      description: 'FIFO principle mastered',
      explanation: 'You learned Enqueue and Dequeue. Queues are essential for fair processing!',
      elements: [
        { id: '1', value: 20 },
        { id: '2', value: 30 },
        { id: 'new', value: 40 },
      ],
      operation: 'complete',
      visualCue: '🎉 Master of FIFO structures',
      benefit: 'Used in BFS, task scheduling, buffering'
    }
  ];

  const currentAnimation = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  return (
    <div className="queue-animation-page">
      <header className="animation-header">
        <div className="header-icon">
          <Users size={40} />
        </div>
        <div className="header-content">
          <h1 className="animation-title">Queue: Visual Guide</h1>
          <p className="animation-subtitle">Learn FIFO (First In, First Out) - No code required!</p>
        </div>
      </header>

      <div className="animation-container">
        <div className="step-info">
          <div className="step-header">
            <div className="step-icon queue-icon">
              {currentAnimation.operation === 'initial' && <Users size={24} />}
              {currentAnimation.operation === 'enqueue' && <Plus size={24} />}
              {currentAnimation.operation === 'dequeue' && <Minus size={24} />}
              {currentAnimation.operation === 'complete' && <CheckCircle size={24} />}
            </div>
            <div className="step-counter">Step {currentStep + 1} of {steps.length}</div>
          </div>
          <h2 className="step-title">{currentAnimation.title}</h2>
          <p className="step-description">{currentAnimation.description}</p>
        </div>

        <div className="queue-visualization">
          <div className="queue-labels">
            <div className="queue-label front-label">
              <ArrowLeft size={20} />
              <span>FRONT (Exit)</span>
            </div>
            <div className="queue-label rear-label">
              <span>REAR (Enter)</span>
              <ArrowRight size={20} />
            </div>
          </div>
          <div className="queue-container">
            {currentAnimation.elements.map((element, index) => (
              <div
                key={element.id}
                className={`queue-person ${element.isActive ? 'active' : ''} ${
                  element.isNew ? 'new-person' : ''
                } ${element.isRemoving ? 'removing-person' : ''}`}
              >
                {element.isActive && currentAnimation.operation === 'enqueue' && (
                  <div className="enter-arrow">
                    <ArrowLeft size={24} className="arrow-icon" />
                  </div>
                )}
                {element.isActive && currentAnimation.operation === 'dequeue' && (
                  <div className="exit-arrow">
                    <ArrowRight size={24} className="arrow-icon" />
                  </div>
                )}
                <div className="person-value">{element.value}</div>
                <div className="person-label">
                  {index === 0 ? 'FRONT' : index === currentAnimation.elements.length - 1 ? 'REAR' : `Person ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentAnimation.operation === 'complete' && (
          <div className="completion-visual">
            <div className="checkmark-circle">
              <CheckCircle size={80} className="check-icon" />
            </div>
            <h3 className="completion-title">Outstanding! 🎉</h3>
            <p className="completion-text">You've mastered queue operations</p>
          </div>
        )}

        <div className="explanation-card">
          <div className="explanation-header">
            <Info size={18} />
            <span>How it works</span>
          </div>
          <p className="explanation-text">{currentAnimation.explanation}</p>
          <div className="visual-cue">
            <span className="cue-icon">{currentAnimation.visualCue?.substring(0, 2)}</span>
            <span className="cue-text">{currentAnimation.visualCue?.substring(2)}</span>
          </div>
          {currentAnimation.benefit && (
            <div className="benefit-badge queue-badge">
              <Zap size={14} />
              <span>{currentAnimation.benefit}</span>
            </div>
          )}
        </div>
      </div>

      <div className="visual-legend">
        <h3 className="legend-title">
          <Info size={18} />
          Visual Guide
        </h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-icon queue-active-icon">
              <Users size={14} />
            </div>
            <span>Active Element</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon queue-new-icon">
              <Plus size={14} />
            </div>
            <span>Enqueuing</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon queue-remove-icon">
              <Minus size={14} />
            </div>
            <span>Dequeuing</span>
          </div>
        </div>
      </div>

      <div className="animation-controls">
        <button className="control-btn" onClick={handleReset} title="Reset">
          <RotateCcw size={20} />
        </button>
        <button className="control-btn" onClick={handlePrevious} disabled={currentStep === 0} title="Previous">
          <SkipBack size={20} />
        </button>
        <button className="control-btn primary queue-primary" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="control-btn" onClick={handleNext} disabled={currentStep === steps.length - 1} title="Next">
          <SkipForward size={20} />
        </button>
        <div className="speed-control">
          <Zap size={16} />
          <input type="range" min="500" max="3000" step="500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="speed-slider" />
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill queue-progress" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="progress-text">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>
    </div>
  );
};

export default QueueAnimation;
