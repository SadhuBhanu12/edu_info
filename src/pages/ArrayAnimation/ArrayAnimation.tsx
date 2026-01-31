import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, Lock, Package, Search, Plus, Trash2, CheckCircle, Info } from 'lucide-react';
import './ArrayAnimation.css';

interface ArrayElement {
  id: string;
  value: number;
  isActive?: boolean;
  isComparing?: boolean;
  isHighlighted?: boolean;
  isNew?: boolean;
  isDeleting?: boolean;
}

interface AnimationStep {
  title: string;
  description: string;
  explanation: string;
  elements: ArrayElement[];
  activeIndex?: number;
  operation: 'access' | 'insert' | 'delete' | 'initial' | 'complete';
  visualCue?: string;
  benefit?: string;
}

const ArrayAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  // Animation steps - Pure Visual Learning
  const steps: AnimationStep[] = [
    {
      title: '📦 What is an Array?',
      description: 'Think of lockers in a school hallway',
      explanation: 'Each locker has a number (index) and can store one item. Arrays work the same way!',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
        { id: '3', value: 40 },
      ],
      operation: 'initial',
      visualCue: '💡 Arrays store multiple values in order',
      benefit: 'Organized storage like numbered boxes'
    },
    {
      title: '🔍 Finding an Item (Access)',
      description: 'Direct access to any position',
      explanation: 'Want item at position 2? Go straight there! No need to check positions 0 and 1.',
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30, isActive: true, isHighlighted: true },
        { id: '3', value: 40 },
      ],
      activeIndex: 2,
      operation: 'access',
      visualCue: '⚡ Super fast - just jump to the position!',
      benefit: 'Time: O(1) - Instant access'
    },
    {
      title: '➕ Adding New Item (Insert)',
      description: 'Inserting value 15 at position 1',
      explanation: 'Make space by shifting items to the right, then place the new item.',
      elements: [
        { id: '0', value: 10 },
        { id: 'new', value: 15, isNew: true, isActive: true },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
        { id: '3', value: 40 },
      ],
      activeIndex: 1,
      operation: 'insert',
      visualCue: '👉 Items shift right to make room',
      benefit: 'Maintains order automatically'
    },
    {
      title: '🗑️ Removing an Item (Delete)',
      description: 'Deleting item at position 2',
      explanation: 'Remove the item, then shift remaining items left to fill the gap.',
      elements: [
        { id: '0', value: 10 },
        { id: 'new', value: 15 },
        { id: '2', value: 30, isDeleting: true },
        { id: '3', value: 40 },
      ],
      activeIndex: 2,
      operation: 'delete',
      visualCue: '👈 Items shift left to close gap',
      benefit: 'No empty spaces left behind'
    },
    {
      title: '✅ All Operations Complete!',
      description: 'Final array state',
      explanation: 'You learned Access (find), Insert (add), and Delete (remove). You\'re ready!',
      elements: [
        { id: '0', value: 10, isHighlighted: true },
        { id: 'new', value: 15, isHighlighted: true },
        { id: '3', value: 40, isHighlighted: true },
      ],
      operation: 'complete',
      visualCue: '🎉 Arrays are powerful for ordered data',
      benefit: 'Perfect for lists, sequences, collections'
    }
  ];

  const currentAnimation = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  return (
    <div className="array-animation-page">
      {/* Header */}
      <header className="animation-header">
        <div className="header-icon">
          <Package size={40} />
        </div>
        <div className="header-content">
          <h1 className="animation-title">Arrays: Visual Guide</h1>
          <p className="animation-subtitle">Learn through interactive visual examples - No code required!</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="animation-container">
        {/* Step Info with Icon */}
        <div className="step-info">
          <div className="step-header">
            <div className="step-icon">
              {currentAnimation.operation === 'initial' && <Lock size={24} />}
              {currentAnimation.operation === 'access' && <Search size={24} />}
              {currentAnimation.operation === 'insert' && <Plus size={24} />}
              {currentAnimation.operation === 'delete' && <Trash2 size={24} />}
              {currentAnimation.operation === 'complete' && <CheckCircle size={24} />}
            </div>
            <div className="step-counter">Step {currentStep + 1} of {steps.length}</div>
          </div>
          <h2 className="step-title">{currentAnimation.title}</h2>
          <p className="step-description">{currentAnimation.description}</p>
        </div>

        {/* Real-Life Analogy (Step 1) */}
        {currentStep === 0 && (
          <div className="analogy-section">
            <div className="analogy-header">
              <Info size={20} />
              <span>Real-World Example</span>
            </div>
            <div className="lockers-visual">
              {currentAnimation.elements.map((element, index) => (
                <div key={element.id} className="locker">
                  <div className="locker-header">
                    <Lock size={14} />
                    <span>Locker #{index}</span>
                  </div>
                  <div className="locker-door">
                    <div className="locker-item">
                      <Package size={24} className="package-icon" />
                      <span className="item-value">{element.value}</span>
                    </div>
                  </div>
                  <div className="locker-label">
                    <span className="label-text">Index</span>
                    <span className="label-number">{index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Array Visualization */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="array-visualization">
            <div className="array-container">
              {currentAnimation.elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`array-box ${element.isActive ? 'active' : ''} ${
                    element.isHighlighted ? 'highlighted' : ''
                  } ${element.isNew ? 'new-element' : ''} ${
                    element.isDeleting ? 'deleting' : ''
                  }`}
                >
                  {/* Arrow Indicator */}
                  {element.isActive && (
                    <div className="arrow-indicator">
                      <div className="arrow-line"></div>
                      <div className="arrow-head">▼</div>
                    </div>
                  )}
                  
                  {/* Icon based on state */}
                  <div className="box-icon">
                    {element.isNew && <Plus size={16} />}
                    {element.isDeleting && <Trash2 size={16} />}
                    {element.isActive && !element.isNew && !element.isDeleting && <Search size={16} />}
                    {!element.isActive && !element.isNew && !element.isDeleting && <Package size={16} />}
                  </div>
                  
                  {/* Value Display */}
                  <div className="box-value">{element.value}</div>
                  
                  {/* Index Display */}
                  <div className="box-index">
                    <span className="index-label">i =</span>
                    <span className="index-value">{index}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Operation Indicator */}
            <div className={`operation-badge ${currentAnimation.operation}`}>
              <div className="badge-icon">
                {currentAnimation.operation === 'access' && <Search size={18} />}
                {currentAnimation.operation === 'insert' && <Plus size={18} />}
                {currentAnimation.operation === 'delete' && <Trash2 size={18} />}
              </div>
              <span className="badge-text">
                {currentAnimation.operation === 'access' && 'Accessing Element'}
                {currentAnimation.operation === 'insert' && 'Inserting Element'}
                {currentAnimation.operation === 'delete' && 'Deleting Element'}
              </span>
            </div>
          </div>
        )}

        {/* Completion State */}
        {currentAnimation.operation === 'complete' && (
          <div className="completion-section">
            <div className="completion-visual">
              <div className="checkmark-circle">
                <CheckCircle size={80} className="check-icon" />
              </div>
              <h3 className="completion-title">Congratulations! 🎉</h3>
              <p className="completion-text">You've mastered array operations</p>
            </div>
            <div className="final-array">
              {currentAnimation.elements.map((element, index) => (
                <div key={element.id} className="final-box">
                  <CheckCircle size={14} className="final-check" />
                  <span className="final-value">{element.value}</span>
                  <span className="final-index">[{index}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation Card */}
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
            <div className="benefit-badge">
              <Zap size={14} />
              <span>{currentAnimation.benefit}</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Legend */}
      <div className="visual-legend">
        <h3 className="legend-title">
          <Info size={18} />
          Visual Guide
        </h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-icon active-icon">
              <Search size={14} />
            </div>
            <span>Active Element</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon complete-icon">
              <CheckCircle size={14} />
            </div>
            <span>Complete</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon new-icon">
              <Plus size={14} />
            </div>
            <span>New Element</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon delete-icon">
              <Trash2 size={14} />
            </div>
            <span>Deleting</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="animation-controls">
        <button
          className="control-btn"
          onClick={handleReset}
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>

        <button
          className="control-btn"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          title="Previous"
        >
          <SkipBack size={20} />
        </button>

        <button
          className="control-btn primary"
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          className="control-btn"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          title="Next"
        >
          <SkipForward size={20} />
        </button>

        <div className="speed-control">
          <Zap size={16} />
          <input
            type="range"
            min="500"
            max="3000"
            step="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="speed-slider"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </span>
      </div>
    </div>
  );
};

export default ArrayAnimation;
