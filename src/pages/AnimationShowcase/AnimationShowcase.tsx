import React, { useState } from 'react';
import VisualDSAAnimation from '../../components/VisualDSAAnimation';
import { bubbleSortAnimation, binarySearchAnimation, linearSearchAnimation } from '../../data/easyAnimations';
import './AnimationShowcase.css';

const AnimationShowcase: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<'bubble' | 'binary' | 'linear'>('bubble');

  const animations = {
    bubble: bubbleSortAnimation,
    binary: binarySearchAnimation,
    linear: linearSearchAnimation
  };

  return (
    <div className="animation-showcase">
      <div className="showcase-header">
        <h1 className="showcase-title">
          🎬 Interactive DSA Animations
        </h1>
        <p className="showcase-subtitle">
          Learn algorithms visually with step-by-step animations
        </p>
      </div>

      {/* Animation Selector */}
      <div className="animation-selector">
        <button
          className={`selector-btn ${selectedAnimation === 'bubble' ? 'active' : ''}`}
          onClick={() => setSelectedAnimation('bubble')}
        >
          <div className="btn-icon">🫧</div>
          <div className="btn-content">
            <div className="btn-title">Bubble Sort</div>
            <div className="btn-meta">Sorting • O(n²)</div>
          </div>
        </button>

        <button
          className={`selector-btn ${selectedAnimation === 'binary' ? 'active' : ''}`}
          onClick={() => setSelectedAnimation('binary')}
        >
          <div className="btn-icon">🔍</div>
          <div className="btn-content">
            <div className="btn-title">Binary Search</div>
            <div className="btn-meta">Searching • O(log n)</div>
          </div>
        </button>

        <button
          className={`selector-btn ${selectedAnimation === 'linear' ? 'active' : ''}`}
          onClick={() => setSelectedAnimation('linear')}
        >
          <div className="btn-icon">➡️</div>
          <div className="btn-content">
            <div className="btn-title">Linear Search</div>
            <div className="btn-meta">Searching • O(n)</div>
          </div>
        </button>
      </div>

      {/* Animation Display */}
      <div className="animation-display">
        <VisualDSAAnimation 
          key={selectedAnimation}
          config={animations[selectedAnimation]} 
        />
      </div>

      {/* Features Highlight */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Beautiful Design</h3>
          <p>High contrast colors and smooth animations make learning enjoyable</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👁️</div>
          <h3>Easy to Understand</h3>
          <p>Clear visual representations with step-by-step explanations</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Interactive Controls</h3>
          <p>Play, pause, step through, and control speed at your pace</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💻</div>
          <h3>Code Sync</h3>
          <p>See code highlighted in real-time as the animation plays</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Live Variables</h3>
          <p>Watch variables update as the algorithm executes</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔊</div>
          <h3>Voice Narration</h3>
          <p>Optional audio explanations for each step</p>
        </div>
      </div>
    </div>
  );
};

export default AnimationShowcase;
