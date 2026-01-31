/**
 * MEDIUM DIFFICULTY VISUAL ANIMATIONS
 * Pure visual step-by-step animations (GfG style)
 * 
 * Features:
 * - Visual pointers (arrows with labels)
 * - Step-by-step diagrams
 * - Educational notes
 * - No code display
 */

import type { VisualAnimationConfig } from '../components/VisualDSAAnimation';

// ============================================
// 1. SELECTION SORT - Visual Animation
// ============================================

export const selectionSortAnimation: VisualAnimationConfig = {
  title: 'Selection Sort',
  algorithm: 'Selection Sort',
  description: 'Find the minimum element in unsorted portion and swap it with the first unsorted element.',
  difficulty: 'Medium',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  
  keyPoints: [
    'Divides array into sorted and unsorted portions',
    'Finds minimum in unsorted portion each pass',
    'Swaps minimum with first unsorted element',
    'Builds sorted portion from left to right',
    'Always makes exactly n-1 swaps'
  ],

  steps: [
    {
      elements: [
        { id: '0', value: 64 },
        { id: '1', value: 25 },
        { id: '2', value: 12 },
        { id: '3', value: 22 },
        { id: '4', value: 11 },
      ],
      description: 'Initial Array',
      explanation: 'Starting with unsorted array. We\'ll find the minimum and swap it to position 0.',
      pointers: {
        current: 0,
        min: 0
      },
      visualNote: 'Pass 1: Find minimum in entire array'
    },
    
    {
      elements: [
        { id: '0', value: 64, isComparing: true },
        { id: '1', value: 25, isComparing: true },
        { id: '2', value: 12 },
        { id: '3', value: 22 },
        { id: '4', value: 11 },
      ],
      description: 'Comparing 64 and 25',
      explanation: '25 < 64, so 25 becomes new minimum.',
      pointers: {
        current: 0,
        checking: 1,
        min: 1
      },
      visualNote: 'Found smaller: min = 25 (index 1)'
    },
    
    {
      elements: [
        { id: '0', value: 64 },
        { id: '1', value: 25, isComparing: true },
        { id: '2', value: 12, isComparing: true },
        { id: '3', value: 22 },
        { id: '4', value: 11 },
      ],
      description: 'Comparing 25 and 12',
      explanation: '12 < 25, so 12 becomes new minimum.',
      pointers: {
        current: 0,
        checking: 2,
        min: 2
      },
      visualNote: 'Found smaller: min = 12 (index 2)'
    },
    
    {
      elements: [
        { id: '0', value: 64 },
        { id: '1', value: 25 },
        { id: '2', value: 12, isComparing: true },
        { id: '3', value: 22, isComparing: true },
        { id: '4', value: 11 },
      ],
      description: 'Comparing 12 and 22',
      explanation: '22 > 12, min stays at 12.',
      pointers: {
        current: 0,
        checking: 3,
        min: 2
      },
      visualNote: '22 is not smaller, min stays 12'
    },
    
    {
      elements: [
        { id: '0', value: 64 },
        { id: '1', value: 25 },
        { id: '2', value: 12, isComparing: true },
        { id: '3', value: 22 },
        { id: '4', value: 11, isComparing: true },
      ],
      description: 'Comparing 12 and 11',
      explanation: '11 < 12, so 11 becomes the minimum!',
      pointers: {
        current: 0,
        checking: 4,
        min: 4
      },
      visualNote: 'Found smallest: min = 11 (index 4)'
    },
    
    {
      elements: [
        { id: '4', value: 11, isSwapping: true },
        { id: '1', value: 25 },
        { id: '2', value: 12 },
        { id: '3', value: 22 },
        { id: '0', value: 64, isSwapping: true },
      ],
      description: 'Swap 11 to Position 0',
      explanation: 'Swapping minimum (11) with first element (64).',
      pointers: {
        swapped: 0
      },
      visualNote: 'Swap complete! 11 is now sorted'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '1', value: 25 },
        { id: '2', value: 12 },
        { id: '3', value: 22 },
        { id: '0', value: 64 },
      ],
      description: 'Pass 1 Complete',
      explanation: 'Position 0 is now sorted with the minimum value.',
      pointers: {
        sorted: 0,
        current: 1
      },
      visualNote: '✓ Pass 1 done! Now find min from remaining'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '1', value: 25, isComparing: true },
        { id: '2', value: 12, isComparing: true },
        { id: '3', value: 22 },
        { id: '0', value: 64 },
      ],
      description: 'Comparing 25 and 12',
      explanation: 'Finding minimum in unsorted portion (indices 1-4).',
      pointers: {
        current: 1,
        checking: 2,
        min: 2
      },
      visualNote: '12 < 25, min = 12'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '1', value: 25 },
        { id: '2', value: 12, isComparing: true },
        { id: '3', value: 22, isComparing: true },
        { id: '0', value: 64 },
      ],
      description: 'Comparing 12 and 22',
      explanation: '22 > 12, min stays at 12.',
      pointers: {
        current: 1,
        checking: 3,
        min: 2
      },
      visualNote: 'min stays 12'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '1', value: 25 },
        { id: '2', value: 12, isComparing: true },
        { id: '3', value: 22 },
        { id: '0', value: 64, isComparing: true },
      ],
      description: 'Comparing 12 and 64',
      explanation: '64 > 12, min is 12.',
      pointers: {
        current: 1,
        checking: 4,
        min: 2
      },
      visualNote: 'Minimum found: 12 at index 2'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '2', value: 12, isSwapping: true },
        { id: '1', value: 25, isSwapping: true },
        { id: '3', value: 22 },
        { id: '0', value: 64 },
      ],
      description: 'Swap 12 to Position 1',
      explanation: 'Swapping 12 with element at position 1.',
      pointers: {
        swapped: 1
      },
      visualNote: 'Swap 12 ↔ 25'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '2', value: 12, isCompleted: true, isSorted: true },
        { id: '1', value: 25 },
        { id: '3', value: 22 },
        { id: '0', value: 64 },
      ],
      description: 'Pass 2 Complete',
      explanation: 'First two positions are sorted.',
      pointers: {
        sorted: 1,
        current: 2
      },
      visualNote: '✓ Pass 2 done! Continue with remaining'
    },
    
    {
      elements: [
        { id: '4', value: 11, isCompleted: true, isSorted: true },
        { id: '2', value: 12, isCompleted: true, isSorted: true },
        { id: '3', value: 22, isCompleted: true, isSorted: true },
        { id: '1', value: 25, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'Fully Sorted!',
      explanation: 'Array is now completely sorted in ascending order.',
      pointers: {
        done: 4
      },
      visualNote: '✓ Sorting complete! All elements in order'
    },
  ],
};

// ============================================
// 2. INSERTION SORT - Visual Animation
// ============================================

export const insertionSortAnimation: VisualAnimationConfig = {
  title: 'Insertion Sort',
  algorithm: 'Insertion Sort',
  description: 'Build sorted array one element at a time by inserting each element into its correct position.',
  difficulty: 'Medium',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  
  keyPoints: [
    'Builds sorted portion from left to right',
    'Takes one element at a time from unsorted',
    'Inserts it into correct position in sorted portion',
    'Shifts elements to make room for insertion',
    'Efficient for small or nearly sorted arrays'
  ],

  steps: [
    {
      elements: [
        { id: '0', value: 64, isCompleted: true, isSorted: true },
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Initial State',
      explanation: 'First element is already sorted. Start with second element (34).',
      pointers: {
        sorted: 0,
        key: 1
      },
      visualNote: 'Single element is always sorted, key = 34'
    },
    
    {
      elements: [
        { id: '0', value: 64, isComparing: true },
        { id: '1', value: 34, isComparing: true },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Comparing 64 and 34',
      explanation: '34 < 64, so we need to insert 34 before 64.',
      pointers: {
        key: 1,
        compare: 0
      },
      visualNote: '34 < 64, shift 64 right'
    },
    
    {
      elements: [
        { id: '1', value: 34, isSwapping: true },
        { id: '0', value: 64, isSwapping: true },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Insert 34',
      explanation: 'Inserted 34 at the beginning.',
      pointers: {
        inserted: 0
      },
      visualNote: 'Inserted! Sorted portion: [34, 64]'
    },
    
    {
      elements: [
        { id: '1', value: 34, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Next Key: 25',
      explanation: 'Now insert 25 into sorted portion [34, 64].',
      pointers: {
        sorted: 1,
        key: 2
      },
      visualNote: 'key = 25, find position in [34, 64]'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '0', value: 64, isComparing: true },
        { id: '2', value: 25, isComparing: true },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Comparing 64 and 25',
      explanation: '25 < 64, shift 64 right.',
      pointers: {
        key: 2,
        compare: 1
      },
      visualNote: '25 < 64, shift right'
    },
    
    {
      elements: [
        { id: '1', value: 34, isComparing: true },
        { id: '0', value: 64 },
        { id: '2', value: 25, isComparing: true },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Comparing 34 and 25',
      explanation: '25 < 34, shift 34 right too.',
      pointers: {
        key: 2,
        compare: 0
      },
      visualNote: '25 < 34, continue shifting'
    },
    
    {
      elements: [
        { id: '2', value: 25, isSwapping: true },
        { id: '1', value: 34 },
        { id: '0', value: 64 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Insert 25',
      explanation: 'Inserted 25 at the beginning.',
      pointers: {
        inserted: 0
      },
      visualNote: 'Inserted! Sorted: [25, 34, 64]'
    },
    
    {
      elements: [
        { id: '2', value: 25, isCompleted: true, isSorted: true },
        { id: '1', value: 34, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
      ],
      description: 'Next Key: 12',
      explanation: 'Insert 12 into [25, 34, 64].',
      pointers: {
        sorted: 2,
        key: 3
      },
      visualNote: 'key = 12, smallest so far'
    },
    
    {
      elements: [
        { id: '3', value: 12, isSwapping: true },
        { id: '2', value: 25 },
        { id: '1', value: 34 },
        { id: '0', value: 64 },
        { id: '4', value: 22 },
      ],
      description: 'Insert 12',
      explanation: '12 is smaller than all, goes to beginning.',
      pointers: {
        inserted: 0
      },
      visualNote: 'Inserted! Sorted: [12, 25, 34, 64]'
    },
    
    {
      elements: [
        { id: '3', value: 12, isCompleted: true, isSorted: true },
        { id: '2', value: 25, isCompleted: true, isSorted: true },
        { id: '1', value: 34, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
        { id: '4', value: 22 },
      ],
      description: 'Last Key: 22',
      explanation: 'Insert final element 22.',
      pointers: {
        sorted: 3,
        key: 4
      },
      visualNote: 'Last element: key = 22'
    },
    
    {
      elements: [
        { id: '3', value: 12, isCompleted: true, isSorted: true },
        { id: '4', value: 22, isCompleted: true, isSorted: true },
        { id: '2', value: 25, isCompleted: true, isSorted: true },
        { id: '1', value: 34, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'Fully Sorted!',
      explanation: 'Array is now completely sorted.',
      pointers: {
        done: 4
      },
      visualNote: '✓ Insertion Sort complete!'
    },
  ],
};

// Export all medium animations
export const mediumAnimations = [
  selectionSortAnimation,
  insertionSortAnimation,
];
