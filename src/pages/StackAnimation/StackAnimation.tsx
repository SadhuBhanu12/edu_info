import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, Layers, Plus, Minus, CheckCircle, Info, ArrowUp, ArrowDown } from 'lucide-react';
import '../ArrayAnimation/ArrayAnimation.css';
import './StackAnimation.css';

interface StackElement {
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
  elements: StackElement[];
  operation: 'initial' | 'push' | 'pop' | 'complete';
  visualCue?: string;
  benefit?: string;
}

const StackAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const steps: AnimationStep[] = [
    {
      title: '📚 What is a Stack?',
      description: 'Think of a stack of plates - Last In, First Out (LIFO)',
      explanation: 'You can only add or remove from the top. Like stacking books!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
      ],
      operation: 'initial',
      visualCue: '💡 Always work with the TOP element',
      benefit: 'Perfect for undo/redo functionality'
    },
    {
      title: '➕ Push Operation',
      description: 'Adding element 40 to the top',
      explanation: 'Place the new element on top of the stack. The stack grows upward!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
        { id: 'new', value: 40, isNew: true, isActive: true },
      ],
      operation: 'push',
      visualCue: '⬆️ Element drops from above',
      benefit: 'O(1) - Constant time operation'
    },
    {
      title: '➖ Pop Operation',
      description: 'Removing the top element',
      explanation: 'Take the top element off the stack. The element below becomes the new top!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30, isRemoving: true, isActive: true },
      ],
      operation: 'pop',
      visualCue: '⬇️ Top element lifts away',
      benefit: 'O(1) - Always instant access to top'
    },
    {
      title: '✅ Stack Complete!',
      description: 'LIFO principle mastered',
      explanation: 'You learned Push and Pop. Stacks are essential for function calls, backtracking, and more!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
      ],
      operation: 'complete',
      visualCue: '🎉 Master of LIFO structures',
      benefit: 'Used in recursion, expression evaluation'
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
    <div className="stack-animation-page">
      <header className="animation-header">
        <div className="header-icon">
          <Layers size={40} />
        </div>
        <div className="header-content">
          <h1 className="animation-title">Stack: Visual Guide</h1>
          <p className="animation-subtitle">Learn LIFO (Last In, First Out) - No code required!</p>
        </div>
      </header>

      <div className="animation-container">
        <div className="step-info">
          <div className="step-header">
            <div className="step-icon stack-icon">
              {currentAnimation.operation === 'initial' && <Layers size={24} />}
              {currentAnimation.operation === 'push' && <Plus size={24} />}
              {currentAnimation.operation === 'pop' && <Minus size={24} />}
              {currentAnimation.operation === 'complete' && <CheckCircle size={24} />}
            </div>
            <div className="step-counter">Step {currentStep + 1} of {steps.length}</div>
          </div>
          <h2 className="step-title">{currentAnimation.title}</h2>
          <p className="step-description">{currentAnimation.description}</p>
        </div>

        <div className="stack-visualization">
          <div className="stack-label">TOP ⬇️</div>
          <div className="stack-container">
            {[...currentAnimation.elements].reverse().map((element, index) => (
              <div
                key={element.id}
                className={`stack-plate ${element.isActive ? 'active' : ''} ${
                  element.isNew ? 'new-plate' : ''
                } ${element.isRemoving ? 'removing-plate' : ''}`}
              >
                {element.isActive && currentAnimation.operation === 'push' && (
                  <div className="drop-arrow">
                    <ArrowDown size={24} className="arrow-icon" />
                  </div>
                )}
                {element.isActive && currentAnimation.operation === 'pop' && (
                  <div className="lift-arrow">
                    <ArrowUp size={24} className="arrow-icon" />
                  </div>
                )}
                <div className="plate-value">{element.value}</div>
                <div className="plate-label">
                  {index === 0 ? 'TOP' : `Level ${currentAnimation.elements.length - index - 1}`}
                </div>
              </div>
            ))}
          </div>
          <div className="stack-base">BOTTOM</div>
        </div>

        {currentAnimation.operation === 'complete' && (
          <div className="completion-visual">
            <div className="checkmark-circle">
              <CheckCircle size={80} className="check-icon" />
            </div>
            <h3 className="completion-title">Amazing Work! 🎉</h3>
            <p className="completion-text">You've mastered stack operations</p>
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
            <div className="benefit-badge stack-badge">
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
            <div className="legend-icon stack-active-icon">
              <Layers size={14} />
            </div>
            <span>Active Element</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon stack-new-icon">
              <Plus size={14} />
            </div>
            <span>Pushing</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon stack-remove-icon">
              <Minus size={14} />
            </div>
            <span>Popping</span>
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
        <button className="control-btn primary stack-primary" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
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
          <div className="progress-fill stack-progress" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="progress-text">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>
    </div>
  );
};

export default StackAnimation;
