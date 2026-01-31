import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, GitBranch, CheckCircle, Info } from 'lucide-react';
import '../ArrayAnimation/ArrayAnimation.css';
import './BinaryTreeAnimation.css';

interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  isActive?: boolean;
  isHighlighted?: boolean;
  level: number;
  position: 'root' | 'left' | 'right';
}

interface AnimationStep {
  title: string;
  description: string;
  explanation: string;
  tree: TreeNode;
  operation: 'initial' | 'traverse' | 'search' | 'complete';
  visualCue?: string;
  benefit?: string;
}

const BinaryTreeAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500);

  const steps: AnimationStep[] = [
    {
      title: '🌳 What is a Binary Tree?',
      description: 'Think of a family tree - parent with two children',
      explanation: 'Each node has at most 2 children: left and right. Perfect for hierarchical data!',
      tree: {
        id: 'root',
        value: 50,
        level: 0,
        position: 'root',
        left: {
          id: 'left',
          value: 30,
          level: 1,
          position: 'left',
          left: { id: 'll', value: 20, level: 2, position: 'left' },
          right: { id: 'lr', value: 40, level: 2, position: 'right' }
        },
        right: {
          id: 'right',
          value: 70,
          level: 1,
          position: 'right',
          left: { id: 'rl', value: 60, level: 2, position: 'left' },
          right: { id: 'rr', value: 80, level: 2, position: 'right' }
        }
      },
      operation: 'initial',
      visualCue: '💡 Hierarchical structure',
      benefit: 'Fast search, insert, delete - O(log n)'
    },
    {
      title: '🔍 Searching in Tree',
      description: 'Looking for value 60',
      explanation: 'Start at root. Go left if smaller, right if larger. Like binary search!',
      tree: {
        id: 'root',
        value: 50,
        level: 0,
        position: 'root',
        left: {
          id: 'left',
          value: 30,
          level: 1,
          position: 'left',
          left: { id: 'll', value: 20, level: 2, position: 'left' },
          right: { id: 'lr', value: 40, level: 2, position: 'right' }
        },
        right: {
          id: 'right',
          value: 70,
          level: 1,
          position: 'right',
          isActive: true,
          left: { id: 'rl', value: 60, level: 2, position: 'left', isActive: true, isHighlighted: true },
          right: { id: 'rr', value: 80, level: 2, position: 'right' }
        }
      },
      operation: 'search',
      visualCue: '🎯 Smart navigation - skip half each time',
      benefit: 'Logarithmic time - very fast!'
    },
    {
      title: '✅ Binary Tree Complete!',
      description: 'Tree traversal mastered',
      explanation: 'Trees are perfect for hierarchical data, databases, file systems, and more!',
      tree: {
        id: 'root',
        value: 50,
        level: 0,
        position: 'root',
        isHighlighted: true,
        left: {
          id: 'left',
          value: 30,
          level: 1,
          position: 'left',
          isHighlighted: true,
          left: { id: 'll', value: 20, level: 2, position: 'left', isHighlighted: true },
          right: { id: 'lr', value: 40, level: 2, position: 'right', isHighlighted: true }
        },
        right: {
          id: 'right',
          value: 70,
          level: 1,
          position: 'right',
          isHighlighted: true,
          left: { id: 'rl', value: 60, level: 2, position: 'left', isHighlighted: true },
          right: { id: 'rr', value: 80, level: 2, position: 'right', isHighlighted: true }
        }
      },
      operation: 'complete',
      visualCue: '🎉 Trees power many algorithms',
      benefit: 'Used in databases, compilers, AI'
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

  const renderNode = (node: TreeNode | undefined, isRoot: boolean = false): React.ReactElement | null => {
    if (!node) return null;

    return (
      <div className="tree-node-wrapper">
        <div className={`tree-node ${node.isActive ? 'active' : ''} ${
          node.isHighlighted ? 'highlighted' : ''
        } ${isRoot ? 'root-node' : ''}`}>
          <div className="node-value">{node.value}</div>
          <div className="node-type">{isRoot ? 'ROOT' : node.position.toUpperCase()}</div>
        </div>
        {(node.left || node.right) && (
          <div className="tree-children">
            <div className="tree-branch left-branch">
              {renderNode(node.left)}
            </div>
            <div className="tree-branch right-branch">
              {renderNode(node.right)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="binarytree-animation-page">
      <header className="animation-header">
        <div className="header-icon">
          <GitBranch size={40} />
        </div>
        <div className="header-content">
          <h1 className="animation-title">Binary Tree: Visual Guide</h1>
          <p className="animation-subtitle">Learn hierarchical structures - No code required!</p>
        </div>
      </header>

      <div className="animation-container">
        <div className="step-info">
          <div className="step-header">
            <div className="step-icon tree-icon">
              {currentAnimation.operation === 'complete' ? <CheckCircle size={24} /> : <GitBranch size={24} />}
            </div>
            <div className="step-counter">Step {currentStep + 1} of {steps.length}</div>
          </div>
          <h2 className="step-title">{currentAnimation.title}</h2>
          <p className="step-description">{currentAnimation.description}</p>
        </div>

        <div className="tree-visualization">
          {renderNode(currentAnimation.tree, true)}
        </div>

        {currentAnimation.operation === 'complete' && (
          <div className="completion-visual">
            <div className="checkmark-circle">
              <CheckCircle size={80} className="check-icon" />
            </div>
            <h3 className="completion-title">Brilliant! 🎉</h3>
            <p className="completion-text">You've mastered binary tree concepts</p>
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
            <div className="benefit-badge tree-badge">
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
            <div className="legend-icon tree-root-icon">
              <GitBranch size={14} />
            </div>
            <span>Root Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon tree-active-icon">
              <GitBranch size={14} />
            </div>
            <span>Active Path</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon tree-found-icon">
              <CheckCircle size={14} />
            </div>
            <span>Found/Complete</span>
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
        <button className="control-btn primary tree-primary" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
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
          <div className="progress-fill tree-progress" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="progress-text">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>
    </div>
  );
};

export default BinaryTreeAnimation;
