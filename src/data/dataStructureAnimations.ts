/**
 * DATA STRUCTURE VISUAL ANIMATIONS
 * Pure visual step-by-step animations (GfG style)
 * 
 * Covers: Stack, Queue, Linked List operations
 */

import type { VisualAnimationConfig } from '../components/VisualDSAAnimation';

// ============================================
// 1. STACK (LIFO) - Push & Pop Operations
// ============================================

export const stackAnimation: VisualAnimationConfig = {
  title: 'Stack (LIFO)',
  algorithm: 'Stack Operations',
  description: 'Last In First Out data structure. Elements are added and removed from the top only.',
  difficulty: 'Easy',
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(n)',
  
  keyPoints: [
    'LIFO: Last In, First Out principle',
    'Push adds element to top',
    'Pop removes element from top',
    'Top pointer tracks last element',
    'Used in function calls, undo operations'
  ],

  steps: [
    {
      elements: [],
      description: 'Empty Stack',
      explanation: 'Stack is initially empty. Top = -1',
      pointers: {
        top: -1
      },
      visualNote: 'Stack empty, ready for operations'
    },
    
    {
      elements: [
        { id: '0', value: 10, isSwapping: true },
      ],
      description: 'Push 10',
      explanation: 'Pushing first element 10 onto stack.',
      pointers: {
        top: 0,
        pushing: 0
      },
      visualNote: 'PUSH(10): Adding to top, Top = 0'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
      ],
      description: 'Stack: [10]',
      explanation: '10 is now at the top of stack.',
      pointers: {
        top: 0
      },
      visualNote: '✓ Stack size: 1'
    },
    
    {
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20, isSwapping: true },
      ],
      description: 'Push 20',
      explanation: 'Pushing 20 onto stack.',
      pointers: {
        top: 1,
        pushing: 1
      },
      visualNote: 'PUSH(20): Top moves to 1'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
        { id: '1', value: 20, isCompleted: true },
      ],
      description: 'Stack: [10, 20]',
      explanation: '20 is now at top.',
      pointers: {
        top: 1
      },
      visualNote: '✓ Stack size: 2'
    },
    
    {
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30, isSwapping: true },
      ],
      description: 'Push 30',
      explanation: 'Pushing 30 onto stack.',
      pointers: {
        top: 2,
        pushing: 2
      },
      visualNote: 'PUSH(30): Stack growing upward'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
        { id: '1', value: 20, isCompleted: true },
        { id: '2', value: 30, isCompleted: true },
      ],
      description: 'Stack: [10, 20, 30]',
      explanation: 'Stack has 3 elements. 30 is at top.',
      pointers: {
        top: 2
      },
      visualNote: '✓ Stack size: 3, Top = 30'
    },
    
    {
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30, isSwapping: true },
      ],
      description: 'Pop Operation',
      explanation: 'Removing top element (30) from stack.',
      pointers: {
        popping: 2
      },
      visualNote: 'POP(): Returning 30, Top moves down'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
        { id: '1', value: 20, isCompleted: true },
      ],
      description: 'Stack: [10, 20]',
      explanation: '30 removed. Top now points to 20.',
      pointers: {
        top: 1
      },
      visualNote: '✓ Returned: 30, Size: 2'
    },
    
    {
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20, isSwapping: true },
      ],
      description: 'Pop Operation',
      explanation: 'Removing 20 from top.',
      pointers: {
        popping: 1
      },
      visualNote: 'POP(): Returning 20'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
      ],
      description: 'Stack: [10]',
      explanation: 'Only 10 remains in stack.',
      pointers: {
        top: 0
      },
      visualNote: '✓ Returned: 20, Size: 1'
    },
  ],
};

// ============================================
// 2. QUEUE (FIFO) - Enqueue & Dequeue
// ============================================

export const queueAnimation: VisualAnimationConfig = {
  title: 'Queue (FIFO)',
  algorithm: 'Queue Operations',
  description: 'First In First Out data structure. Elements are added at rear and removed from front.',
  difficulty: 'Easy',
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(n)',
  
  keyPoints: [
    'FIFO: First In, First Out principle',
    'Enqueue adds element to rear',
    'Dequeue removes element from front',
    'Front and Rear pointers track positions',
    'Used in task scheduling, BFS traversal'
  ],

  steps: [
    {
      elements: [],
      description: 'Empty Queue',
      explanation: 'Queue is initially empty. Front = Rear = -1',
      pointers: {
        front: -1,
        rear: -1
      },
      visualNote: 'Queue empty, waiting for elements'
    },
    
    {
      elements: [
        { id: '0', value: 10, isSwapping: true },
      ],
      description: 'Enqueue 10',
      explanation: 'Adding first element. Front and Rear both point to 0.',
      pointers: {
        front: 0,
        rear: 0,
        enqueuing: 0
      },
      visualNote: 'ENQUEUE(10): First element'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
      ],
      description: 'Queue: [10]',
      explanation: 'Queue has one element.',
      pointers: {
        front: 0,
        rear: 0
      },
      visualNote: '✓ Size: 1, Front = Rear = 0'
    },
    
    {
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20, isSwapping: true },
      ],
      description: 'Enqueue 20',
      explanation: 'Adding 20 at rear. Rear moves to 1.',
      pointers: {
        front: 0,
        rear: 1,
        enqueuing: 1
      },
      visualNote: 'ENQUEUE(20): Rear advances'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
        { id: '1', value: 20, isCompleted: true },
      ],
      description: 'Queue: [10, 20]',
      explanation: 'Two elements in queue.',
      pointers: {
        front: 0,
        rear: 1
      },
      visualNote: '✓ Size: 2, Front = 0, Rear = 1'
    },
    
    {
      elements: [
        { id: '0', value: 10 },
        { id: '1', value: 20 },
        { id: '2', value: 30, isSwapping: true },
      ],
      description: 'Enqueue 30',
      explanation: 'Adding 30 at rear.',
      pointers: {
        front: 0,
        rear: 2,
        enqueuing: 2
      },
      visualNote: 'ENQUEUE(30): Queue growing'
    },
    
    {
      elements: [
        { id: '0', value: 10, isCompleted: true },
        { id: '1', value: 20, isCompleted: true },
        { id: '2', value: 30, isCompleted: true },
      ],
      description: 'Queue: [10, 20, 30]',
      explanation: 'Queue has 3 elements.',
      pointers: {
        front: 0,
        rear: 2
      },
      visualNote: '✓ Size: 3'
    },
    
    {
      elements: [
        { id: '0', value: 10, isSwapping: true },
        { id: '1', value: 20 },
        { id: '2', value: 30 },
      ],
      description: 'Dequeue Operation',
      explanation: 'Removing front element (10). Front moves to 1.',
      pointers: {
        dequeuing: 0,
        front: 1,
        rear: 2
      },
      visualNote: 'DEQUEUE(): Returning 10, Front advances'
    },
    
    {
      elements: [
        { id: '1', value: 20, isCompleted: true },
        { id: '2', value: 30, isCompleted: true },
      ],
      description: 'Queue: [20, 30]',
      explanation: '10 removed. 20 is now at front.',
      pointers: {
        front: 1,
        rear: 2
      },
      visualNote: '✓ Returned: 10, Size: 2'
    },
    
    {
      elements: [
        { id: '1', value: 20, isSwapping: true },
        { id: '2', value: 30 },
      ],
      description: 'Dequeue Operation',
      explanation: 'Removing 20 from front.',
      pointers: {
        dequeuing: 1,
        front: 2,
        rear: 2
      },
      visualNote: 'DEQUEUE(): Returning 20'
    },
    
    {
      elements: [
        { id: '2', value: 30, isCompleted: true },
      ],
      description: 'Queue: [30]',
      explanation: 'Only 30 remains. Front = Rear = 2',
      pointers: {
        front: 2,
        rear: 2
      },
      visualNote: '✓ Returned: 20, Last element at front'
    },
  ],
};

// Export all data structure animations
export const dataStructureAnimations = [
  stackAnimation,
  queueAnimation,
];
