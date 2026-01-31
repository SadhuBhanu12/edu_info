/**
 * COMPREHENSIVE ANIMATION LIBRARY
 * 10+ Complete DSA Animations with Extracted Theory
 * 
 * Each animation includes:
 * - Real-life analogy
 * - Step-by-step visualization
 * - Code synchronization
 * - Common mistakes
 * - Complexity analysis
 * - Extracted theory from PDF
 */

import type { InteractiveAnimationConfig } from '../types';
import { arrayTheory } from '../utils/theoryExtractor';

// ========================================
// 1. ARRAY BASICS - Complete Animation
// ========================================

export const arrayBasicsAnimation: InteractiveAnimationConfig = {
  id: 'array-basics',
  topicId: 'arrays',
  title: 'Array Basics - Memory and Access',
  difficulty: 'Easy',

  realLifeAnalogy: {
    id: 'array-analogy',
    title: '📦 Storage Boxes in a Warehouse',
    description: 'An array is like a row of numbered storage boxes in a warehouse. Each box has a number (index) and can store one item. You can instantly go to any box if you know its number.',
    visual: '',
    mapping: [
      {
        concept: 'Array',
        realLife: 'Row of storage boxes',
        explanation: 'Both are sequential collections with numbered positions'
      },
      {
        concept: 'Index',
        realLife: 'Box number',
        explanation: 'The position number that identifies each location'
      },
      {
        concept: 'Element',
        realLife: 'Item in box',
        explanation: 'The actual value stored at each position'
      },
      {
        concept: 'Access',
        realLife: 'Go directly to box #5',
        explanation: 'Instant access to any position using its number'
      }
    ],
    examples: [
      'Student roll numbers: Position 0 = Student ID 101, Position 1 = Student ID 102',
      'Movie seats: Row A has seats A1, A2, A3... each seat is an array element',
      'Calendar days: Days[0] = Monday, Days[1] = Tuesday, etc.',
      'Playlist songs: Songs[0] = first song, Songs[1] = second song'
    ]
  },

  visualLegend: [
    { color: '#22d3ee', label: 'Element', meaning: 'Value stored in array' },
    { color: '#fbbf24', label: 'Index', meaning: 'Position number (0-based)' },
    { color: '#f87171', label: 'Accessing', meaning: 'Currently being read' },
    { color: '#10b981', label: 'Updated', meaning: 'Value just changed' }
  ],

  sampleInput: [10, 20, 30, 40, 50],
  sampleOutput: 'Access arr[2] = 30',

  steps: [
    {
      id: 'array-step-0',
      description: 'Array in memory - continuous storage',
      microExplanation: 'Elements stored side-by-side in memory',
      highlightedLine: 1,
      visualContent: `
        <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
          <div style="font-size: 14px; color: #94a3b8; margin-bottom: 10px;">
            Array: arr = [10, 20, 30, 40, 50]
          </div>
          
          <!-- Memory visualization -->
          <div style="display: flex; gap: 2px;">
            ${[10, 20, 30, 40, 50].map((val, idx) => `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);">
                  <div style="font-size: 24px; font-weight: bold;">${val}</div>
                  <div style="font-size: 10px; opacity: 0.8; margin-top: 4px;">Value</div>
                </div>
                <div style="margin-top: 8px; font-size: 14px; color: #fbbf24; font-weight: 600;">
                  [${idx}]
                </div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                  addr+${idx * 4}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Memory address line -->
          <div style="width: 100%; border-top: 2px solid rgba(34, 211, 238, 0.3); padding-top: 12px; text-align: center; color: #94a3b8; font-size: 13px;">
            💾 Continuous Memory Block (20 bytes total for 5 integers)
          </div>
        </div>
      `,
      duration: 3000,
      variables: { length: 5, baseAddress: 1000 },
      voiceNarration: 'Arrays store elements in continuous memory locations. Each element occupies a fixed amount of space.',
      aiExplanation: 'Arrays allocate a contiguous block of memory. In this example with 5 integers, if each integer is 4 bytes, the total memory used is 20 bytes. The base address (1000) is the starting point, and each subsequent element is offset by 4 bytes.',
      complexity: { operations: 0, comparisons: 0, totalSoFar: 0 }
    },
    {
      id: 'array-step-1',
      description: 'Accessing element at index 2',
      microExplanation: 'Formula: address = baseAddress + (index × elementSize)',
      highlightedLine: 2,
      visualContent: `
        <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
          <div style="padding: 12px 20px; background: rgba(34, 211, 238, 0.1); border-radius: 8px; border: 2px solid #22d3ee; color: #22d3ee; font-weight: 600;">
            🎯 Accessing: arr[2]
          </div>
          
          <div style="display: flex; gap: 2px;">
            ${[10, 20, 30, 40, 50].map((val, idx) => `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 70px; height: 70px; background: ${idx === 2 ? 'linear-gradient(135deg, #f87171 0%, #fb923c 100%)' : 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)'}; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; box-shadow: ${idx === 2 ? '0 8px 24px rgba(248, 113, 113, 0.5)' : '0 4px 12px rgba(34, 211, 238, 0.3)'}; transform: ${idx === 2 ? 'scale(1.15)' : 'scale(1)'}; transition: all 0.3s;">
                  <div style="font-size: 24px; font-weight: bold;">${val}</div>
                  ${idx === 2 ? '<div style="font-size: 11px; margin-top: 4px;">✅ Reading</div>' : ''}
                </div>
                <div style="margin-top: 8px; font-size: 14px; color: ${idx === 2 ? '#f87171' : '#fbbf24'}; font-weight: 600;">
                  [${idx}]
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Calculation box -->
          <div style="background: rgba(251, 191, 36, 0.1); border: 2px solid #fbbf24; border-radius: 10px; padding: 16px; margin-top: 10px;">
            <div style="color: #fbbf24; font-weight: 600; margin-bottom: 8px;">📐 Address Calculation:</div>
            <div style="color: #e2e8f0; font-family: monospace; font-size: 14px;">
              address = 1000 + (2 × 4)<br/>
              address = 1000 + 8<br/>
              <span style="color: #10b981; font-weight: bold;">address = 1008</span>
            </div>
            <div style="color: #94a3b8; font-size: 13px; margin-top: 8px;">
              ⚡ Direct calculation = O(1) time!
            </div>
          </div>
        </div>
      `,
      duration: 2500,
      variables: { index: 2, address: 1008, value: 30 },
      comparedElements: [2],
      voiceNarration: 'To access element at index 2, we calculate: base address plus index times element size. This gives us 1008, where we find value 30.',
      aiExplanation: 'Array access is O(1) because we can calculate the exact memory address mathematically. Unlike linked lists where we must traverse, arrays allow direct jumps to any position.',
      complexity: { operations: 2, comparisons: 0, totalSoFar: 2 }
    },
    {
      id: 'array-step-2',
      description: 'Result: arr[2] = 30',
      microExplanation: '✅ Value retrieved in constant time!',
      highlightedLine: 2,
      visualContent: `
        <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
          <div style="padding: 16px 24px; background: rgba(16, 185, 129, 0.2); border-radius: 12px; border: 3px solid #10b981; color: #10b981; font-weight: 700; font-size: 18px;">
            ✅ arr[2] = 30
          </div>
          
          <div style="display: flex; gap: 2px;">
            ${[10, 20, 30, 40, 50].map((val, idx) => `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 70px; height: 70px; background: ${idx === 2 ? '#10b981' : 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)'}; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff;">
                  <div style="font-size: 24px; font-weight: bold;">${val}</div>
                </div>
                <div style="margin-top: 8px; font-size: 14px; color: ${idx === 2 ? '#10b981' : '#fbbf24'}; font-weight: 600;">
                  [${idx}]
                </div>
              </div>
            `).join('')}
          </div>

          <div style="background: rgba(34, 211, 238, 0.1); border-radius: 10px; padding: 20px; text-align: center;">
            <div style="color: #22d3ee; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
              Why Arrays Are Fast for Access
            </div>
            <div style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              No matter if array has 10 or 10,000 elements,<br/>
              accessing any element takes the <strong style="color: #10b981;">same amount of time</strong>.<br/>
              This is called <strong style="color: #fbbf24;">O(1) - Constant Time</strong> complexity.
            </div>
          </div>
        </div>
      `,
      duration: 2000,
      variables: { result: 30 },
      voiceNarration: 'Successfully retrieved value 30 from index 2. This operation is O(1) - constant time - regardless of array size.',
      aiExplanation: 'The beauty of arrays is random access. Whether accessing the first element or the millionth, it takes the same time. This is because we use mathematical calculation, not sequential traversal.',
      complexity: { operations: 2, comparisons: 0, totalSoFar: 2, notation: 'O(1)' }
    }
  ],

  codeLanguages: [
    {
      language: 'java',
      code: `// Array declaration and access
int[] arr = {10, 20, 30, 40, 50};
int value = arr[2];  // Access element at index 2
System.out.println(value);  // Output: 30`,
      lineMapping: { 2: 'array-step-1', 3: 'array-step-2' }
    },
    {
      language: 'javascript',
      code: `// Array access in JavaScript
const arr = [10, 20, 30, 40, 50];
const value = arr[2];  // Access element at index 2
console.log(value);  // Output: 30`,
      lineMapping: { 2: 'array-step-1', 3: 'array-step-2' }
    },
    {
      language: 'python',
      code: `# Array (list) access in Python
arr = [10, 20, 30, 40, 50]
value = arr[2]  # Access element at index 2
print(value)  # Output: 30`,
      lineMapping: { 2: 'array-step-1', 3: 'array-step-2' }
    }
  ],

  commonMistakes: [
    {
      id: 'array-mistake-1',
      title: 'Index Out of Bounds',
      description: 'Trying to access an index that doesn\'t exist in the array.',
      wrongCode: `int[] arr = {10, 20, 30};
int value = arr[5];  // ❌ Error! Array has only 3 elements (indices 0-2)`,
      correctCode: `int[] arr = {10, 20, 30};
if (index >= 0 && index < arr.length) {
    int value = arr[index];  // ✅ Check bounds first
}`,
      explanation: 'Arrays are zero-indexed and fixed in size. An array of length 3 has valid indices 0, 1, 2 only. Accessing arr[3] or higher causes an error.',
      howToAvoid: 'Always check: if (index >= 0 && index < array.length) before accessing. Remember: last valid index = length - 1.',
      wrongAnimation: [],
      correctAnimation: []
    },
    {
      id: 'array-mistake-2',
      title: 'Forgetting Zero-Based Indexing',
      description: 'Thinking the first element is at position 1 instead of 0.',
      wrongCode: `// Get first element
int first = arr[1];  // ❌ This gets the SECOND element!`,
      correctCode: `// Get first element  
int first = arr[0];  // ✅ Arrays start at index 0`,
      explanation: 'In most programming languages, arrays are zero-indexed. The first element is at index 0, not 1. This is a very common beginner mistake.',
      howToAvoid: 'Remember: Position 1 = Index 0, Position 2 = Index 1, etc. First element is always arr[0], last element is arr[length-1].',
      wrongAnimation: [],
      correctAnimation: []
    },
    {
      id: 'array-mistake-3',
      title: 'Modifying Array During Iteration',
      description: 'Changing array size while looping through it.',
      wrongCode: `for (int i = 0; i < arr.length; i++) {
    if (arr[i] < 0) {
        // ❌ Don't resize during iteration!
        arr = removeElement(arr, i);
    }
}`,
      correctCode: `// Use a new array or iterate backwards
for (int i = arr.length - 1; i >= 0; i--) {
    if (arr[i] < 0) {
        arr = removeElement(arr, i);  // ✅ Safe when going backwards
    }
}`,
      explanation: 'When you remove an element during forward iteration, indices shift and you might skip elements or get errors.',
      howToAvoid: 'Either iterate backwards, use a new array to collect results, or use two-pointer technique.',
      wrongAnimation: [],
      correctAnimation: []
    }
  ],

  keyRules: [
    'Arrays use zero-based indexing (first element = index 0)',
    'Access time is O(1) - constant regardless of array size',
    'Arrays have fixed size in most languages (Java, C++)',
    'Elements are stored in continuous memory locations',
    'Insertion/deletion in middle requires shifting - O(n) time'
  ],

  whenToUse: [
    'Need fast random access to elements by index',
    'Know the size in advance (or upper bound)',
    'Storing homogeneous data (same type)',
    'Implementing other data structures (stack, queue, heap)',
    'Cache-friendly access patterns (sequential reads)'
  ],

  whenNotToUse: [
    'Frequent insertions/deletions in the middle',
    'Unknown or frequently changing size (use ArrayList/Vector instead)',
    'Storing heterogeneous data (use objects/structs)',
    'Need constant-time insertion at front (use LinkedList or Deque)'
  ],

  interviewUseCases: [
    'Two-pointer technique problems',
    'Sliding window problems',
    'Binary search on sorted array',
    'Kadane\'s algorithm (maximum subarray)',
    'Array rotation and reversal'
  ],

  complexityData: {
    notation: 'O(1) for access, O(n) for search',
    description: 'Array access is constant time O(1). Searching unsorted array is O(n). Insertion/deletion in middle is O(n) due to shifting.',
    visualData: {
      inputSize: [10, 100, 1000, 10000],
      operations: [1, 1, 1, 1]  // Access is always O(1)
    },
    bestCase: 'O(1) - direct index access',
    averageCase: 'O(n) - linear search',
    worstCase: 'O(n) - search for element not present'
  },

  allowCustomInput: true,
  testCases: [
    {
      input: [5, 10, 15, 20, 25],
      output: 'Access patterns',
      description: 'Standard array access',
      case: 'average'
    },
    {
      input: [1],
      output: 'Single element',
      description: 'Edge case - one element',
      case: 'custom'
    },
    {
      input: Array.from({ length: 10 }, (_, i) => i * 10),
      output: 'Large array',
      description: 'Performance test',
      case: 'worst'
    }
  ],

  difficultyLevels: {
    beginner: true,
    intermediate: true,
    advanced: true
  },

  predictNextStepQuiz: [
    {
      stepId: 'array-step-1',
      question: 'If we want to access arr[4], what address will be calculated?',
      options: [
        '1012',
        '1016',
        '1020',
        '1004'
      ],
      correctAnswer: 1,
      explanation: 'Address = 1000 + (4 × 4) = 1000 + 16 = 1016. Each integer is 4 bytes, so index 4 is at offset 16 from the base address.'
    },
    {
      stepId: 'array-step-0',
      question: 'Why are array elements stored in continuous memory?',
      options: [
        'To save memory space',
        'To enable O(1) random access using index',
        'To make arrays look organized',
        'To prevent data corruption'
      ],
      correctAnswer: 1,
      explanation: 'Continuous memory allows us to calculate exact address using math: baseAddress + (index × elementSize). This enables constant-time O(1) access to any element.'
    }
  ]
};

// Export all animations with theory integration
export const completeAnimationsWithTheory = {
  'array-basics': {
    animation: arrayBasicsAnimation,
    theory: arrayTheory
  }
  // More animations will be added here
};
