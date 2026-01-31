import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, BookOpen, Code, Lightbulb, AlertCircle, CheckCircle, Edit3, Zap } from 'lucide-react';
import type { InteractiveAnimationConfig } from '../types';
import './InteractiveDSAAnimation.css';

interface InteractiveDSAAnimationProps {
  config: InteractiveAnimationConfig;
  onComplete?: () => void;
  onProgress?: (stepIndex: number) => void;
}

export const InteractiveDSAAnimation: React.FC<InteractiveDSAAnimationProps> = ({
  config,
  onComplete,
  onProgress
}) => {
  // State Management
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(config.codeLanguages[0]?.language || 'javascript');
  const [showCode, setShowCode] = useState(true);
  const [showVariables, setShowVariables] = useState(true);
  const [showAnalogy, setShowAnalogy] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [showComplexity, setShowComplexity] = useState(false);
  const [customInputMode, setCustomInputMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [difficultyMode] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [aiExplanationExpanded, setAiExplanationExpanded] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = config.steps[currentStepIndex];
  const currentCode = config.codeLanguages.find(c => c.language === selectedLanguage);
  const currentQuiz = config.predictNextStepQuiz?.find(q => q.stepId === currentStep?.id);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStepIndex < config.steps.length) {
      const duration = (currentStep.duration || 2000) / playbackSpeed;
      
      animationTimerRef.current = setTimeout(() => {
        if (currentStepIndex < config.steps.length - 1) {
          handleNextStep();
        } else {
          setIsPlaying(false);
          onComplete?.();
        }
      }, duration);

      return () => {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
      };
    }
  }, [isPlaying, currentStepIndex, playbackSpeed, currentStep]);

  // Voice narration
  useEffect(() => {
    if (voiceEnabled && currentStep?.voiceNarration && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentStep.voiceNarration);
      utterance.rate = playbackSpeed;
      speechSynthRef.current = utterance;
      
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, voiceEnabled, currentStep, playbackSpeed]);

  // Progress tracking
  useEffect(() => {
    onProgress?.(currentStepIndex);
  }, [currentStepIndex, onProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousStep();
          break;
        case 'r':
          e.preventDefault();
          handleReset();
          break;
        case 'c':
          e.preventDefault();
          setShowCode(prev => !prev);
          break;
        case 'v':
          e.preventDefault();
          setShowVariables(prev => !prev);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStepIndex]);

  // Control Handlers
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < config.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowQuizResult(false);
      setQuizAnswer(null);
    }
  }, [currentStepIndex, config.steps.length]);

  const handlePreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setShowQuizResult(false);
      setQuizAnswer(null);
    }
  }, [currentStepIndex]);

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setShowQuizResult(false);
    setQuizAnswer(null);
  }, []);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      setShowQuizResult(true);
    }
  };

  const handleTestCaseChange = (index: number) => {
    setSelectedTestCase(index);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleCustomInputSubmit = () => {
    // In real implementation, this would generate new animation steps
    // For now, just switch back to normal mode
    setCustomInputMode(false);
  };

  // Get highlighted line number for current step
  const getHighlightedLineNumber = (): number | undefined => {
    if (!currentCode) return undefined;
    return currentStep.highlightedLine;
  };

  // Render code with line highlighting
  const renderCode = () => {
    if (!currentCode || !showCode) return null;

    const lines = currentCode.code.split('\n');
    const highlightedLine = getHighlightedLineNumber();

    return (
      <div className="ida-code-panel">
        <div className="ida-code-header">
          <div className="ida-code-title">
            <Code size={18} />
            <span>Code</span>
          </div>
          <div className="ida-language-selector">
            {config.codeLanguages.map(lang => (
              <button
                key={lang.language}
                className={`ida-lang-btn ${selectedLanguage === lang.language ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang.language)}
              >
                {lang.language.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="ida-code-content">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`ida-code-line ${highlightedLine === index + 1 ? 'highlighted' : ''}`}
            >
              <span className="ida-line-number">{index + 1}</span>
              <span className="ida-line-text">{line}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render live variables
  const renderVariables = () => {
    if (!showVariables || !currentStep.variables) return null;

    return (
      <div className="ida-variables-panel">
        <div className="ida-variables-header">
          <Zap size={18} />
          <span>Live Variables</span>
        </div>
        <div className="ida-variables-content">
          {Object.entries(currentStep.variables).map(([key, value]) => (
            <div key={key} className="ida-variable-item">
              <span className="ida-var-name">{key}</span>
              <span className="ida-var-equals">=</span>
              <span className="ida-var-value">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render real-life analogy
  const renderAnalogy = () => {
    if (!showAnalogy) return null;

    return (
      <div className="ida-analogy-modal">
        <div className="ida-analogy-content">
          <button className="ida-close-btn" onClick={() => setShowAnalogy(false)}>×</button>
          <h2>{config.realLifeAnalogy.title}</h2>
          <p className="ida-analogy-description">{config.realLifeAnalogy.description}</p>
          
          <div className="ida-analogy-mappings">
            {config.realLifeAnalogy.mapping.map((map, index) => (
              <div key={index} className="ida-mapping-item">
                <div className="ida-mapping-concept">
                  <strong>Concept:</strong> {map.concept}
                </div>
                <div className="ida-mapping-arrow">→</div>
                <div className="ida-mapping-real">
                  <strong>Real Life:</strong> {map.realLife}
                </div>
                <p className="ida-mapping-explanation">{map.explanation}</p>
              </div>
            ))}
          </div>

          <div className="ida-analogy-examples">
            <h3>Examples:</h3>
            <ul>
              {config.realLifeAnalogy.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Render common mistakes
  const renderMistakes = () => {
    if (!showMistakes) return null;

    return (
      <div className="ida-mistakes-modal">
        <div className="ida-mistakes-content">
          <button className="ida-close-btn" onClick={() => setShowMistakes(false)}>×</button>
          <h2>Common Mistakes</h2>
          
          {config.commonMistakes.map((mistake) => (
            <div key={mistake.id} className="ida-mistake-item">
              <div className="ida-mistake-header">
                <AlertCircle size={20} color="#f87171" />
                <h3>{mistake.title}</h3>
              </div>
              <p className="ida-mistake-description">{mistake.description}</p>
              
              {mistake.wrongCode && (
                <div className="ida-mistake-code wrong">
                  <div className="ida-code-label">❌ Wrong:</div>
                  <pre>{mistake.wrongCode}</pre>
                </div>
              )}
              
              {mistake.correctCode && (
                <div className="ida-mistake-code correct">
                  <div className="ida-code-label">✅ Correct:</div>
                  <pre>{mistake.correctCode}</pre>
                </div>
              )}
              
              <div className="ida-mistake-explanation">
                <strong>Explanation:</strong>
                <p>{mistake.explanation}</p>
              </div>
              
              <div className="ida-mistake-avoid">
                <strong>How to Avoid:</strong>
                <p>{mistake.howToAvoid}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render complexity visualization
  const renderComplexity = () => {
    if (!showComplexity) return null;

    const maxOps = Math.max(...config.complexityData.visualData.operations);

    return (
      <div className="ida-complexity-modal">
        <div className="ida-complexity-content">
          <button className="ida-close-btn" onClick={() => setShowComplexity(false)}>×</button>
          <h2>Time Complexity: {config.complexityData.notation}</h2>
          <p className="ida-complexity-description">{config.complexityData.description}</p>
          
          <div className="ida-complexity-chart">
            {config.complexityData.visualData.inputSize.map((size, index) => {
              const ops = config.complexityData.visualData.operations[index];
              const height = (ops / maxOps) * 100;
              
              return (
                <div key={index} className="ida-complexity-bar-container">
                  <div 
                    className="ida-complexity-bar"
                    style={{ height: `${height}%` }}
                  >
                    <span className="ida-complexity-value">{ops}</span>
                  </div>
                  <span className="ida-complexity-label">n={size}</span>
                </div>
              );
            })}
          </div>

          <div className="ida-complexity-cases">
            {config.complexityData.bestCase && (
              <div className="ida-complexity-case">
                <strong>Best Case:</strong> {config.complexityData.bestCase}
              </div>
            )}
            {config.complexityData.averageCase && (
              <div className="ida-complexity-case">
                <strong>Average Case:</strong> {config.complexityData.averageCase}
              </div>
            )}
            {config.complexityData.worstCase && (
              <div className="ida-complexity-case">
                <strong>Worst Case:</strong> {config.complexityData.worstCase}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render quiz
  const renderQuiz = () => {
    if (!currentQuiz || !quizMode) return null;

    return (
      <div className="ida-quiz-panel">
        <div className="ida-quiz-header">
          <Lightbulb size={18} />
          <span>Predict Next Step</span>
        </div>
        <div className="ida-quiz-content">
          <p className="ida-quiz-question">{currentQuiz.question}</p>
          
          <div className="ida-quiz-options">
            {currentQuiz.options.map((option, index) => (
              <button
                key={index}
                className={`ida-quiz-option ${quizAnswer === index ? 'selected' : ''} ${
                  showQuizResult ? (index === currentQuiz.correctAnswer ? 'correct' : quizAnswer === index ? 'wrong' : '') : ''
                }`}
                onClick={() => setQuizAnswer(index)}
                disabled={showQuizResult}
              >
                {option}
              </button>
            ))}
          </div>

          {!showQuizResult && (
            <button 
              className="ida-quiz-submit"
              onClick={handleQuizSubmit}
              disabled={quizAnswer === null}
            >
              Submit Answer
            </button>
          )}

          {showQuizResult && (
            <div className={`ida-quiz-result ${quizAnswer === currentQuiz.correctAnswer ? 'correct' : 'wrong'}`}>
              <div className="ida-quiz-result-icon">
                {quizAnswer === currentQuiz.correctAnswer ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              </div>
              <p className="ida-quiz-result-text">
                {quizAnswer === currentQuiz.correctAnswer ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="ida-quiz-explanation">{currentQuiz.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className={`interactive-dsa-animation ${isFullscreen ? 'fullscreen' : ''} ${difficultyMode}`}
    >
      {/* Header with Title and Controls */}
      <div className="ida-header">
        <div className="ida-title-section">
          <h2>{config.title}</h2>
          <span className={`ida-difficulty ${config.difficulty.toLowerCase()}`}>
            {config.difficulty}
          </span>
        </div>
        
        <div className="ida-header-actions">
          <button 
            className={`ida-action-btn ${showAnalogy ? 'active' : ''}`}
            onClick={() => setShowAnalogy(true)}
            title="Real-Life Analogy"
          >
            <BookOpen size={20} />
          </button>
          <button 
            className={`ida-action-btn ${showMistakes ? 'active' : ''}`}
            onClick={() => setShowMistakes(true)}
            title="Common Mistakes"
          >
            <AlertCircle size={20} />
          </button>
          <button 
            className={`ida-action-btn ${showComplexity ? 'active' : ''}`}
            onClick={() => setShowComplexity(true)}
            title="Complexity Analysis"
          >
            📊
          </button>
          <button 
            className={`ida-action-btn ${voiceEnabled ? 'active' : ''}`}
            onClick={() => setVoiceEnabled(prev => !prev)}
            title="Voice Narration"
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            className="ida-action-btn"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Visual Legend */}
      {showLegend && (
        <div className="ida-legend">
          {config.visualLegend.map((item, index) => (
            <div key={index} className="ida-legend-item">
              <div 
                className="ida-legend-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="ida-legend-label">{item.label}</span>
            </div>
          ))}
          <button 
            className="ida-legend-close"
            onClick={() => setShowLegend(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="ida-main-content">
        {/* Left Panel: Visualization */}
        <div className="ida-visualization-panel">
          {/* Step Description */}
          <div className="ida-step-description">
            <h3>Step {currentStepIndex + 1} of {config.steps.length}</h3>
            <p>{currentStep.description}</p>
            {currentStep.microExplanation && (
              <div className="ida-micro-explanation">
                💡 {currentStep.microExplanation}
              </div>
            )}
          </div>

          {/* Visual Animation Area */}
          <div className="ida-visual-area">
            {currentStep.visualContent ? (
              <div 
                className="ida-visual-content"
                dangerouslySetInnerHTML={{ __html: currentStep.visualContent }}
              />
            ) : (
              <div className="ida-visual-placeholder">
                Visual animation will appear here
              </div>
            )}
          </div>

          {/* AI Explanation (Expandable) */}
          {currentStep.aiExplanation && (
            <div className={`ida-ai-explanation ${aiExplanationExpanded ? 'expanded' : ''}`}>
              <button 
                className="ida-ai-toggle"
                onClick={() => setAiExplanationExpanded(prev => !prev)}
              >
                <Lightbulb size={16} />
                <span>AI Detailed Explanation</span>
                <span className="ida-ai-arrow">{aiExplanationExpanded ? '▼' : '▶'}</span>
              </button>
              {aiExplanationExpanded && (
                <div className="ida-ai-content">
                  {currentStep.aiExplanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Code & Variables */}
        <div className="ida-side-panel">
          {renderCode()}
          {renderVariables()}
          {renderQuiz()}
          
          {/* Concept Reinforcement */}
          <div className="ida-concept-panel">
            <h4>Key Concepts</h4>
            <div className="ida-concept-section">
              <strong>When to use:</strong>
              <ul>
                {config.whenToUse.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="ida-concept-section">
              <strong>Interview Tips:</strong>
              <ul>
                {config.interviewUseCases.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="ida-controls">
        <div className="ida-playback-controls">
          <button 
            className="ida-control-btn"
            onClick={handleReset}
            title="Reset (R)"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            className="ida-control-btn"
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            title="Previous (←)"
          >
            <SkipBack size={20} />
          </button>
          <button 
            className="ida-control-btn primary"
            onClick={handlePlayPause}
            title="Play/Pause (Space)"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button 
            className="ida-control-btn"
            onClick={handleNextStep}
            disabled={currentStepIndex === config.steps.length - 1}
            title="Next (→)"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="ida-progress-bar">
          <div 
            className="ida-progress-fill"
            style={{ width: `${((currentStepIndex + 1) / config.steps.length) * 100}%` }}
          />
        </div>

        <div className="ida-speed-controls">
          <span>Speed:</span>
          {[0.5, 1, 1.5, 2].map(speed => (
            <button
              key={speed}
              className={`ida-speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
              onClick={() => handleSpeedChange(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>

        <div className="ida-view-toggles">
          <button
            className={`ida-toggle-btn ${showCode ? 'active' : ''}`}
            onClick={() => setShowCode(prev => !prev)}
            title="Toggle Code (C)"
          >
            <Code size={18} />
          </button>
          <button
            className={`ida-toggle-btn ${showVariables ? 'active' : ''}`}
            onClick={() => setShowVariables(prev => !prev)}
            title="Toggle Variables (V)"
          >
            <Zap size={18} />
          </button>
          <button
            className={`ida-toggle-btn ${quizMode ? 'active' : ''}`}
            onClick={() => setQuizMode(prev => !prev)}
            title="Quiz Mode"
          >
            <Lightbulb size={18} />
          </button>
        </div>
      </div>

      {/* Test Case Selector */}
      {config.allowCustomInput && (
        <div className="ida-test-cases">
          <div className="ida-test-case-tabs">
            {config.testCases.map((testCase, index) => (
              <button
                key={index}
                className={`ida-test-tab ${selectedTestCase === index ? 'active' : ''}`}
                onClick={() => handleTestCaseChange(index)}
              >
                {testCase.case === 'custom' ? 'Custom' : `${testCase.case} Case`}
              </button>
            ))}
            <button
              className={`ida-test-tab ${customInputMode ? 'active' : ''}`}
              onClick={() => setCustomInputMode(true)}
            >
              <Edit3 size={14} /> Custom Input
            </button>
          </div>
          
          {customInputMode && (
            <div className="ida-custom-input">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter your input (e.g., [5, 2, 8, 1])"
              />
              <button onClick={handleCustomInputSubmit}>Generate Animation</button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {renderAnalogy()}
      {renderMistakes()}
      {renderComplexity()}
    </div>
  );
};
