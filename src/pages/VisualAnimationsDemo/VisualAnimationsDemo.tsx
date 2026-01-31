import React, { useState } from 'react';
import VisualDSAAnimation from '../../components/VisualDSAAnimation';
import { bubbleSortAnimation, binarySearchAnimation, linearSearchAnimation } from '../../data/easyAnimations';
import { selectionSortAnimation, insertionSortAnimation } from '../../data/mediumAnimations';
import { stackAnimation, queueAnimation } from '../../data/dataStructureAnimations';
import './VisualAnimationsDemo.css';

const VisualAnimationsDemo: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(bubbleSortAnimation);

  const animations = [
    { name: 'Bubble Sort', config: bubbleSortAnimation, category: 'Sorting' },
    { name: 'Selection Sort', config: selectionSortAnimation, category: 'Sorting' },
    { name: 'Insertion Sort', config: insertionSortAnimation, category: 'Sorting' },
    { name: 'Binary Search', config: binarySearchAnimation, category: 'Searching' },
    { name: 'Linear Search', config: linearSearchAnimation, category: 'Searching' },
    { name: 'Stack (LIFO)', config: stackAnimation, category: 'Data Structures' },
    { name: 'Queue (FIFO)', config: queueAnimation, category: 'Data Structures' },
  ];

  const categories = ['All', 'Sorting', 'Searching', 'Data Structures'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredAnimations = activeCategory === 'All' 
    ? animations 
    : animations.filter(a => a.category === activeCategory);

  return (
    <div className="visual-animations-demo">
      <header className="demo-header">
        <h1>🎨 Visual DSA Animations</h1>
        <p>Step-by-step visual explanations • No code display • GeeksforGeeks style</p>
      </header>

      <div className="demo-content">
        {/* Sidebar */}
        <aside className="demo-sidebar">
          <h3>Categories</h3>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3>Animations</h3>
          <div className="animation-list">
            {filteredAnimations.map((anim, idx) => (
              <button
                key={idx}
                className={`animation-btn ${selectedAnimation === anim.config ? 'active' : ''}`}
                onClick={() => setSelectedAnimation(anim.config)}
              >
                <span className="anim-icon">
                  {anim.category === 'Sorting' && '↕️'}
                  {anim.category === 'Searching' && '🔍'}
                  {anim.category === 'Data Structures' && '📚'}
                </span>
                <div>
                  <div className="anim-name">{anim.name}</div>
                  <div className="anim-complexity">{anim.config.timeComplexity}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Animation Player */}
        <main className="demo-main">
          <VisualDSAAnimation config={selectedAnimation} />
        </main>
      </div>

      <footer className="demo-footer">
        <div className="feature-badges">
          <span className="badge">🎯 Visual Pointers</span>
          <span className="badge">📝 Step Notes</span>
          <span className="badge">💡 Key Points</span>
          <span className="badge">⏱️ Complexity Info</span>
          <span className="badge">🔊 Voice Narration</span>
        </div>
      </footer>
    </div>
  );
};

export default VisualAnimationsDemo;
