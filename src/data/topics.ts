import type { Topic, Problem } from '../types';

export const topics: Topic[] = [
  {
    id: 'arrays',
    name: 'Arrays',
    description: 'Master array manipulation, traversal, and common patterns',
    icon: 'LayoutGrid',
    color: '#3B82F6',
    order: 1,
    estimatedHours: 15,
    prerequisites: [],
    theory: {
      overview: 'Arrays are fundamental data structures that store elements in contiguous memory locations. They provide O(1) access time and are the building block for many algorithms.',
      sections: [
        {
          id: 'arrays-intro',
          title: 'Introduction to Arrays',
          content: 'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together.',
          codeExample: `// Array declaration and initialization
const arr: number[] = [1, 2, 3, 4, 5];

// Accessing elements - O(1)
console.log(arr[0]); // 1

// Modifying elements - O(1)
arr[2] = 10;`,
          complexity: { time: 'O(1) access', space: 'O(n)' }
        },
        {
          id: 'arrays-techniques',
          title: 'Two Pointer Technique',
          content: 'Two pointers is a technique where two pointers iterate through the data structure in tandem until one or both pointers hit a certain condition.',
          codeExample: `function twoSum(arr: number[], target: number): [number, number] {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
          complexity: { time: 'O(n)', space: 'O(1)' }
        },
        {
          id: 'arrays-sliding',
          title: 'Sliding Window',
          content: 'The sliding window technique is used to perform operations on a specific window size of an array or string.',
          codeExample: `function maxSumSubarray(arr: number[], k: number): number {
  let maxSum = 0, windowSum = 0;
  
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
          complexity: { time: 'O(n)', space: 'O(1)' }
        }
      ],
      interviewTips: [
        'Always clarify if the array is sorted',
        'Consider edge cases: empty array, single element, duplicates',
        'Think about in-place modifications to save space',
        'Two pointers and sliding window are your best friends'
      ],
      commonMistakes: [
        'Off-by-one errors in loop bounds',
        'Not handling empty arrays',
        'Modifying array while iterating'
      ]
    },
    problemIds: ['arr-1', 'arr-2', 'arr-3', 'arr-4', 'arr-5', 'arr-6']
  },
  {
    id: 'strings',
    name: 'Strings',
    description: 'String manipulation, pattern matching, and character operations',
    icon: 'Type',
    color: '#10B981',
    order: 2,
    estimatedHours: 12,
    prerequisites: ['arrays'],
    theory: {
      overview: 'Strings are sequences of characters. Understanding string manipulation is crucial for many coding problems.',
      sections: [
        {
          id: 'strings-basics',
          title: 'String Basics',
          content: 'Strings in JavaScript/TypeScript are immutable. Every modification creates a new string.',
          codeExample: `const str = "hello";
// String methods
str.charAt(0);      // 'h'
str.substring(1,3); // 'el'
str.split('');      // ['h','e','l','l','o']
str.toUpperCase();  // 'HELLO'`,
          complexity: { time: 'O(n) for most operations', space: 'O(n)' }
        },
        {
          id: 'strings-patterns',
          title: 'Common Patterns',
          content: 'Palindrome checking, anagram detection, and substring search are common patterns.',
          codeExample: `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++; right--;
  }
  return true;
}`,
          complexity: { time: 'O(n)', space: 'O(n)' }
        }
      ],
      interviewTips: [
        'Consider case sensitivity',
        'Handle special characters and spaces',
        'Use character frequency maps for anagrams'
      ],
      commonMistakes: [
        'Forgetting string immutability',
        'Not handling unicode characters',
        'Inefficient string concatenation in loops'
      ]
    },
    problemIds: ['str-1', 'str-2', 'str-3', 'str-4', 'str-5']
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    description: 'Singly and doubly linked lists, pointer manipulation',
    icon: 'Link',
    color: '#8B5CF6',
    order: 3,
    estimatedHours: 10,
    prerequisites: [],
    theory: {
      overview: 'Linked lists are linear data structures where elements are stored in nodes, with each node pointing to the next.',
      sections: [
        {
          id: 'll-basics',
          title: 'Linked List Basics',
          content: 'Unlike arrays, linked lists do not store elements in contiguous memory. Each node contains data and a reference to the next node.',
          codeExample: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

// Create linked list: 1 -> 2 -> 3
const head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);`,
          complexity: { time: 'O(n) search, O(1) insert/delete', space: 'O(n)' }
        },
        {
          id: 'll-techniques',
          title: 'Fast & Slow Pointers',
          content: 'The tortoise and hare algorithm uses two pointers moving at different speeds to solve cycle detection and middle-finding problems.',
          codeExample: `function findMiddle(head: ListNode): ListNode {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  return slow;
}

function hasCycle(head: ListNode): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
          complexity: { time: 'O(n)', space: 'O(1)' }
        }
      ],
      interviewTips: [
        'Draw the pointers on paper',
        'Use dummy nodes to simplify edge cases',
        'Always handle null/empty lists'
      ],
      commonMistakes: [
        'Losing reference to head',
        'Not handling null pointers',
        'Infinite loops in cycle problems'
      ]
    },
    problemIds: ['ll-1', 'll-2', 'll-3', 'll-4', 'll-5']
  },
  {
    id: 'stacks-queues',
    name: 'Stacks & Queues',
    description: 'LIFO and FIFO data structures and their applications',
    icon: 'Layers',
    color: '#F59E0B',
    order: 4,
    estimatedHours: 8,
    prerequisites: ['arrays', 'linked-lists'],
    theory: {
      overview: 'Stacks (LIFO) and Queues (FIFO) are abstract data types with restricted access patterns.',
      sections: [
        {
          id: 'stack-basics',
          title: 'Stack Operations',
          content: 'Stack follows Last-In-First-Out. Main operations: push, pop, peek.',
          codeExample: `class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
}

// Valid Parentheses example
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {')':'(', '}':'{', ']':'['};
  
  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.length === 0;
}`,
          complexity: { time: 'O(1) for all operations', space: 'O(n)' }
        },
        {
          id: 'queue-basics',
          title: 'Queue Operations',
          content: 'Queue follows First-In-First-Out. Main operations: enqueue, dequeue, front.',
          codeExample: `class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  front(): T | undefined { return this.items[0]; }
  isEmpty(): boolean { return this.items.length === 0; }
}`,
          complexity: { time: 'O(1) enqueue, O(n) dequeue with array', space: 'O(n)' }
        }
      ],
      interviewTips: [
        'Stacks are great for matching problems (parentheses, tags)',
        'Monotonic stacks for next greater element',
        'Use queues for BFS traversal'
      ],
      commonMistakes: [
        'Using shift() for queue dequeue is O(n)',
        'Not checking for empty stack before pop'
      ]
    },
    problemIds: ['sq-1', 'sq-2', 'sq-3', 'sq-4']
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'Binary trees, BST, tree traversals and operations',
    icon: 'GitBranch',
    color: '#EF4444',
    order: 5,
    estimatedHours: 18,
    prerequisites: ['stacks-queues'],
    theory: {
      overview: 'Trees are hierarchical data structures with a root node and subtrees. Binary trees have at most two children per node.',
      sections: [
        {
          id: 'tree-traversal',
          title: 'Tree Traversals',
          content: 'Three main DFS traversals: Inorder (Left-Root-Right), Preorder (Root-Left-Right), Postorder (Left-Right-Root).',
          codeExample: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number) {
    this.val = val;
    this.left = this.right = null;
  }
}

function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

function preorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  
  while (queue.length) {
    const level: number[] = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
          complexity: { time: 'O(n)', space: 'O(h) for DFS, O(w) for BFS' }
        },
        {
          id: 'bst-operations',
          title: 'Binary Search Tree',
          content: 'BST maintains the property: left < root < right. This enables O(log n) search.',
          codeExample: `function searchBST(root: TreeNode | null, val: number): TreeNode | null {
  if (!root || root.val === val) return root;
  return val < root.val 
    ? searchBST(root.left, val) 
    : searchBST(root.right, val);
}

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else root.right = insertBST(root.right, val);
  return root;
}`,
          complexity: { time: 'O(log n) average, O(n) worst', space: 'O(h)' }
        }
      ],
      interviewTips: [
        'Recursion is natural for tree problems',
        'Consider iterative solutions using stack',
        'For BST, inorder traversal gives sorted order'
      ],
      commonMistakes: [
        'Forgetting base case in recursion',
        'Not handling null nodes',
        'Confusing tree types (BST vs regular binary tree)'
      ]
    },
    problemIds: ['tree-1', 'tree-2', 'tree-3', 'tree-4', 'tree-5', 'tree-6']
  },
  {
    id: 'graphs',
    name: 'Graphs',
    description: 'Graph representations, BFS, DFS, and graph algorithms',
    icon: 'Share2',
    color: '#06B6D4',
    order: 6,
    estimatedHours: 20,
    prerequisites: ['trees', 'stacks-queues'],
    theory: {
      overview: 'Graphs consist of vertices (nodes) connected by edges. They can be directed or undirected, weighted or unweighted.',
      sections: [
        {
          id: 'graph-representation',
          title: 'Graph Representation',
          content: 'Two common representations: Adjacency Matrix (O(V²) space) and Adjacency List (O(V+E) space).',
          codeExample: `// Adjacency List representation
type Graph = Map<number, number[]>;

function buildGraph(edges: [number, number][]): Graph {
  const graph: Graph = new Map();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u); // for undirected
  }
  return graph;
}`,
          complexity: { time: 'O(1) edge lookup for matrix', space: 'O(V+E) for list' }
        },
        {
          id: 'graph-traversal',
          title: 'BFS & DFS',
          content: 'BFS explores level by level (uses queue). DFS explores as deep as possible first (uses stack/recursion).',
          codeExample: `function bfs(graph: Graph, start: number): number[] {
  const visited = new Set<number>();
  const queue = [start];
  const result: number[] = [];
  
  visited.add(start);
  while (queue.length) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

function dfs(graph: Graph, start: number, visited = new Set<number>()): number[] {
  visited.add(start);
  const result = [start];
  for (const neighbor of graph.get(start) || []) {
    if (!visited.has(neighbor)) {
      result.push(...dfs(graph, neighbor, visited));
    }
  }
  return result;
}`,
          complexity: { time: 'O(V+E)', space: 'O(V)' }
        }
      ],
      interviewTips: [
        'Always use a visited set to avoid infinite loops',
        'BFS finds shortest path in unweighted graphs',
        'DFS is great for connectivity and cycle detection'
      ],
      commonMistakes: [
        'Forgetting to mark nodes as visited',
        'Not handling disconnected components',
        'Using wrong data structure for BFS/DFS'
      ]
    },
    problemIds: ['graph-1', 'graph-2', 'graph-3', 'graph-4', 'graph-5']
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Memoization, tabulation, and optimal substructure',
    icon: 'Table2',
    color: '#EC4899',
    order: 7,
    estimatedHours: 25,
    prerequisites: ['arrays', 'recursion'],
    theory: {
      overview: 'DP solves complex problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.',
      sections: [
        {
          id: 'dp-basics',
          title: 'DP Fundamentals',
          content: 'Two approaches: Top-down (memoization) and Bottom-up (tabulation). Both achieve same time complexity.',
          codeExample: `// Fibonacci - Memoization (Top-down)
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  memo.set(n, result);
  return result;
}

// Fibonacci - Tabulation (Bottom-up)
function fibTab(n: number): number {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}

// Space-optimized
function fibOptimized(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
          complexity: { time: 'O(n)', space: 'O(n) or O(1) optimized' }
        },
        {
          id: 'dp-patterns',
          title: 'Common DP Patterns',
          content: '1D DP, 2D DP, Knapsack, LCS, LIS are common patterns.',
          codeExample: `// Longest Increasing Subsequence
function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}

// 0/1 Knapsack
function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp = Array(n + 1).fill(0).map(() => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          dp[i-1][w],
          dp[i-1][w - weights[i-1]] + values[i-1]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][W];
}`,
          complexity: { time: 'O(n²) for LIS, O(n*W) for Knapsack', space: 'O(n) or O(n*W)' }
        }
      ],
      interviewTips: [
        'Start with brute force recursion, then optimize',
        'Draw the recursion tree to find overlapping subproblems',
        'Define state clearly before coding'
      ],
      commonMistakes: [
        'Not identifying overlapping subproblems',
        'Wrong base cases',
        'Off-by-one errors in table indices'
      ]
    },
    problemIds: ['dp-1', 'dp-2', 'dp-3', 'dp-4', 'dp-5', 'dp-6']
  },
  {
    id: 'sorting-searching',
    name: 'Sorting & Searching',
    description: 'Sorting algorithms and binary search techniques',
    icon: 'ArrowUpDown',
    color: '#84CC16',
    order: 8,
    estimatedHours: 12,
    prerequisites: ['arrays'],
    theory: {
      overview: 'Sorting arranges data in order. Binary search efficiently finds elements in sorted data.',
      sections: [
        {
          id: 'sorting-algorithms',
          title: 'Sorting Algorithms',
          content: 'Quick Sort, Merge Sort (O(n log n)), Counting Sort (O(n+k)) for specific cases.',
          codeExample: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
          complexity: { time: 'O(n log n)', space: 'O(n)' }
        },
        {
          id: 'binary-search',
          title: 'Binary Search',
          content: 'Binary search divides search space in half each iteration. Works on sorted arrays.',
          codeExample: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// Find first occurrence
function findFirst(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1, result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}`,
          complexity: { time: 'O(log n)', space: 'O(1)' }
        }
      ],
      interviewTips: [
        'Binary search has many variations - practice them all',
        'Know when to use left < right vs left <= right',
        'Consider search on answer problems'
      ],
      commonMistakes: [
        'Integer overflow in mid calculation',
        'Wrong loop termination condition',
        'Not handling duplicates correctly'
      ]
    },
    problemIds: ['ss-1', 'ss-2', 'ss-3', 'ss-4', 'ss-5']
  }
];

export const problems: Problem[] = [
  // Array problems
  { id: 'arr-1', title: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/', topicId: 'arrays', patterns: ['Hash Map'], companies: ['Google', 'Amazon', 'Facebook'] },
  { id: 'arr-2', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', topicId: 'arrays', patterns: ['Sliding Window'], companies: ['Amazon', 'Facebook'] },
  { id: 'arr-3', title: 'Contains Duplicate', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/contains-duplicate/', topicId: 'arrays', patterns: ['Hash Set'], companies: ['Apple', 'Microsoft'] },
  { id: 'arr-4', title: 'Product of Array Except Self', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/product-of-array-except-self/', topicId: 'arrays', patterns: ['Prefix Sum'], companies: ['Amazon', 'Apple', 'Facebook'] },
  { id: 'arr-5', title: 'Maximum Subarray', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/', topicId: 'arrays', patterns: ['Kadane'], companies: ['Microsoft', 'Amazon'] },
  { id: 'arr-6', title: 'Trapping Rain Water', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/trapping-rain-water/', topicId: 'arrays', patterns: ['Two Pointers', 'Stack'], companies: ['Google', 'Amazon', 'Goldman Sachs'] },

  // String problems
  { id: 'str-1', title: 'Valid Anagram', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-anagram/', topicId: 'strings', patterns: ['Hash Map'], companies: ['Amazon', 'Microsoft'] },
  { id: 'str-2', title: 'Valid Palindrome', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-palindrome/', topicId: 'strings', patterns: ['Two Pointers'], companies: ['Facebook', 'Microsoft'] },
  { id: 'str-3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', topicId: 'strings', patterns: ['Sliding Window'], companies: ['Amazon', 'Bloomberg'] },
  { id: 'str-4', title: 'Group Anagrams', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/group-anagrams/', topicId: 'strings', patterns: ['Hash Map', 'Sorting'], companies: ['Facebook', 'Amazon'] },
  { id: 'str-5', title: 'Minimum Window Substring', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-window-substring/', topicId: 'strings', patterns: ['Sliding Window'], companies: ['Facebook', 'LinkedIn'] },

  // Linked List problems
  { id: 'll-1', title: 'Reverse Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list/', topicId: 'linked-lists', patterns: ['Iterative', 'Recursive'], companies: ['Microsoft', 'Apple'] },
  { id: 'll-2', title: 'Merge Two Sorted Lists', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', topicId: 'linked-lists', patterns: ['Two Pointers'], companies: ['Amazon', 'Microsoft'] },
  { id: 'll-3', title: 'Linked List Cycle', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle/', topicId: 'linked-lists', patterns: ['Fast & Slow Pointers'], companies: ['Amazon', 'Microsoft'] },
  { id: 'll-4', title: 'Remove Nth Node From End', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', topicId: 'linked-lists', patterns: ['Two Pointers'], companies: ['Facebook', 'Amazon'] },
  { id: 'll-5', title: 'LRU Cache', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/', topicId: 'linked-lists', patterns: ['Hash Map', 'Doubly Linked List'], companies: ['Amazon', 'Facebook', 'Google'] },

  // Stack & Queue problems
  { id: 'sq-1', title: 'Valid Parentheses', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/', topicId: 'stacks-queues', patterns: ['Stack'], companies: ['Amazon', 'Facebook'] },
  { id: 'sq-2', title: 'Min Stack', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/min-stack/', topicId: 'stacks-queues', patterns: ['Stack Design'], companies: ['Amazon', 'Microsoft'] },
  { id: 'sq-3', title: 'Daily Temperatures', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/daily-temperatures/', topicId: 'stacks-queues', patterns: ['Monotonic Stack'], companies: ['Facebook', 'Amazon'] },
  { id: 'sq-4', title: 'Sliding Window Maximum', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/sliding-window-maximum/', topicId: 'stacks-queues', patterns: ['Monotonic Deque'], companies: ['Amazon', 'Google'] },

  // Tree problems
  { id: 'tree-1', title: 'Invert Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/invert-binary-tree/', topicId: 'trees', patterns: ['DFS', 'BFS'], companies: ['Google', 'Amazon'] },
  { id: 'tree-2', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', topicId: 'trees', patterns: ['DFS'], companies: ['Amazon', 'Microsoft'] },
  { id: 'tree-3', title: 'Same Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/same-tree/', topicId: 'trees', patterns: ['DFS'], companies: ['Amazon', 'Bloomberg'] },
  { id: 'tree-4', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', topicId: 'trees', patterns: ['BFS'], companies: ['Amazon', 'Microsoft', 'Facebook'] },
  { id: 'tree-5', title: 'Validate Binary Search Tree', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/validate-binary-search-tree/', topicId: 'trees', patterns: ['DFS', 'Inorder'], companies: ['Amazon', 'Facebook'] },
  { id: 'tree-6', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', topicId: 'trees', patterns: ['DFS'], companies: ['Facebook', 'Microsoft'] },

  // Graph problems
  { id: 'graph-1', title: 'Number of Islands', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/', topicId: 'graphs', patterns: ['DFS', 'BFS'], companies: ['Amazon', 'Microsoft', 'Facebook'] },
  { id: 'graph-2', title: 'Clone Graph', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/clone-graph/', topicId: 'graphs', patterns: ['DFS', 'BFS'], companies: ['Facebook', 'Google'] },
  { id: 'graph-3', title: 'Course Schedule', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule/', topicId: 'graphs', patterns: ['Topological Sort'], companies: ['Amazon', 'Facebook'] },
  { id: 'graph-4', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', topicId: 'graphs', patterns: ['DFS', 'BFS'], companies: ['Google', 'Amazon'] },
  { id: 'graph-5', title: 'Word Ladder', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-ladder/', topicId: 'graphs', patterns: ['BFS'], companies: ['Amazon', 'Facebook'] },

  // DP problems
  { id: 'dp-1', title: 'Climbing Stairs', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/', topicId: 'dynamic-programming', patterns: ['1D DP'], companies: ['Amazon', 'Adobe'] },
  { id: 'dp-2', title: 'House Robber', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/house-robber/', topicId: 'dynamic-programming', patterns: ['1D DP'], companies: ['Amazon', 'Microsoft'] },
  { id: 'dp-3', title: 'Coin Change', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/', topicId: 'dynamic-programming', patterns: ['Unbounded Knapsack'], companies: ['Amazon', 'Microsoft', 'Goldman Sachs'] },
  { id: 'dp-4', title: 'Longest Increasing Subsequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', topicId: 'dynamic-programming', patterns: ['1D DP', 'Binary Search'], companies: ['Amazon', 'Microsoft'] },
  { id: 'dp-5', title: 'Unique Paths', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/unique-paths/', topicId: 'dynamic-programming', patterns: ['2D DP'], companies: ['Amazon', 'Google'] },
  { id: 'dp-6', title: 'Edit Distance', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/edit-distance/', topicId: 'dynamic-programming', patterns: ['2D DP', 'String DP'], companies: ['Google', 'Amazon'] },

  // Sorting & Searching problems
  { id: 'ss-1', title: 'Binary Search', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-search/', topicId: 'sorting-searching', patterns: ['Binary Search'], companies: ['Microsoft', 'Apple'] },
  { id: 'ss-2', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', topicId: 'sorting-searching', patterns: ['Binary Search'], companies: ['Facebook', 'Amazon', 'Microsoft'] },
  { id: 'ss-3', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', topicId: 'sorting-searching', patterns: ['Binary Search'], companies: ['Amazon', 'Microsoft'] },
  { id: 'ss-4', title: 'Kth Largest Element', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', topicId: 'sorting-searching', patterns: ['Quick Select', 'Heap'], companies: ['Facebook', 'Amazon'] },
  { id: 'ss-5', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', topicId: 'sorting-searching', patterns: ['Binary Search'], companies: ['Amazon', 'Google', 'Goldman Sachs'] },
];
