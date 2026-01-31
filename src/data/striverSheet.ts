import type { Problem } from '../types';

// Comprehensive Striver DSA Sheet - Topic-wise problems
export const striverSheet: Problem[] = [
  // Arrays & Strings
  {
    id: 'arr-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/two-sum/',
    topicId: 'arrays-strings',
    patterns: ['Hash Map', 'Array'],
    companies: ['Amazon', 'Google', 'Microsoft']
  },
  {
    id: 'arr-2',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    topicId: 'arrays-strings',
    patterns: ['Greedy', 'Kadane'],
    companies: ['Facebook', 'Amazon']
  },
  {
    id: 'arr-3',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/contains-duplicate/',
    topicId: 'arrays-strings',
    patterns: ['Hash Set', 'Sorting']
  },
  {
    id: 'arr-4',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    topicId: 'arrays-strings',
    patterns: ['Prefix Sum', 'Array'],
    companies: ['Facebook', 'Amazon', 'Microsoft']
  },
  {
    id: 'arr-5',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    topicId: 'arrays-strings',
    patterns: ['Kadane', 'Dynamic Programming'],
    companies: ['Amazon', 'LinkedIn']
  },
  {
    id: 'arr-6',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/merge-intervals/',
    topicId: 'arrays-strings',
    patterns: ['Sorting', 'Intervals'],
    companies: ['Facebook', 'Google', 'Amazon']
  },
  {
    id: 'arr-7',
    title: '3Sum',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/3sum/',
    topicId: 'arrays-strings',
    patterns: ['Two Pointers', 'Sorting'],
    companies: ['Facebook', 'Amazon']
  },
  {
    id: 'arr-8',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    topicId: 'arrays-strings',
    patterns: ['Two Pointers', 'Greedy']
  },
  {
    id: 'arr-9',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
    topicId: 'arrays-strings',
    patterns: ['Two Pointers', 'Stack'],
    companies: ['Amazon', 'Google', 'Apple']
  },
  {
    id: 'arr-10',
    title: 'First Missing Positive',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/first-missing-positive/',
    topicId: 'arrays-strings',
    patterns: ['Array', 'Hash Map']
  },

  // Recursion & Backtracking
  {
    id: 'rec-1',
    title: 'Subsets',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/subsets/',
    topicId: 'recursion-backtracking',
    patterns: ['Backtracking', 'Recursion'],
    companies: ['Facebook', 'Amazon']
  },
  {
    id: 'rec-2',
    title: 'Permutations',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/permutations/',
    topicId: 'recursion-backtracking',
    patterns: ['Backtracking', 'Recursion']
  },
  {
    id: 'rec-3',
    title: 'Combination Sum',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/combination-sum/',
    topicId: 'recursion-backtracking',
    patterns: ['Backtracking', 'Recursion'],
    companies: ['Amazon', 'Airbnb']
  },
  {
    id: 'rec-4',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/generate-parentheses/',
    topicId: 'recursion-backtracking',
    patterns: ['Backtracking', 'Recursion']
  },
  {
    id: 'rec-5',
    title: 'Word Search',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/word-search/',
    topicId: 'recursion-backtracking',
    patterns: ['Backtracking', 'DFS'],
    companies: ['Microsoft', 'Amazon']
  },
  {
    id: 'rec-6',
    title: 'N-Queens',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/n-queens/',
    topicId: 'recursion-backtracking',
    patterns: ['Backtracking', 'Recursion'],
    companies: ['Google', 'Amazon']
  },

  // Linked Lists
  {
    id: 'll-1',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    topicId: 'linked-lists',
    patterns: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Apple']
  },
  {
    id: 'll-2',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    topicId: 'linked-lists',
    patterns: ['Linked List', 'Recursion']
  },
  {
    id: 'll-3',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    topicId: 'linked-lists',
    patterns: ['Two Pointers', 'Floyd Cycle']
  },
  {
    id: 'll-4',
    title: 'Remove Nth Node From End',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    topicId: 'linked-lists',
    patterns: ['Two Pointers', 'Linked List']
  },
  {
    id: 'll-5',
    title: 'Reorder List',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/reorder-list/',
    topicId: 'linked-lists',
    patterns: ['Linked List', 'Two Pointers'],
    companies: ['Facebook', 'Microsoft']
  },
  {
    id: 'll-6',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
    topicId: 'linked-lists',
    patterns: ['Linked List', 'Hash Map'],
    companies: ['Amazon', 'Microsoft']
  },
  {
    id: 'll-7',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    topicId: 'linked-lists',
    patterns: ['Heap', 'Divide & Conquer'],
    companies: ['Amazon', 'Google', 'Facebook']
  },

  // Stacks & Queues
  {
    id: 'sq-1',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    topicId: 'stacks-queues',
    patterns: ['Stack'],
    companies: ['Amazon', 'Google', 'Facebook']
  },
  {
    id: 'sq-2',
    title: 'Min Stack',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/min-stack/',
    topicId: 'stacks-queues',
    patterns: ['Stack', 'Design'],
    companies: ['Amazon', 'Bloomberg']
  },
  {
    id: 'sq-3',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    topicId: 'stacks-queues',
    patterns: ['Monotonic Stack'],
    companies: ['Amazon']
  },
  {
    id: 'sq-4',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    topicId: 'stacks-queues',
    patterns: ['Monotonic Stack'],
    companies: ['Amazon', 'Google']
  },

  // Trees
  {
    id: 'tree-1',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    topicId: 'trees',
    patterns: ['DFS', 'BFS'],
    companies: ['LinkedIn', 'Amazon']
  },
  {
    id: 'tree-2',
    title: 'Same Tree',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/same-tree/',
    topicId: 'trees',
    patterns: ['DFS', 'Recursion']
  },
  {
    id: 'tree-3',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    topicId: 'trees',
    patterns: ['DFS', 'Recursion'],
    companies: ['Google']
  },
  {
    id: 'tree-4',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    topicId: 'trees',
    patterns: ['BFS', 'Queue'],
    companies: ['Facebook', 'Amazon']
  },
  {
    id: 'tree-5',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    topicId: 'trees',
    patterns: ['DFS', 'BST'],
    companies: ['Amazon', 'Facebook', 'Microsoft']
  },
  {
    id: 'tree-6',
    title: 'Lowest Common Ancestor of BST',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    topicId: 'trees',
    patterns: ['BST', 'DFS']
  },
  {
    id: 'tree-7',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    topicId: 'trees',
    patterns: ['DFS', 'Recursion'],
    companies: ['Facebook', 'Amazon']
  },
  {
    id: 'tree-8',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    topicId: 'trees',
    patterns: ['DFS', 'BFS', 'Design'],
    companies: ['Amazon', 'Google', 'Microsoft']
  },

  // Graphs
  {
    id: 'graph-1',
    title: 'Number of Islands',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/number-of-islands/',
    topicId: 'graphs',
    patterns: ['DFS', 'BFS', 'Union Find'],
    companies: ['Amazon', 'Facebook', 'Google']
  },
  {
    id: 'graph-2',
    title: 'Clone Graph',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/clone-graph/',
    topicId: 'graphs',
    patterns: ['DFS', 'BFS', 'Hash Map']
  },
  {
    id: 'graph-3',
    title: 'Course Schedule',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/course-schedule/',
    topicId: 'graphs',
    patterns: ['Topological Sort', 'DFS'],
    companies: ['Amazon', 'Google']
  },
  {
    id: 'graph-4',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
    topicId: 'graphs',
    patterns: ['DFS', 'BFS']
  },
  {
    id: 'graph-5',
    title: 'Word Ladder',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/word-ladder/',
    topicId: 'graphs',
    patterns: ['BFS', 'Graph'],
    companies: ['Amazon', 'Facebook']
  },

  // Dynamic Programming
  {
    id: 'dp-1',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/climbing-stairs/',
    topicId: 'dynamic-programming',
    patterns: ['DP', 'Fibonacci'],
    companies: ['Amazon', 'Adobe']
  },
  {
    id: 'dp-2',
    title: 'House Robber',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/house-robber/',
    topicId: 'dynamic-programming',
    patterns: ['DP', 'Array'],
    companies: ['Amazon', 'Airbnb']
  },
  {
    id: 'dp-3',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    topicId: 'dynamic-programming',
    patterns: ['DP', 'Binary Search'],
    companies: ['Microsoft', 'Amazon']
  },
  {
    id: 'dp-4',
    title: 'Coin Change',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/coin-change/',
    topicId: 'dynamic-programming',
    patterns: ['DP', 'Unbounded Knapsack'],
    companies: ['Amazon', 'Uber']
  },
  {
    id: 'dp-5',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/longest-common-subsequence/',
    topicId: 'dynamic-programming',
    patterns: ['DP', '2D DP']
  },
  {
    id: 'dp-6',
    title: 'Word Break',
    difficulty: 'Medium',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/word-break/',
    topicId: 'dynamic-programming',
    patterns: ['DP', 'Trie'],
    companies: ['Google', 'Amazon', 'Facebook']
  },
  {
    id: 'dp-7',
    title: 'Edit Distance',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/edit-distance/',
    topicId: 'dynamic-programming',
    patterns: ['DP', '2D DP'],
    companies: ['Google', 'Amazon']
  },
  {
    id: 'dp-8',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/regular-expression-matching/',
    topicId: 'dynamic-programming',
    patterns: ['DP', 'Recursion'],
    companies: ['Facebook', 'Google']
  }
];
