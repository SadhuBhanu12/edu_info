/**
 * EASY-TO-UNDERSTAND ANIMATION EXAMPLES
 * Rebuilt from scratch for maximum clarity
 * 
 * Features:
 * - Real animated bars/boxes (not HTML strings)
 * - High contrast colors
 * - Clear step-by-step explanations
 * - Smooth animations
 * - Professional design
 */

import type { VisualAnimationConfig } from '../components/VisualDSAAnimation';

// ============================================
// 1. BUBBLE SORT - Complete Animation
// ============================================

export const bubbleSortAnimation: VisualAnimationConfig = {
  title: 'Bubble Sort',
  algorithm: 'Bubble Sort',
  description: 'Compare adjacent elements and swap if they are in wrong order. The largest element "bubbles up" to the end in each pass.',
  difficulty: 'Easy',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  
  keyPoints: [
    'Compares adjacent elements repeatedly',
    'Swaps if left element > right element',
    'Largest element bubbles to the end each pass',
    'Continues until array is fully sorted',
    'Simple but inefficient for large datasets'
  ],

  steps: [
    {
      elements: [
        { id: '0', value: 64 },
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Initial Array',
      explanation: 'Starting with an unsorted array of 6 elements. We will compare adjacent pairs and swap them if needed.',
      pointers: {
        i: 0,
        j: 0
      },
      visualNote: 'Pass 1 begins: We\'ll compare pairs from left to right'
    },
    
    {
      elements: [
        { id: '0', value: 64, isComparing: true },
        { id: '1', value: 34, isComparing: true },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Comparing 64 and 34',
      explanation: '64 > 34, so we need to swap them. The larger number moves to the right.',
      pointers: {
        left: 0,
        right: 1
      },
      visualNote: 'Found: 64 > 34, swap needed!'
    },
    
    {
      elements: [
        { id: '1', value: 34, isSwapping: true },
        { id: '0', value: 64, isSwapping: true },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Swapped 64 and 34',
      explanation: 'After swapping, 34 is now at index 0 and 64 is at index 1.',
      pointers: {
        swapped: 0
      },
      visualNote: 'Swapped! Array is now [34, 64, 25, 12, 22, 11]'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '0', value: 64, isComparing: true },
        { id: '2', value: 25, isComparing: true },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Comparing 64 and 25',
      explanation: '64 > 25, so we need to swap them again.',
      pointers: {
        left: 1,
        right: 2
      },
      visualNote: 'Next comparison: 64 > 25, swap again!'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25, isSwapping: true },
        { id: '0', value: 64, isSwapping: true },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Swapped 64 and 25',
      explanation: '64 keeps moving right because it\'s the largest element in the array.',
      pointers: {
        largest: 2
      },
      visualNote: '64 is bubbling right as the largest element'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '0', value: 64, isComparing: true },
        { id: '3', value: 12, isComparing: true },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Comparing 64 and 12',
      explanation: '64 > 12, swap them.',
      pointers: {
        left: 2,
        right: 3
      },
      visualNote: 'Continue comparing: 64 > 12'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12, isSwapping: true },
        { id: '0', value: 64, isSwapping: true },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
      ],
      description: 'Swapped 64 and 12',
      explanation: '64 continues bubbling to the right.',
      pointers: {
        largest: 3
      },
      visualNote: 'Bubble continues moving 64 to the right'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '0', value: 64, isComparing: true },
        { id: '4', value: 22, isComparing: true },
        { id: '5', value: 11 },
      ],
      description: 'Comparing 64 and 22',
      explanation: '64 > 22, swap them.',
      pointers: {
        left: 3,
        right: 4
      },
      visualNote: '64 > 22, another swap needed'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22, isSwapping: true },
        { id: '0', value: 64, isSwapping: true },
        { id: '5', value: 11 },
      ],
      description: 'Swapped 64 and 22',
      explanation: 'Almost there! One more swap to go.',
      pointers: {
        largest: 4
      },
      visualNote: 'Almost at the end of first pass'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '0', value: 64, isComparing: true },
        { id: '5', value: 11, isComparing: true },
      ],
      description: 'Comparing 64 and 11',
      explanation: '64 > 11, final swap of first pass.',
      pointers: {
        left: 4,
        right: 5
      },
      visualNote: 'Last comparison of Pass 1'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11, isSwapping: true },
        { id: '0', value: 64, isSwapping: true },
      ],
      description: 'Swapped 64 and 11',
      explanation: '64 has bubbled all the way to the end!',
      pointers: {
        largest: 5
      },
      visualNote: '64 reached the end - Pass 1 complete!'
    },
    
    {
      elements: [
        { id: '1', value: 34 },
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'First Pass Complete',
      explanation: 'The largest element (64) is now in its correct position at the end. We can ignore it in the next pass.',
      pointers: {
        sorted: 5
      },
      visualNote: '✓ Pass 1 done! 64 is sorted and in final position'
    },
    
    {
      elements: [
        { id: '1', value: 34, isComparing: true },
        { id: '2', value: 25, isComparing: true },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'Pass 2: Comparing 34 and 25',
      explanation: '34 > 25, swap them.',
      pointers: {
        left: 0,
        right: 1
      },
      visualNote: 'Starting Pass 2 - find second largest'
    },
    
    {
      elements: [
        { id: '2', value: 25 },
        { id: '1', value: 34, isComparing: true },
        { id: '3', value: 12, isComparing: true },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'Comparing 34 and 12',
      explanation: 'After swapping, now compare 34 with 12.',
      pointers: {
        left: 1,
        right: 2
      },
      visualNote: '34 > 12, swap needed'
    },
    
    {
      elements: [
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '1', value: 34, isComparing: true },
        { id: '4', value: 22, isComparing: true },
        { id: '5', value: 11 },
        { id: '0', value: 64, isCompleted: true },
      ],
      description: 'Comparing 34 and 22',
      explanation: '34 > 22, keep swapping.',
      pointers: {
        left: 2,
        right: 3
      },
      visualNote: '34 > 22, continue swapping to move 34 right'
    },
    
    {
      elements: [
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '1', value: 34, isComparing: true },
        { id: '5', value: 11, isComparing: true },
        { id: '0', value: 64, isCompleted: true },
      ],
      description: 'Comparing 34 and 11',
      explanation: '34 > 11, final swap of second pass.',
      pointers: {
        left: 3,
        right: 4
      },
      visualNote: 'Final comparison of Pass 2: 34 > 11'
    },
    
    {
      elements: [
        { id: '2', value: 25 },
        { id: '3', value: 12 },
        { id: '4', value: 22 },
        { id: '5', value: 11 },
        { id: '1', value: 34, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'Second Pass Complete',
      explanation: 'Now both 64 and 34 are in their correct positions!',
      pointers: {
        sorted: 4
      },
      visualNote: '✓ Pass 2 done! 34 and 64 are now in final sorted positions'
    },
    
    {
      elements: [
        { id: '5', value: 11, isCompleted: true, isSorted: true },
        { id: '3', value: 12, isCompleted: true, isSorted: true },
        { id: '4', value: 22, isCompleted: true, isSorted: true },
        { id: '2', value: 25, isCompleted: true, isSorted: true },
        { id: '1', value: 34, isCompleted: true, isSorted: true },
        { id: '0', value: 64, isCompleted: true, isSorted: true },
      ],
      description: 'Array Sorted! 🎉',
      explanation: 'All elements are now in ascending order. Bubble Sort complete! Notice how larger elements "bubbled" to the right.',
      pointers: {},
      visualNote: '✓ Complete! All elements sorted: [11, 12, 22, 25, 34, 64]'
    },
  ]
};

// ============================================
// 2. BINARY SEARCH - Complete Animation
// ============================================

export const binarySearchAnimation: VisualAnimationConfig = {
  title: 'Binary Search',
  algorithm: 'Binary Search',
  description: 'Efficiently find a target value in a sorted array by repeatedly dividing the search interval in half.',
  difficulty: 'Easy',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  
  keyPoints: [
    'Only works on sorted arrays',
    'Divides search space in half each iteration',
    'Compares target with middle element',
    'Eliminates half of remaining elements each step',
    'Very efficient: O(log n) time complexity'
  ],

  steps: [
    {
      elements: [
        { id: '0', value: 2 },
        { id: '1', value: 5 },
        { id: '2', value: 8 },
        { id: '3', value: 12 },
        { id: '4', value: 16 },
        { id: '5', value: 23 },
        { id: '6', value: 38 },
        { id: '7', value: 45 },
        { id: '8', value: 56 },
        { id: '9', value: 67 },
      ],
      description: 'Searching for 23 in sorted array',
      explanation: 'Binary search only works on sorted arrays. We want to find the value 23.',
      pointers: {
        target: 23
      },
      visualNote: 'Starting binary search - array is already sorted'
    },
    
    {
      elements: [
        { id: '0', value: 2, isHighlighted: true },
        { id: '1', value: 5 },
        { id: '2', value: 8 },
        { id: '3', value: 12 },
        { id: '4', value: 16 },
        { id: '5', value: 23 },
        { id: '6', value: 38 },
        { id: '7', value: 45 },
        { id: '8', value: 56 },
        { id: '9', value: 67, isHighlighted: true },
      ],
      description: 'Initialize left and right pointers',
      explanation: 'Left pointer starts at index 0, right pointer at index 9 (last element).',
      pointers: {
        left: 0,
        right: 9,
        target: 23
      },
      visualNote: 'Set left=0 (start) and right=9 (end) - search entire array'
    },
    
    {
      elements: [
        { id: '0', value: 2 },
        { id: '1', value: 5 },
        { id: '2', value: 8 },
        { id: '3', value: 12 },
        { id: '4', value: 16, isComparing: true },
        { id: '5', value: 23 },
        { id: '6', value: 38 },
        { id: '7', value: 45 },
        { id: '8', value: 56 },
        { id: '9', value: 67 },
      ],
      description: 'Calculate middle index: (0 + 9) / 2 = 4',
      explanation: 'Middle element is 16. Compare with target (23).',
      pointers: {
        left: 0,
        mid: 4,
        right: 9,
        target: 23
      },
      visualNote: 'Mid = (0 + 9) / 2 = 4. Check arr[4] = 16 vs target 23'
    },
    
    {
      elements: [
        { id: '0', value: 2 },
        { id: '1', value: 5 },
        { id: '2', value: 8 },
        { id: '3', value: 12 },
        { id: '4', value: 16, isComparing: true },
        { id: '5', value: 23 },
        { id: '6', value: 38 },
        { id: '7', value: 45 },
        { id: '8', value: 56 },
        { id: '9', value: 67 },
      ],
      description: '16 < 23: Search right half',
      explanation: 'Since 16 is less than 23, we know 23 must be in the right half. Discard left half.',
      pointers: {
        left: 0,
        mid: 4,
        right: 9,
        target: 23
      },
      visualNote: '16 < 23: Target is in right half, discard left half'
    },
    
    {
      elements: [
        { id: '0', value: 2, isCompleted: true },
        { id: '1', value: 5, isCompleted: true },
        { id: '2', value: 8, isCompleted: true },
        { id: '3', value: 12, isCompleted: true },
        { id: '4', value: 16, isCompleted: true },
        { id: '5', value: 23, isHighlighted: true },
        { id: '6', value: 38 },
        { id: '7', value: 45 },
        { id: '8', value: 56 },
        { id: '9', value: 67, isHighlighted: true },
      ],
      description: 'Update left pointer to mid + 1 = 5',
      explanation: 'New search range: indices 5 to 9. We eliminated half the array!',
      pointers: {
        left: 5,
        right: 9,
        target: 23
      },
      visualNote: 'Move left to mid+1 = 5. Search space reduced by half!'
    },
    
    {
      elements: [
        { id: '0', value: 2, isCompleted: true },
        { id: '1', value: 5, isCompleted: true },
        { id: '2', value: 8, isCompleted: true },
        { id: '3', value: 12, isCompleted: true },
        { id: '4', value: 16, isCompleted: true },
        { id: '5', value: 23 },
        { id: '6', value: 38 },
        { id: '7', value: 45, isComparing: true },
        { id: '8', value: 56 },
        { id: '9', value: 67 },
      ],
      description: 'Calculate new middle: (5 + 9) / 2 = 7',
      explanation: 'Middle element is 45. Compare with target (23).',
      pointers: {
        left: 5,
        mid: 7,
        right: 9,
        target: 23
      },
      visualNote: 'Mid = (5 + 9) / 2 = 7. Check arr[7] = 45 vs target 23'
    },
    
    {
      elements: [
        { id: '0', value: 2, isCompleted: true },
        { id: '1', value: 5, isCompleted: true },
        { id: '2', value: 8, isCompleted: true },
        { id: '3', value: 12, isCompleted: true },
        { id: '4', value: 16, isCompleted: true },
        { id: '5', value: 23 },
        { id: '6', value: 38 },
        { id: '7', value: 45, isComparing: true },
        { id: '8', value: 56 },
        { id: '9', value: 67 },
      ],
      description: '45 > 23: Search left half',
      explanation: 'Since 45 is greater than 23, target must be in left half of current range.',
      pointers: {
        left: 5,
        mid: 7,
        right: 9,
        target: 23
      },
      visualNote: '45 > 23: Target is in left half, discard right half'
    },
    
    {
      elements: [
        { id: '0', value: 2, isCompleted: true },
        { id: '1', value: 5, isCompleted: true },
        { id: '2', value: 8, isCompleted: true },
        { id: '3', value: 12, isCompleted: true },
        { id: '4', value: 16, isCompleted: true },
        { id: '5', value: 23, isHighlighted: true },
        { id: '6', value: 38, isHighlighted: true },
        { id: '7', value: 45, isCompleted: true },
        { id: '8', value: 56, isCompleted: true },
        { id: '9', value: 67, isCompleted: true },
      ],
      description: 'Update right pointer to mid - 1 = 6',
      explanation: 'New search range: indices 5 to 6. Only 2 elements left to check!',
      pointers: {
        left: 5,
        right: 6,
        target: 23
      },
      visualNote: 'Move right to mid-1 = 6. Only 2 elements remaining!'
    },
    
    {
      elements: [
        { id: '0', value: 2, isCompleted: true },
        { id: '1', value: 5, isCompleted: true },
        { id: '2', value: 8, isCompleted: true },
        { id: '3', value: 12, isCompleted: true },
        { id: '4', value: 16, isCompleted: true },
        { id: '5', value: 23, isComparing: true },
        { id: '6', value: 38 },
        { id: '7', value: 45, isCompleted: true },
        { id: '8', value: 56, isCompleted: true },
        { id: '9', value: 67, isCompleted: true },
      ],
      description: 'Calculate middle: (5 + 6) / 2 = 5',
      explanation: 'Middle element is 23. This is our target!',
      pointers: {
        left: 5,
        mid: 5,
        right: 6,
        target: 23
      },
      visualNote: 'Mid = (5 + 6) / 2 = 5. Check arr[5] = 23 - MATCH!'
    },
    
    {
      elements: [
        { id: '0', value: 2, isCompleted: true },
        { id: '1', value: 5, isCompleted: true },
        { id: '2', value: 8, isCompleted: true },
        { id: '3', value: 12, isCompleted: true },
        { id: '4', value: 16, isCompleted: true },
        { id: '5', value: 23, isSwapping: true },
        { id: '6', value: 38, isCompleted: true },
        { id: '7', value: 45, isCompleted: true },
        { id: '8', value: 56, isCompleted: true },
        { id: '9', value: 67, isCompleted: true },
      ],
      description: 'Found! 🎉',
      explanation: 'Target 23 found at index 5. Binary search is very efficient - only 3 comparisons needed instead of checking all 10 elements!',
      pointers: {
        found: 5,
        target: 23
      },
      visualNote: '✓ Found target 23 at index 5! Only 3 comparisons vs 6 for linear search'
    },
  ]
};

// ============================================
// 3. LINEAR SEARCH - Complete Animation
// ============================================

export const linearSearchAnimation: VisualAnimationConfig = {
  title: 'Linear Search',
  algorithm: 'Linear Search',
  description: 'Search for a target value by checking each element one by one from left to right.',
  difficulty: 'Easy',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  
  keyPoints: [
    'Checks each element sequentially from start',
    'Works on both sorted and unsorted arrays',
    'Simple to implement but slow for large datasets',
    'Best case: O(1) if target is first element',
    'Worst case: O(n) if target is last or not present'
  ],

  steps: [
    {
      elements: [
        { id: '0', value: 45 },
        { id: '1', value: 12 },
        { id: '2', value: 85 },
        { id: '3', value: 31 },
        { id: '4', value: 67 },
        { id: '5', value: 23 },
      ],
      description: 'Searching for 67',
      explanation: 'Linear search checks each element sequentially until finding the target or reaching the end.',
      pointers: {
        target: 67
      },
      visualNote: 'Starting linear search for value 67 in array'
    },
    
    {
      elements: [
        { id: '0', value: 45, isComparing: true },
        { id: '1', value: 12 },
        { id: '2', value: 85 },
        { id: '3', value: 31 },
        { id: '4', value: 67 },
        { id: '5', value: 23 },
      ],
      description: 'Check index 0: 45',
      explanation: '45 ≠ 67, continue searching.',
      pointers: {
        current: 0,
        target: 67
      },
      visualNote: 'Checking index 0: arr[0] = 45 ≠ 67, move to next'
    },
    
    {
      elements: [
        { id: '0', value: 45, isCompleted: true },
        { id: '1', value: 12, isComparing: true },
        { id: '2', value: 85 },
        { id: '3', value: 31 },
        { id: '4', value: 67 },
        { id: '5', value: 23 },
      ],
      description: 'Check index 1: 12',
      explanation: '12 ≠ 67, continue searching.',
      pointers: {
        current: 1,
        target: 67
      },
      visualNote: 'Checking index 1: arr[1] = 12 ≠ 67, move to next'
    },
    
    {
      elements: [
        { id: '0', value: 45, isCompleted: true },
        { id: '1', value: 12, isCompleted: true },
        { id: '2', value: 85, isComparing: true },
        { id: '3', value: 31 },
        { id: '4', value: 67 },
        { id: '5', value: 23 },
      ],
      description: 'Check index 2: 85',
      explanation: '85 ≠ 67, continue searching.',
      pointers: {
        current: 2,
        target: 67
      },
      visualNote: 'Checking index 2: arr[2] = 85 ≠ 67, move to next'
    },
    
    {
      elements: [
        { id: '0', value: 45, isCompleted: true },
        { id: '1', value: 12, isCompleted: true },
        { id: '2', value: 85, isCompleted: true },
        { id: '3', value: 31, isComparing: true },
        { id: '4', value: 67 },
        { id: '5', value: 23 },
      ],
      description: 'Check index 3: 31',
      explanation: '31 ≠ 67, continue searching.',
      pointers: {
        current: 3,
        target: 67
      },
      visualNote: 'Checking index 3: arr[3] = 31 ≠ 67, move to next'
    },
    
    {
      elements: [
        { id: '0', value: 45, isCompleted: true },
        { id: '1', value: 12, isCompleted: true },
        { id: '2', value: 85, isCompleted: true },
        { id: '3', value: 31, isCompleted: true },
        { id: '4', value: 67, isComparing: true },
        { id: '5', value: 23 },
      ],
      description: 'Check index 4: 67',
      explanation: '67 === 67! Found our target!',
      pointers: {
        current: 4,
        target: 67
      },
      visualNote: 'Checking index 4: arr[4] = 67 === 67 - MATCH FOUND!'
    },
    
    {
      elements: [
        { id: '0', value: 45, isCompleted: true },
        { id: '1', value: 12, isCompleted: true },
        { id: '2', value: 85, isCompleted: true },
        { id: '3', value: 31, isCompleted: true },
        { id: '4', value: 67, isSwapping: true },
        { id: '5', value: 23, isCompleted: true },
      ],
      description: 'Found! 🎉',
      explanation: 'Target 67 found at index 4. Linear search checked 5 elements before finding it.',
      pointers: {
        found: 4,
        target: 67
      },
      visualNote: '✓ Success! Found 67 at index 4 after checking 5 elements'
    },
  ]
};

// Export all animations
export const allAnimations = {
  bubbleSort: bubbleSortAnimation,
  binarySearch: binarySearchAnimation,
  linearSearch: linearSearchAnimation
};
