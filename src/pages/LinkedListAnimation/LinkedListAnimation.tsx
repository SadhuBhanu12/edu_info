import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, Link as LinkIcon, Plus, Trash2, CheckCircle, Info, ArrowRight } from 'lucide-react';
import './LinkedListAnimation.css';

interface ListNode {
  id: string;
  value: number;
  isActive?: boolean;
  isHighlighted?: boolean;
  isNew?: boolean;
  isDeleting?: boolean;
}

interface AnimationStep {
  title: string;
  description: string;
  explanation: string;
  nodes: ListNode[];
  operation: 'initial' | 'traverse' | 'insert' | 'delete' | 'complete';
  visualCue?: string;
  benefit?: string;
  activeIndex?: number;
}

const LinkedListAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const steps: AnimationStep[] = [
    {
      title: '🔗 What is a Linked List?',
      description: 'Think of a chain - each link connects to the next',
      explanation: 'Each node has data and a pointer to the next node. Like train cars connected together!',
      nodes: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
      ],
      operation: 'initial',
      visualCue: '💡 Nodes are connected by pointers',
      benefit: 'Dynamic size - grows and shrinks easily'
    },
    {
      title: '👣 Traversing the List',
      description: 'Moving from one node to the next',
      explanation: 'Follow the pointers! Start at HEAD, move through each node until you reach NULL.',
      nodes: [
        { id: '0', value: 10 },
        { id: '1', value: 20, isActive: true, isHighlighted: true },
        { id: '2', value: 30 },
      ],
      activeIndex: 1,
      operation: 'traverse',
      visualCue: '👉 Follow the arrow from node to node',
      benefit: 'Sequential access - one at a time'
    },
    {
      title: '➕ Inserting New Node',
      description: 'Adding value 15 between nodes',
      explanation: 'Create new node, update pointers - first point new node to next, then previous to new.',
      nodes: [
        { id: '0', value: 10 },
        { id: 'new', value: 15, isNew: true, isActive: true },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
      ],
      activeIndex: 1,
      operation: 'insert',
      visualCue: '🔄 Re-route the pointers',
      benefit: 'No shifting needed - just update links'
    },
    {
      title: '🗑️ Deleting a Node',
      description: 'Removing a node from the chain',
      explanation: 'Point the previous node to skip over the deleted node. The chain stays connected!',
      nodes: [
        { id: '0', value: 10 },
        { id: 'new', value: 15 },
        { id: '1', value: 20, isDeleting: true },
        { id: '2', value: 30 },
      ],
      activeIndex: 2,
      operation: 'delete',
      visualCue: '🔀 Bridge the connection',
      benefit: 'Efficient deletion - just change one pointer'
    },
    {
      title: '✅ All Operations Complete!',
      description: 'Final linked list state',
      explanation: 'You learned Traverse, Insert, and Delete. Linked lists are perfect for dynamic data!',
      nodes: [
        { id: '0', value: 10, isHighlighted: true },
        { id: 'new', value: 15, isHighlighted: true },
        { id: '2', value: 30, isHighlighted: true },
      ],
      operation: 'complete',
      visualCue: '🎉 Linked lists excel at insertions',
      benefit: 'Great for frequently changing data'
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
    <div className="linkedlist-animation-page">
      <header className="animation-header">
        <div className="header-icon">
          <LinkIcon size={40} />
        </div>
        <div className="header-content">
          <h1 className="animation-title">Linked List: Visual Guide</h1>
          <p className="animation-subtitle">Learn through chain connections - No code required!</p>
        </div>
      </header>

      <div className="animation-container">
        <div className="step-info">
          <div className="step-header">
            <div className="step-icon">
              {currentAnimation.operation === 'initial' && <LinkIcon size={24} />}
              {currentAnimation.operation === 'traverse' && <ArrowRight size={24} />}
              {currentAnimation.operation === 'insert' && <Plus size={24} />}
              {currentAnimation.operation === 'delete' && <Trash2 size={24} />}
              {currentAnimation.operation === 'complete' && <CheckCircle size={24} />}
            </div>
            <div className="step-counter">Step {currentStep + 1} of {steps.length}</div>
          </div>
          <h2 className="step-title">{currentAnimation.title}</h2>
          <p className="step-description">{currentAnimation.description}</p>
        </div>

        {currentStep === 0 && (
          <div className="analogy-section">
            <div className="analogy-header">
              <Info size={20} />
              <span>Real-World Example</span>
            </div>
            <div className="chain-visual">
              {currentAnimation.nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="chain-link">
                    <div className="link-body">
                      <LinkIcon size={20} className="link-icon" />
                      <span className="link-value">{node.value}</span>
                    </div>
                    <div className="link-label">Node {index}</div>
                  </div>
                  {index < currentAnimation.nodes.length - 1 && (
                    <div className="chain-connector">
                      <ArrowRight size={24} className="connector-arrow" />
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div className="null-indicator">NULL</div>
            </div>
          </div>
        )}

        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="linkedlist-visualization">
            <div className="nodes-container">
              {currentAnimation.nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className={`node-box ${node.isActive ? 'active' : ''} ${
                    node.isHighlighted ? 'highlighted' : ''
                  } ${node.isNew ? 'new-node' : ''} ${
                    node.isDeleting ? 'deleting' : ''
                  }`}>
                    {node.isActive && (
                      <div className="pointer-indicator">
                        <div className="pointer-line"></div>
                        <div className="pointer-head">▼</div>
                      </div>
                    )}
                    <div className="node-content">
                      <div className="node-data">
                        <span className="data-label">Data</span>
                        <span className="data-value">{node.value}</span>
                      </div>
                      <div className="node-next">
                        <span className="next-label">Next</span>
                        <ArrowRight size={16} className="next-arrow" />
                      </div>
                    </div>
                  </div>
                  {index < currentAnimation.nodes.length - 1 && (
                    <div className="connection-arrow">
                      <div className="arrow-line"></div>
                      <div className="arrow-tip">▶</div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div className="null-box">NULL</div>
            </div>

            <div className={`operation-badge ${currentAnimation.operation}`}>
              <div className="badge-icon">
                {currentAnimation.operation === 'traverse' && <ArrowRight size={18} />}
                {currentAnimation.operation === 'insert' && <Plus size={18} />}
                {currentAnimation.operation === 'delete' && <Trash2 size={18} />}
              </div>
              <span className="badge-text">
                {currentAnimation.operation === 'traverse' && 'Traversing List'}
                {currentAnimation.operation === 'insert' && 'Inserting Node'}
                {currentAnimation.operation === 'delete' && 'Deleting Node'}
              </span>
            </div>
          </div>
        )}

        {currentAnimation.operation === 'complete' && (
          <div className="completion-section">
            <div className="completion-visual">
              <div className="checkmark-circle">
                <CheckCircle size={80} className="check-icon" />
              </div>
              <h3 className="completion-title">Excellent Work! 🎉</h3>
              <p className="completion-text">You've mastered linked list operations</p>
            </div>
            <div className="final-list">
              {currentAnimation.nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="final-node">
                    <CheckCircle size={14} className="final-check" />
                    <span className="final-value">{node.value}</span>
                  </div>
                  {index < currentAnimation.nodes.length - 1 && (
                    <ArrowRight size={20} className="final-arrow" />
                  )}
                </React.Fragment>
              ))}
              <span className="final-null">→ NULL</span>
            </div>
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
            <div className="benefit-badge">
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
            <div className="legend-icon active-icon">
              <ArrowRight size={14} />
            </div>
            <span>Active Node</span>
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
            <span>New Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon delete-icon">
              <Trash2 size={14} />
            </div>
            <span>Deleting</span>
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
        <button className="control-btn primary" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
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
          <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="progress-text">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>
    </div>
  );
};

export default LinkedListAnimation;
