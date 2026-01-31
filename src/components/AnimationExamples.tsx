import React from 'react';
import AnimationPlayer from './AnimationPlayer';
import type { AnimationStep } from '../types';
import { learningModules } from '../data/learningModules';

// Example: Professional Array Operations Animations
const arrayAnimations: AnimationStep[] = [
  {
    id: 'array-init',
    description: '🔵 Step 1: Initialize array [10, 20, 30, 40, 50]',
    code: 'int[] arr = {10, 20, 30, 40, 50};',
    duration: 1200,
    transitionType: 'fade',
    explanation: 'Creating an array allocates contiguous memory blocks. Each element occupies a fixed address, enabling O(1) direct access.',
    visualContent: `<svg viewBox="0 0 700 200"><!-- Professional SVG --></svg>`
  },
  {
    id: 'array-access',
    description: '🔍 Step 2: Access element at index 2 - O(1) operation',
    code: 'int value = arr[2]; // value = 30',
    duration: 1000,
    transitionType: 'scale',
    explanation: 'Array access is O(1) because we calculate the exact memory address: base_address + (index × element_size).',
    visualContent: `<svg viewBox="0 0 700 220"><!-- Glow effect on accessed element --></svg>`
  }
];

// Example Usage in Theory Page Component
export const ArrayTheoryPage: React.FC = () => {
  return (
    <div className="theory-page">
      <header>
        <h1>Arrays - Foundation of Data Structures</h1>
        <p>Master array operations with interactive visualizations</p>
      </header>

      <section className="concept-overview">
        <h2>Concept Overview</h2>
        <p>
          Arrays are the foundation of data structures - sequential collections 
          stored in contiguous memory. Essential for 40% of interview problems.
        </p>
      </section>

      {/* Professional Animation Player */}
      <section className="interactive-animations">
        <h2>🎬 Interactive Visualizations</h2>
        <AnimationPlayer 
          steps={arrayAnimations}
          title="Array Operations - Step by Step"
        />
      </section>

      <section className="detailed-theory">
        <h2>In-Depth Explanation</h2>
        {/* Theory content */}
      </section>
    </div>
  );
};

// Example: Linked List Professional Animations
const linkedListAnimations: AnimationStep[] = [
  {
    id: 'll-init',
    description: '🔗 Step 1: Create linked list: 1 → 2 → 3 → null',
    code: `Node head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);`,
    duration: 1500,
    transitionType: 'slide',
    explanation: 'Linked lists store nodes anywhere in memory, connected by pointers. Unlike arrays, nodes need not be contiguous.',
    visualContent: `<svg viewBox="0 0 650 150">
  <!-- Professional node visualization with arrows -->
  <!-- Gradient boxes for nodes -->
  <!-- Pointer arrows between nodes -->
  <!-- Null terminator -->
</svg>`
  },
  {
    id: 'll-insert-head',
    description: '➕ Step 2: Insert 0 at head - O(1) operation',
    code: `Node newNode = new Node(0);
newNode.next = head;
head = newNode;`,
    duration: 1200,
    transitionType: 'scale',
    explanation: 'Inserting at head is O(1) - just update two pointers. No shifting required unlike arrays!',
    visualContent: `<svg viewBox="0 0 650 250">
  <!-- Shows new node creation -->
  <!-- Link to existing head -->
  <!-- Update head pointer -->
  <!-- Before/after comparison -->
</svg>`
  }
];

// Example: Two Pointer Technique Animation
const twoPointerAnimation: AnimationStep = {
  id: 'two-pointer-technique',
  description: '👈👉 Two Pointer Technique - Find pair with target sum',
  code: `int left = 0, right = arr.length - 1;
while (left < right) {
  int sum = arr[left] + arr[right];
  if (sum == target) return true;
  else if (sum < target) left++;
  else right--;
}`,
  duration: 2000,
  transitionType: 'fade',
  explanation: 'Two pointers converge from both ends. Time: O(n) vs O(n²) brute force. Space: O(1) - no extra array needed.',
  visualContent: `<svg viewBox="0 0 700 220">
  <defs>
    <!-- Professional gradients -->
    <linearGradient id="leftPointer">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="rightPointer">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <!-- Glow filter -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
  </defs>
  
  <!-- Title -->
  <text x="350" y="30" fill="#22d3ee" font-size="18" font-weight="700">
    Two Pointer Technique
  </text>
  
  <!-- Array with gradients -->
  <rect x="80" y="80" width="90" height="60" 
        fill="url(#leftPointer)" 
        filter="url(#glow)"
        stroke="#3B82F6" stroke-width="3" rx="8"/>
  <text x="125" y="115" fill="#fff" font-size="24" font-weight="700">1</text>
  <text x="125" y="135" fill="#d1d5db" font-size="11">LEFT →</text>
  
  <!-- More array elements -->
  <!-- ... -->
  
  <!-- Right pointer -->
  <rect x="530" y="80" width="90" height="60" 
        fill="url(#rightPointer)" 
        filter="url(#glow)"
        stroke="#10b981" stroke-width="3" rx="8"/>
  <text x="575" y="115" fill="#fff" font-size="24" font-weight="700">49</text>
  <text x="575" y="135" fill="#d1fae5" font-size="11">← RIGHT</text>
  
  <!-- Calculation display -->
  <rect x="200" y="160" width="300" height="40" 
        fill="#10b981" opacity="0.1" 
        stroke="#10b981" stroke-width="1.5" rx="8"/>
  <text x="350" y="185" fill="#10b981" text-anchor="middle" font-size="14">
    sum = 1 + 49 = 50 ✓
  </text>
</svg>`
};

// Example: Binary Search with Professional Visuals
const binarySearchSteps: AnimationStep[] = [
  {
    id: 'binary-search-1',
    description: '🎯 Binary Search - Step 1: Set left=0, right=n-1',
    code: 'int left = 0, right = arr.length - 1;',
    duration: 1000,
    transitionType: 'fade',
    explanation: 'Start with full array range. Binary search works only on sorted arrays.',
    visualContent: `<!-- Full array with left/right markers -->`
  },
  {
    id: 'binary-search-2',
    description: '📊 Step 2: Calculate mid = (left + right) / 2',
    code: 'int mid = left + (right - left) / 2;',
    duration: 1200,
    transitionType: 'scale',
    explanation: 'Using left + (right-left)/2 prevents integer overflow. Mid element highlighted with glow.',
    visualContent: `<!-- Highlight mid element with calculation shown -->`
  },
  {
    id: 'binary-search-3',
    description: '✅ Step 3: Found! arr[mid] == target',
    code: 'if (arr[mid] == target) return mid;',
    duration: 1000,
    transitionType: 'scale',
    explanation: 'Success! Found target in O(log n) time. Only 1 comparison needed in this case.',
    visualContent: `<!-- Success state with checkmark and glow -->`
  }
];

// Usage in different contexts
export const ExampleUsages = {
  // In theory page
  theoryPage: (
    <AnimationPlayer 
      steps={arrayAnimations}
      title="Array Fundamentals"
    />
  ),
  
  // In problem workspace
  problemDemo: (
    <AnimationPlayer 
      steps={twoPointerAnimation ? [twoPointerAnimation] : []}
      title="Two Pointer Solution"
    />
  ),
  
  // In tutorial section
  tutorial: (
    <AnimationPlayer 
      steps={binarySearchSteps}
      title="Binary Search Algorithm"
    />
  ),
  
  // Side-by-side comparison
  comparison: (
    <div className="animation-comparison">
      <div className="algorithm-1">
        <AnimationPlayer 
          steps={linkedListAnimations}
          title="Linked List O(1) Insert"
        />
      </div>
      <div className="algorithm-2">
        <AnimationPlayer 
          steps={arrayAnimations}
          title="Array O(n) Insert"
        />
      </div>
    </div>
  )
};

// Integration with existing topic system
export const useAnimationForTopic = (topicId: string) => {
  const topic = learningModules[topicId];
  
  return (
    <div className="topic-learning">
      <section className="theory">
        {/* Theory content */}
      </section>
      
      <section className="visualizations">
        <AnimationPlayer 
          steps={topic?.animationSteps || []}
          title={topic ? `${Object.keys(learningModules).find(key => learningModules[key] === topic)} - Visual Learning` : 'Visual Learning'}
        />
      </section>
      
      <section className="practice">
        {/* Practice problems */}
      </section>
    </div>
  );
};

export default AnimationPlayer;
