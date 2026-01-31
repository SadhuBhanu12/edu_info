// Pattern Recognition & Mastery System

export const DSA_PATTERNS = {
  // Arrays & Strings
  'Two Pointers': {
    description: 'Use two pointers to traverse array from both ends or different speeds',
    difficulty: 'Easy',
    examples: ['Container With Most Water', 'Remove Duplicates', '3Sum'],
    keyIndicators: ['sorted array', 'find pair', 'remove duplicates', 'palindrome']
  },
  'Sliding Window': {
    description: 'Maintain a window of elements and slide it across the array',
    difficulty: 'Medium',
    examples: ['Longest Substring Without Repeating', 'Maximum Sum Subarray'],
    keyIndicators: ['substring', 'subarray', 'consecutive', 'maximum/minimum window']
  },
  'Fast & Slow Pointers': {
    description: 'Two pointers moving at different speeds to detect cycles',
    difficulty: 'Medium',
    examples: ['Linked List Cycle', 'Find Duplicate Number'],
    keyIndicators: ['cycle detection', 'linked list', 'middle element']
  },
  
  // Searching & Sorting
  'Binary Search': {
    description: 'Divide search space in half repeatedly',
    difficulty: 'Medium',
    examples: ['Search in Rotated Array', 'Find Peak Element'],
    keyIndicators: ['sorted', 'search', 'O(log n)', 'find position']
  },
  'Binary Search on Answer': {
    description: 'Binary search on the range of possible answers',
    difficulty: 'Hard',
    examples: ['Koko Eating Bananas', 'Minimum Days to Make Bouquets'],
    keyIndicators: ['minimize maximum', 'maximize minimum', 'feasibility check']
  },
  
  // Dynamic Programming
  'DP - Linear': {
    description: '1D DP where each state depends on previous states',
    difficulty: 'Medium',
    examples: ['House Robber', 'Climbing Stairs', 'Longest Increasing Subsequence'],
    keyIndicators: ['maximize', 'count ways', 'sequence', 'contiguous subarray']
  },
  'DP - 2D Grid': {
    description: '2D DP for grid-based problems',
    difficulty: 'Hard',
    examples: ['Unique Paths', 'Minimum Path Sum', 'Edit Distance'],
    keyIndicators: ['grid', 'matrix', 'paths', '2D array']
  },
  'DP - Knapsack': {
    description: 'Choose subset of items with constraints',
    difficulty: 'Hard',
    examples: ['0/1 Knapsack', 'Partition Equal Subset Sum'],
    keyIndicators: ['subset', 'capacity', 'weight', 'value', 'choose items']
  },
  'DP - Subsequence': {
    description: 'Find optimal subsequence satisfying conditions',
    difficulty: 'Hard',
    examples: ['Longest Common Subsequence', 'Palindromic Subsequence'],
    keyIndicators: ['subsequence', 'common', 'longest', 'two strings']
  },
  
  // Graphs
  'DFS': {
    description: 'Depth-first traversal for graph exploration',
    difficulty: 'Medium',
    examples: ['Number of Islands', 'Course Schedule'],
    keyIndicators: ['connected components', 'cycle detection', 'backtracking']
  },
  'BFS': {
    description: 'Level-by-level traversal for shortest paths',
    difficulty: 'Medium',
    examples: ['Word Ladder', 'Shortest Path in Binary Matrix'],
    keyIndicators: ['shortest path', 'level order', 'minimum steps']
  },
  'Topological Sort': {
    description: 'Linear ordering of vertices in a DAG',
    difficulty: 'Hard',
    examples: ['Course Schedule II', 'Alien Dictionary'],
    keyIndicators: ['prerequisites', 'dependencies', 'ordering']
  },
  
  // Trees
  'Tree Traversal': {
    description: 'Traverse tree in specific order (inorder, preorder, postorder)',
    difficulty: 'Easy',
    examples: ['Binary Tree Inorder', 'Level Order Traversal'],
    keyIndicators: ['traverse', 'visit all nodes', 'order']
  },
  'Binary Search Tree': {
    description: 'Leverage BST property (left < root < right)',
    difficulty: 'Medium',
    examples: ['Validate BST', 'Kth Smallest Element'],
    keyIndicators: ['BST', 'sorted', 'kth element']
  },
  
  // Greedy
  'Greedy': {
    description: 'Make locally optimal choice at each step',
    difficulty: 'Medium',
    examples: ['Jump Game', 'Meeting Rooms', 'Activity Selection'],
    keyIndicators: ['maximize', 'minimize', 'intervals', 'scheduling']
  },
  
  // Advanced
  'Monotonic Stack': {
    description: 'Maintain stack in monotonic order',
    difficulty: 'Hard',
    examples: ['Next Greater Element', 'Largest Rectangle in Histogram'],
    keyIndicators: ['next greater', 'next smaller', 'span']
  },
  'Union Find': {
    description: 'Track disjoint sets and merge them',
    difficulty: 'Hard',
    examples: ['Number of Provinces', 'Redundant Connection'],
    keyIndicators: ['connected components', 'disjoint sets', 'merge']
  },
  'Trie': {
    description: 'Prefix tree for string operations',
    difficulty: 'Medium',
    examples: ['Implement Trie', 'Word Search II'],
    keyIndicators: ['prefix', 'autocomplete', 'dictionary', 'word search']
  },
  'Backtracking': {
    description: 'Explore all possibilities with pruning',
    difficulty: 'Hard',
    examples: ['N-Queens', 'Sudoku Solver', 'Permutations'],
    keyIndicators: ['all combinations', 'all permutations', 'generate', 'constraints']
  }
} as const;

export type PatternName = keyof typeof DSA_PATTERNS;

export interface PatternMastery {
  patternName: PatternName;
  totalProblems: number;
  solvedProblems: number;
  masteryScore: number; // 0-100
  lastPracticed: string | null;
  averageConfidence: number;
  problemIds: string[];
}

export function calculatePatternMastery(
  solvedCount: number,
  totalCount: number,
  avgConfidence: number
): number {
  const completionScore = (solvedCount / totalCount) * 60; // 60%
  const confidenceScore = (avgConfidence / 5) * 40; // 40%
  return Math.round(completionScore + confidenceScore);
}

export function getPatternDifficulty(patternName: PatternName): 'Easy' | 'Medium' | 'Hard' {
  return DSA_PATTERNS[patternName].difficulty as 'Easy' | 'Medium' | 'Hard';
}

export function recommendNextPattern(
  masteryMap: Map<PatternName, PatternMastery>
): PatternName | null {
  // Recommend pattern with lowest mastery score that has some problems solved
  let lowestScore = 100;
  let recommended: PatternName | null = null;

  for (const [pattern, mastery] of masteryMap.entries()) {
    if (mastery.solvedProblems > 0 && mastery.masteryScore < lowestScore) {
      lowestScore = mastery.masteryScore;
      recommended = pattern;
    }
  }

  // If no patterns started, recommend an easy one
  if (!recommended) {
    return 'Two Pointers';
  }

  return recommended;
}
