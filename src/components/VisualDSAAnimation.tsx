import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Lightbulb, Volume2, VolumeX, ArrowDown } from 'lucide-react';
import './VisualDSAAnimation.css';

// ============================================
// VISUAL ANIMATION DATA STRUCTURE (GfG Style)
// Pure visual diagrams, no code!
// ============================================

export interface AnimationElement {
  id: string;
  value: number | string;
  isHighlighted?: boolean;
  isComparing?: boolean;
  isSwapping?: boolean;
  isCompleted?: boolean;
  isSorted?: boolean;
  position?: { x: number; y: number };
  label?: string;
}

export interface VisualAnnotation {
  type: 'arrow' | 'label' | 'box' | 'line';
  text?: string;
  from?: number; // element index
  to?: number; // element index
  position?: { x: number; y: number };
  color?: string;
}

export interface AnimationStepData {
  elements: AnimationElement[];
  description: string;
  explanation: string;
  visualNote?: string;
  annotations?: VisualAnnotation[];
  pointers?: Record<string, number>; // e.g., { left: 0, right: 5, mid: 2 }
}

export interface VisualAnimationConfig {
  title: string;
  algorithm: string;
  description: string;
  steps: AnimationStepData[];
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keyPoints?: string[]; // Key learning points
}

// ============================================
// ANIMATED ELEMENT COMPONENT
// ============================================

interface AnimatedBarProps {
  element: AnimationElement;
  maxValue: number;
  index: number;
  type: 'bar' | 'box';
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ element, maxValue, index, type }) => {
  const value = typeof element.value === 'number' ? element.value : 0;
  const heightPercent = type === 'bar' ? (value / maxValue) * 100 : 100;

  let className = 'animated-element';
  if (element.isHighlighted) className += ' highlighted';
  if (element.isComparing) className += ' comparing';
  if (element.isSwapping) className += ' swapping';
  if (element.isCompleted) className += ' completed';

  return (
    <div className="element-container">
      {type === 'bar' ? (
        <>
          <div 
            className={className}
            style={{ 
              height: `${heightPercent}%`,
              animationDelay: `${index * 0.05}s`
            }}
          >
            <span className="element-value">{element.value}</span>
          </div>
          <span className="element-index">{index}</span>
        </>
      ) : (
        <>
          <div className={className}>
            <span className="element-value-large">{element.value}</span>
          </div>
          <span className="element-index">{index}</span>
        </>
      )}
    </div>
  );
};

// ============================================
// VISUAL POINTERS COMPONENT (Like GfG)
// Shows pointers like "left", "right", "mid"
// ============================================

interface VisualPointersProps {
  pointers?: Record<string, number>;
  elementCount: number;
}

const VisualPointers: React.FC<VisualPointersProps> = ({ pointers, elementCount }) => {
  if (!pointers || Object.keys(pointers).length === 0) return null;

  return (
    <div className="visual-pointers">
      {Object.entries(pointers).map(([name, index]) => (
        <div
          key={name}
          className="pointer"
          style={{ 
            left: `${(index / elementCount) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="pointer-arrow">↓</div>
          <div className="pointer-label">{name}</div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// VARIABLES DISPLAY COMPONENT
// KEY POINTS PANEL (Educational Notes)
// ============================================

interface KeyPointsProps {
  points?: string[];
}

const KeyPoints: React.FC<KeyPointsProps> = ({ points }) => {
  if (!points || points.length === 0) return null;

  return (
    <div className="key-points-panel">
      <div className="key-points-header">
        <Lightbulb size={16} />
        <span>Key Points</span>
      </div>
      <div className="key-points-content">
        {points.map((point, index) => (
          <div key={index} className="key-point-item">
            <span className="point-number">{index + 1}</span>
            <span className="point-text">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN VISUAL ANIMATION COMPONENT
// ============================================

interface VisualDSAAnimationProps {
  config: VisualAnimationConfig;
}

const VisualDSAAnimation: React.FC<VisualDSAAnimationProps> = ({ config }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState(1500); // milliseconds per step (slower for visual learning)
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [visualType, setVisualType] = useState<'bar' | 'box'>('box'); // Box is better for step-by-step

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = config.steps[currentStepIndex];
  const maxValue = Math.max(...config.steps[0].elements.map(e => 
    typeof e.value === 'number' ? e.value : 0
  ));

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < config.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isPlaying, currentStepIndex, speed, config.steps.length]);

  // Voice narration
  useEffect(() => {
    if (voiceEnabled && currentStep && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.explanation);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, voiceEnabled, currentStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < config.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const progressPercent = ((currentStepIndex + 1) / config.steps.length) * 100;

  return (
    <div className="visual-dsa-animation">
      {/* Header */}
      <div className="animation-header">
        <div className="header-left">
          <h2 className="animation-title">{config.title}</h2>
          <span className={`difficulty-badge difficulty-${config.difficulty.toLowerCase()}`}>
            {config.difficulty}
          </span>
        </div>
        <div className="header-right">
          <div className="complexity-info">
            <div className="complexity-item">
              <span className="complexity-label">Time:</span>
              <span className="complexity-value">{config.timeComplexity}</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">Space:</span>
              <span className="complexity-value">{config.spaceComplexity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="animation-description">
        <Lightbulb size={18} />
        <p>{config.description}</p>
      </div>

      {/* Main Content Area */}
      <div className="animation-content">
        {/* Visualization Area */}
        <div className="visualization-area">
          <div className="visualization-header">
            <span>Step {currentStepIndex + 1} of {config.steps.length}</span>
            <div className="view-toggle">
              <button
                className={visualType === 'bar' ? 'active' : ''}
                onClick={() => setVisualType('bar')}
              >
                Bar Chart
              </button>
              <button
                className={visualType === 'box' ? 'active' : ''}
                onClick={() => setVisualType('box')}
              >
                Boxes
              </button>
            </div>
          </div>

          <div className="visualization-canvas">
            {/* Visual Pointers (like GfG) */}
            <VisualPointers 
              pointers={currentStep.pointers}
              elementCount={currentStep.elements.length}
            />

            {/* Elements Display */}
            <div className="elements-container">
              {currentStep.elements.map((element, index) => (
                <AnimatedBar
                  key={element.id}
                  element={element}
                  maxValue={maxValue}
                  index={index}
                  type={visualType}
                />
              ))}
            </div>

            {/* Visual Note (appears below elements) */}
            {currentStep.visualNote && (
              <div className="visual-note">
                <ArrowDown size={20} className="note-icon" />
                <span>{currentStep.visualNote}</span>
              </div>
            )}
          </div>

          {/* Step Explanation (Larger, more prominent) */}
          <div className="step-explanation">
            <div className="step-number">Step {currentStepIndex + 1}</div>
            <div className="explanation-title">{currentStep.description}</div>
            <div className="explanation-text">{currentStep.explanation}</div>
          </div>
        </div>

        {/* Side Panel: Key Points + Complexity */}
        <div className="side-panel">
          <KeyPoints points={config.keyPoints} />
          
          {/* Complexity Info */}
          <div className="complexity-panel">
            <div className="complexity-panel-header">
              <span>⏱️ Complexity</span>
            </div>
            <div className="complexity-items">
              <div className="complexity-row">
                <span className="complexity-type">Time:</span>
                <span className="complexity-val">{config.timeComplexity}</span>
              </div>
              <div className="complexity-row">
                <span className="complexity-type">Space:</span>
                <span className="complexity-val">{config.spaceComplexity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="progress-text">
          {Math.round(progressPercent)}% Complete
        </span>
      </div>

      {/* Controls */}
      <div className="animation-controls">
        <div className="control-buttons">
          <button 
            className="control-btn secondary"
            onClick={handleReset}
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            className="control-btn secondary"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            title="Previous Step"
          >
            <SkipBack size={20} />
          </button>

          <button 
            className="control-btn primary large"
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button 
            className="control-btn secondary"
            onClick={handleNext}
            disabled={currentStepIndex === config.steps.length - 1}
            title="Next Step"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <button
          className={`control-btn toggle ${voiceEnabled ? 'active' : ''}`}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          title="Toggle Voice"
        >
          {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </div>
  );
};

export default VisualDSAAnimation;
