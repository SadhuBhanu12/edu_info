// Interactive DSA Animation Examples
// Complete, ready-to-use animation configurations

import type { InteractiveAnimationConfig } from '../types';

// ========================================
// EXAMPLE 1: BUBBLE SORT - Complete Implementation
// ========================================

export const bubbleSortAnimation: InteractiveAnimationConfig = {
  id: 'bubble-sort-animation',
  topicId: 'sorting',
  title: 'Bubble Sort - Visual Learning',
  difficulty: 'Easy',

  // Real-Life Analogy (MUST-HAVE #1)
  realLifeAnalogy: {
    id: 'bubble-sort-analogy',
    title: '🫧 Bubbles Rising to the Surface',
    description: 'Imagine bubbles in a fizzy drink. The largest bubbles naturally rise to the top first, just like how Bubble Sort moves the largest elements to the end of the array.',
    visual: '<svg>...</svg>', // Or image URL
    mapping: [
      {
        concept: 'Array Elements',
        realLife: 'Bubbles of different sizes',
        explanation: 'Each number in the array is like a bubble - larger numbers are like larger bubbles.'
      },
      {
        concept: 'Comparison',
        realLife: 'Comparing bubble sizes',
        explanation: 'We check if one bubble is larger than its neighbor, just like comparing adjacent numbers.'
      },
      {
        concept: 'Swap',
        realLife: 'Larger bubble moves up',
        explanation: 'When we find a larger bubble below a smaller one, they swap positions as the larger one rises.'
      }
    ],
    examples: [
      'Like arranging books by height on a shelf, moving taller books to the right one at a time',
      'Like sorting coins by size, repeatedly finding the largest and placing it at the end',
      'Like organizing students by height in a line, comparing neighbors and swapping when needed'
    ]
  },

  // Visual Legend (MUST-HAVE #4)
  visualLegend: [
    { color: '#f87171', label: 'Active', meaning: 'Currently being compared', icon: '🔴' },
    { color: '#fbbf24', label: 'Comparing', meaning: 'Two elements being checked', icon: '🟡' },
    { color: '#10b981', label: 'Sorted', meaning: 'In final correct position', icon: '🟢' },
    { color: '#94a3b8', label: 'Unsorted', meaning: 'Not yet in final position', icon: '⚪' }
  ],

  // Sample Input/Output (MUST-HAVE #8)
  sampleInput: [5, 3, 8, 2, 1],
  sampleOutput: [1, 2, 3, 5, 8],

  // Animation Steps (MUST-HAVE #3 - Step-by-step execution)
  steps: [
    {
      id: 'step-0',
      description: 'Starting array with unsorted elements',
      microExplanation: 'We begin with [5, 3, 8, 2, 1]',
      highlightedLine: 1,
      highlightElements: [],
      dimElements: [],
      visualContent: `
        <div style="display: flex; gap: 10px; justify-content: center;">
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">5</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">3</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">8</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">2</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">1</div>
        </div>
      `,
      duration: 2000,
      variables: { i: 0, j: 0, n: 5, swapped: false },
      voiceNarration: 'We start with an unsorted array of 5 elements. Our goal is to sort them in ascending order.',
      aiExplanation: 'Bubble Sort works by repeatedly comparing adjacent elements and swapping them if they are in the wrong order. This process continues until no more swaps are needed, meaning the array is sorted.',
      complexity: { operations: 0, comparisons: 0, totalSoFar: 0, notation: 'O(n²)' }
    },
    {
      id: 'step-1',
      description: 'Comparing first two elements: 5 and 3',
      microExplanation: 'Is 5 > 3? Yes! We need to swap',
      highlightedLine: 3,
      highlightElements: ['0', '1'],
      comparedElements: [0, 1],
      visualContent: `
        <div style="display: flex; gap: 10px; justify-content: center;">
          <div style="width: 60px; height: 60px; background: #fbbf24; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; border: 3px solid #f87171;">5</div>
          <div style="width: 60px; height: 60px; background: #fbbf24; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; border: 3px solid #f87171;">3</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">8</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">2</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">1</div>
        </div>
      `,
      duration: 2000,
      variables: { i: 0, j: 0, n: 5, swapped: false, comparing: [5, 3] },
      voiceNarration: 'Comparing 5 and 3. Since 5 is greater than 3, they are in the wrong order and need to be swapped.',
      aiExplanation: 'We compare the first two adjacent elements. Since 5 > 3, they are not in ascending order. The swap operation will place 3 before 5.',
      complexity: { operations: 1, comparisons: 1, totalSoFar: 1 }
    },
    {
      id: 'step-2',
      description: 'Swapping 5 and 3',
      microExplanation: 'Moving 5 to the right, 3 to the left',
      highlightedLine: 4,
      swappedElements: [0, 1],
      visualContent: `
        <div style="display: flex; gap: 10px; justify-content: center;">
          <div style="width: 60px; height: 60px; background: #22d3ee; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; transform: translateX(70px); transition: transform 0.5s;">5</div>
          <div style="width: 60px; height: 60px; background: #22d3ee; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; transform: translateX(-70px); transition: transform 0.5s;">3</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">8</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">2</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">1</div>
        </div>
      `,
      duration: 1500,
      variables: { i: 0, j: 0, n: 5, swapped: true },
      voiceNarration: 'Swapping 5 and 3. The array now becomes 3, 5, 8, 2, 1',
      aiExplanation: 'The swap operation exchanges the positions of 5 and 3. This is the core mechanism of Bubble Sort - moving larger elements towards the end.',
      complexity: { operations: 3, comparisons: 1, totalSoFar: 4 }
    },
    {
      id: 'step-3',
      description: 'Array after first swap',
      microExplanation: 'Now: [3, 5, 8, 2, 1]',
      highlightedLine: 2,
      visualContent: `
        <div style="display: flex; gap: 10px; justify-content: center;">
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">3</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">5</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">8</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">2</div>
          <div style="width: 60px; height: 60px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold;">1</div>
        </div>
      `,
      duration: 1500,
      variables: { i: 0, j: 1, n: 5, swapped: true },
      voiceNarration: 'First swap complete. Moving to next pair.',
      complexity: { operations: 3, comparisons: 1, totalSoFar: 4 }
    },
    // ... More steps would continue here
    {
      id: 'step-final',
      description: 'Array is fully sorted!',
      microExplanation: '✅ Final result: [1, 2, 3, 5, 8]',
      highlightedLine: 8,
      visualContent: `
        <div style="display: flex; gap: 10px; justify-content: center;">
          <div style="width: 60px; height: 60px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; animation: celebrate 0.5s ease;">1</div>
          <div style="width: 60px; height: 60px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; animation: celebrate 0.5s ease 0.1s;">2</div>
          <div style="width: 60px; height: 60px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; animation: celebrate 0.5s ease 0.2s;">3</div>
          <div style="width: 60px; height: 60px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; animation: celebrate 0.5s ease 0.3s;">5</div>
          <div style="width: 60px; height: 60px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; animation: celebrate 0.5s ease 0.4s;">8</div>
        </div>
        <style>
          @keyframes celebrate {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        </style>
      `,
      duration: 2000,
      variables: { i: 4, j: 4, n: 5, swapped: false },
      voiceNarration: 'Sorting complete! The array is now in ascending order.',
      aiExplanation: 'The algorithm has completed. No more swaps are needed, confirming that all elements are in their correct sorted positions.',
      complexity: { operations: 10, comparisons: 10, totalSoFar: 20, notation: 'O(n²)' }
    }
  ],

  // Code Sync (MUST-HAVE #7)
  codeLanguages: [
    {
      language: 'javascript',
      code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      lineMapping: {
        1: 'step-0',
        2: 'step-1',
        3: 'step-1',
        4: 'step-2',
        5: 'step-2'
      }
    },
    {
      language: 'python',
      code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      lineMapping: {}
    },
    {
      language: 'java',
      code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      lineMapping: {}
    }
  ],

  // Common Mistakes (MUST-HAVE #9)
  commonMistakes: [
    {
      id: 'mistake-1',
      title: 'Off-by-One Error in Loop Bounds',
      description: 'Forgetting to reduce the inner loop limit causes unnecessary comparisons of already sorted elements.',
      wrongCode: `for (let j = 0; j < n; j++) { // ❌ Wrong
  // This compares already sorted elements
}`,
      correctCode: `for (let j = 0; j < n - i - 1; j++) { // ✅ Correct
  // Excludes already sorted elements
}`,
      explanation: 'After each pass, the largest element in the unsorted portion "bubbles up" to its correct position. We don\'t need to compare these sorted elements again.',
      howToAvoid: 'Remember: After i passes, the last i elements are already in their final positions. Subtract i from the loop bound.',
      wrongAnimation: [],
      correctAnimation: []
    },
    {
      id: 'mistake-2',
      title: 'Forgetting the Swap',
      description: 'Just comparing without swapping doesn\'t sort the array.',
      wrongCode: `if (arr[j] > arr[j + 1]) {
  // ❌ Nothing happens - no swap!
}`,
      correctCode: `if (arr[j] > arr[j + 1]) {
  // ✅ Swap the elements
  [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
}`,
      explanation: 'Comparison alone doesn\'t change the array. You must actually swap the elements when they\'re out of order.',
      howToAvoid: 'Always implement the swap logic inside the comparison condition. Use a temporary variable or destructuring.',
      wrongAnimation: [],
      correctAnimation: []
    },
    {
      id: 'mistake-3',
      title: 'Not Handling Empty or Single Element Arrays',
      description: 'Edge cases can cause errors if not handled.',
      wrongCode: `function bubbleSort(arr) {
  // ❌ No check for empty or single element
  for (let i = 0; i < arr.length - 1; i++) {
    // ...
  }
}`,
      correctCode: `function bubbleSort(arr) {
  // ✅ Handle edge cases
  if (arr.length <= 1) return arr;
  
  for (let i = 0; i < arr.length - 1; i++) {
    // ...
  }
}`,
      explanation: 'Arrays with 0 or 1 element are already sorted. Checking this upfront prevents unnecessary iterations.',
      howToAvoid: 'Always check edge cases at the start of your algorithm. An array with ≤1 element is already sorted.',
      wrongAnimation: [],
      correctAnimation: []
    }
  ],

  // Key Concepts (Concept Reinforcement Panel)
  keyRules: [
    'Compare adjacent elements and swap if out of order',
    'After each pass, the largest unsorted element reaches its final position',
    'Continue until no more swaps are needed',
    'Time complexity: O(n²) in average and worst case, O(n) in best case (already sorted)'
  ],

  whenToUse: [
    'Educational purposes - easiest sorting algorithm to understand',
    'Small datasets (< 10 elements)',
    'When the array is nearly sorted (optimized version)',
    'When simplicity is more important than performance'
  ],

  whenNotToUse: [
    'Large datasets - O(n²) complexity is too slow',
    'Production systems - use QuickSort, MergeSort, or built-in sort',
    'Real-time applications - unpredictable performance',
    'When space is not a constraint - better algorithms available'
  ],

  interviewUseCases: [
    'Common first question to test basic algorithm knowledge',
    'Asked to optimize with "early termination" check',
    'Used to explain time complexity concepts',
    'Comparison with other sorting algorithms (QuickSort, MergeSort)'
  ],

  // Complexity Visualization (MUST-HAVE #10)
  complexityData: {
    notation: 'O(n²)',
    description: 'Bubble Sort has quadratic time complexity. As the input size doubles, operations roughly quadruple.',
    visualData: {
      inputSize: [5, 10, 20, 40],
      operations: [10, 45, 190, 780]
    },
    bestCase: 'O(n) - when array is already sorted (with optimization)',
    averageCase: 'O(n²) - typical random unsorted array',
    worstCase: 'O(n²) - when array is reverse sorted'
  },

  // User Input Customization (ADVANCED FEATURE #1)
  allowCustomInput: true,
  testCases: [
    {
      input: [1, 2, 3, 4, 5],
      output: [1, 2, 3, 4, 5],
      description: 'Already sorted - best case',
      case: 'best'
    },
    {
      input: [5, 3, 8, 2, 1],
      output: [1, 2, 3, 5, 8],
      description: 'Random unsorted array',
      case: 'average'
    },
    {
      input: [9, 7, 5, 3, 1],
      output: [1, 3, 5, 7, 9],
      description: 'Reverse sorted - worst case',
      case: 'worst'
    },
    {
      input: [],
      output: [],
      description: 'Empty array edge case',
      case: 'custom'
    }
  ],

  // Progressive Difficulty (ADVANCED FEATURE #5)
  difficultyLevels: {
    beginner: true,   // Visual only, no code shown
    intermediate: true, // Code + visual synchronized
    advanced: true    // Optimization + edge cases + complexity analysis
  },

  // Quiz Mode (ADVANCED FEATURE #2)
  predictNextStepQuiz: [
    {
      stepId: 'step-1',
      question: 'After comparing 5 and 3, what should happen next?',
      options: [
        'Move to the next pair without swapping',
        'Swap 5 and 3',
        'The array is sorted',
        'Start over from the beginning'
      ],
      correctAnswer: 1,
      explanation: 'Since 5 > 3, they are out of order. We must swap them to move the larger element (5) towards the end.'
    },
    {
      stepId: 'step-3',
      question: 'What pair should we compare next?',
      options: [
        '3 and 5',
        '5 and 8',
        '8 and 2',
        'Start the next pass'
      ],
      correctAnswer: 1,
      explanation: 'We continue with adjacent pairs. After swapping 5 and 3, the next adjacent pair to compare is 5 and 8.'
    }
  ]
};

// ========================================
// EXAMPLE 2: BINARY SEARCH - Complete Implementation
// ========================================

export const binarySearchAnimation: InteractiveAnimationConfig = {
  id: 'binary-search-animation',
  topicId: 'searching',
  title: 'Binary Search - Divide and Conquer',
  difficulty: 'Medium',

  realLifeAnalogy: {
    id: 'binary-search-analogy',
    title: '📖 Finding a Word in Dictionary',
    description: 'When you search for a word in a dictionary, you don\'t start from page 1. You open to the middle, check if your word comes before or after, and eliminate half the pages. You repeat this process until you find your word.',
    visual: '',
    mapping: [
      {
        concept: 'Sorted Array',
        realLife: 'Dictionary (alphabetically sorted)',
        explanation: 'Just like dictionary words are in alphabetical order, binary search requires a sorted array.'
      },
      {
        concept: 'Middle Element',
        realLife: 'Opening to middle page',
        explanation: 'We always check the middle to decide which half to search next.'
      },
      {
        concept: 'Eliminate Half',
        realLife: 'Ignore left/right half of pages',
        explanation: 'Based on comparison, we discard half the search space every time.'
      }
    ],
    examples: [
      'Guessing a number between 1-100: always guess the middle',
      'Finding a book in a sorted library shelf',
      'Phone book lookup (old school!)',
      'Finding a specific frame in a video timeline'
    ]
  },

  visualLegend: [
    { color: '#22d3ee', label: 'Search Range', meaning: 'Current active search area' },
    { color: '#fbbf24', label: 'Middle', meaning: 'Current middle element being checked' },
    { color: '#10b981', label: 'Found', meaning: 'Target element found!' },
    { color: '#64748b', label: 'Eliminated', meaning: 'No longer in search range' }
  ],

  sampleInput: { arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 7 },
  sampleOutput: 3, // Index of target

  steps: [
    {
      id: 'bs-step-0',
      description: 'Starting binary search for target value 7',
      microExplanation: 'Array is sorted. Search range: entire array',
      highlightedLine: 1,
      visualContent: `
        <div>
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
            <div style="padding: 12px 16px; background: rgba(34, 211, 238, 0.2); border-radius: 8px; color: #22d3ee; border: 2px solid #22d3ee;">
              <div style="font-size: 12px; opacity: 0.8;">TARGET</div>
              <div style="font-size: 24px; font-weight: bold;">7</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            ${[1, 3, 5, 7, 9, 11, 13, 15].map((num, idx) => `
              <div style="width: 50px; height: 50px; background: #22d3ee; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff;">
                <div style="font-size: 11px; opacity: 0.7;">${idx}</div>
                <div style="font-size: 18px; font-weight: bold;">${num}</div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 16px; display: flex; justify-content: center; gap: 20px; color: #94a3b8; font-size: 14px;">
            <div>Left: <span style="color: #22d3ee; font-weight: bold;">0</span></div>
            <div>Right: <span style="color: #22d3ee; font-weight: bold;">7</span></div>
          </div>
        </div>
      `,
      duration: 2500,
      variables: { left: 0, right: 7, mid: null, target: 7 },
      voiceNarration: 'We start binary search with a sorted array of 8 elements. Our target is 7. The search range initially spans from index 0 to 7.',
      aiExplanation: 'Binary Search is efficient because it eliminates half the search space in each iteration, achieving O(log n) time complexity. The array MUST be sorted for this to work.',
      complexity: { operations: 0, comparisons: 0, totalSoFar: 0, notation: 'O(log n)' }
    },
    {
      id: 'bs-step-1',
      description: 'Calculate middle index: (0 + 7) / 2 = 3',
      microExplanation: 'Middle element is arr[3] = 7',
      highlightedLine: 3,
      visualContent: `
        <div>
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
            <div style="padding: 12px 16px; background: rgba(34, 211, 238, 0.2); border-radius: 8px; color: #22d3ee; border: 2px solid #22d3ee;">
              <div style="font-size: 12px; opacity: 0.8;">TARGET</div>
              <div style="font-size: 24px; font-weight: bold;">7</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            ${[1, 3, 5, 7, 9, 11, 13, 15].map((num, idx) => `
              <div style="width: 50px; height: 50px; background: ${idx === 3 ? '#fbbf24' : '#22d3ee'}; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; ${idx === 3 ? 'transform: scale(1.1); border: 3px solid #f87171;' : ''}">
                <div style="font-size: 11px; opacity: 0.7;">${idx}</div>
                <div style="font-size: 18px; font-weight: bold;">${num}</div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 16px; display: flex; justify-content: center; gap: 20px; color: #94a3b8; font-size: 14px;">
            <div>Left: <span style="color: #22d3ee; font-weight: bold;">0</span></div>
            <div>Mid: <span style="color: #fbbf24; font-weight: bold;">3</span></div>
            <div>Right: <span style="color: #22d3ee; font-weight: bold;">7</span></div>
          </div>
        </div>
      `,
      duration: 2000,
      variables: { left: 0, right: 7, mid: 3, target: 7, midValue: 7 },
      comparedElements: [3],
      voiceNarration: 'We calculate the middle index as 3. The middle element is 7.',
      aiExplanation: 'The middle index is calculated using the formula: mid = Math.floor((left + right) / 2). This gives us the center of our current search range.',
      complexity: { operations: 1, comparisons: 0, totalSoFar: 1 }
    },
    {
      id: 'bs-step-2',
      description: 'Compare: target (7) === arr[mid] (7)?',
      microExplanation: 'YES! Target found at index 3 🎉',
      highlightedLine: 4,
      visualContent: `
        <div>
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
            <div style="padding: 12px 16px; background: rgba(16, 185, 129, 0.2); border-radius: 8px; color: #10b981; border: 2px solid #10b981;">
              <div style="font-size: 12px; opacity: 0.8;">TARGET FOUND!</div>
              <div style="font-size: 24px; font-weight: bold;">7 at index 3</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            ${[1, 3, 5, 7, 9, 11, 13, 15].map((num, idx) => `
              <div style="width: 50px; height: 50px; background: ${idx === 3 ? '#10b981' : '#64748b'}; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; ${idx === 3 ? 'animation: celebrate 0.6s ease;' : ''}">
                <div style="font-size: 11px; opacity: 0.7;">${idx}</div>
                <div style="font-size: 18px; font-weight: bold;">${num}</div>
              </div>
            `).join('')}
          </div>
          <style>
            @keyframes celebrate {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.3) rotate(5deg); }
            }
          </style>
        </div>
      `,
      duration: 2500,
      variables: { left: 0, right: 7, mid: 3, target: 7, found: true, result: 3 },
      voiceNarration: 'Perfect! The middle element equals our target. We found 7 at index 3 in just one comparison!',
      aiExplanation: 'This is the best-case scenario for binary search - O(1). The target was exactly in the middle. On average, binary search finds elements in O(log n) comparisons.',
      complexity: { operations: 2, comparisons: 1, totalSoFar: 3, notation: 'O(1) - best case' }
    }
  ],

  codeLanguages: [
    {
      language: 'javascript',
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1; // Not found
}`,
      lineMapping: { 1: 'bs-step-0', 4: 'bs-step-1', 6: 'bs-step-2' }
    },
    {
      language: 'python',
      code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found`,
      lineMapping: {}
    }
  ],

  commonMistakes: [
    {
      id: 'bs-mistake-1',
      title: 'Integer Overflow in Mid Calculation',
      description: 'Using (left + right) / 2 can cause overflow for large values.',
      wrongCode: 'const mid = (left + right) / 2; // ❌ Can overflow',
      correctCode: 'const mid = left + Math.floor((right - left) / 2); // ✅ Safe',
      explanation: 'If left and right are very large numbers, their sum might exceed the maximum integer value, causing overflow.',
      howToAvoid: 'Use the formula: left + (right - left) / 2, which avoids addition of two large numbers.',
      wrongAnimation: [],
      correctAnimation: []
    },
    {
      id: 'bs-mistake-2',
      title: 'Wrong Loop Condition',
      description: 'Using left < right instead of left <= right misses edge cases.',
      wrongCode: 'while (left < right) { // ❌ Misses single element',
      correctCode: 'while (left <= right) { // ✅ Handles all cases',
      explanation: 'When left equals right, there\'s still one element to check. Using < would skip it.',
      howToAvoid: 'Remember: left === right is valid - it means one element remains unchecked.',
      wrongAnimation: [],
      correctAnimation: []
    },
    {
      id: 'bs-mistake-3',
      title: 'Not Handling Unsorted Array',
      description: 'Binary search ONLY works on sorted arrays.',
      wrongCode: `const arr = [5, 2, 8, 1, 9]; // ❌ Unsorted!
binarySearch(arr, 8); // Wrong result`,
      correctCode: `const arr = [1, 2, 5, 8, 9]; // ✅ Sorted
binarySearch(arr, 8); // Correct`,
      explanation: 'Binary search relies on the sorted property to eliminate halves. On unsorted data, it gives incorrect results.',
      howToAvoid: 'Always verify the array is sorted before applying binary search. Sort it first if needed.',
      wrongAnimation: [],
      correctAnimation: []
    }
  ],

  keyRules: [
    'Array MUST be sorted before searching',
    'Always check the middle element',
    'Eliminate half the search space in each step',
    'Time: O(log n), Space: O(1) for iterative version'
  ],

  whenToUse: [
    'Searching in sorted arrays or lists',
    'Large datasets where linear search is too slow',
    'Finding insertion position for new elements',
    'Rotated sorted array problems (with modifications)'
  ],

  whenNotToUse: [
    'Unsorted data (must sort first, which takes O(n log n))',
    'Linked lists (no random access to middle)',
    'Very small arrays (< 10 elements) - linear search is simpler',
    'Data that changes frequently (maintaining sort order is costly)'
  ],

  interviewUseCases: [
    'Find element in sorted array (classic)',
    'First/last occurrence of element',
    'Search in rotated sorted array',
    'Find peak element, square root, etc.'
  ],

  complexityData: {
    notation: 'O(log n)',
    description: 'Binary search has logarithmic complexity. Doubling the input size only adds one more step.',
    visualData: {
      inputSize: [8, 16, 32, 64, 128],
      operations: [3, 4, 5, 6, 7]
    },
    bestCase: 'O(1) - target is at middle on first try',
    averageCase: 'O(log n) - typical search',
    worstCase: 'O(log n) - target at end or not present'
  },

  allowCustomInput: true,
  testCases: [
    {
      input: { arr: [1, 2, 3, 4, 5], target: 3 },
      output: 2,
      description: 'Target in middle - best case',
      case: 'best'
    },
    {
      input: { arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 7 },
      output: 3,
      description: 'Regular search',
      case: 'average'
    },
    {
      input: { arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 15 },
      output: 7,
      description: 'Target at end - worst case',
      case: 'worst'
    },
    {
      input: { arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 6 },
      output: -1,
      description: 'Target not found',
      case: 'custom'
    }
  ],

  difficultyLevels: {
    beginner: true,
    intermediate: true,
    advanced: true
  },

  predictNextStepQuiz: [
    {
      stepId: 'bs-step-1',
      question: 'We found arr[mid] = 7, and target = 7. What should we do?',
      options: [
        'Search in left half',
        'Search in right half',
        'Return the index - we found it!',
        'Continue the loop'
      ],
      correctAnswer: 2,
      explanation: 'When arr[mid] equals the target, we\'ve found it! Return the index immediately.'
    }
  ]
};

// Export all animation configs
export const interactiveAnimations: Record<string, InteractiveAnimationConfig> = {
  'bubble-sort': bubbleSortAnimation,
  'binary-search': binarySearchAnimation,
  // Add more animations here...
};
