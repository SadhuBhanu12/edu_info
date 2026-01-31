import type { LearningModule } from '../types';

export const learningModules: Record<string, LearningModule> = {
  arrays: {
    conceptOverview: `Arrays are the foundation of data structures - sequential collections stored in contiguous memory. They're essential for solving 40% of interview problems and form the basis for dynamic programming, sliding windows, and two-pointer techniques.`,
    
    whyItMatters: `🎯 **Interview Impact**: Arrays appear in 9/10 coding interviews at FAANG companies. Mastering array patterns unlocks solutions to hundreds of problems.

**Real-World Usage**: 
• Database indexing and caching
• Image processing (2D arrays)
• Dynamic programming foundations
• Algorithm optimization techniques`,

    coreExplanation: `**What is an Array?**

An array is a fundamental linear data structure that stores elements of the same type in contiguous memory locations. This arrangement provides direct and efficient access to elements.

**From "Data Structures & Algorithms in Java" (6th Edition):**

✅ **O(1) Random Access**: Arrays support constant-time access to any element using its index - a defining characteristic that makes them extremely efficient for many algorithms.

✅ **Cache-Friendly Performance**: Because array elements are stored contiguously in memory, accessing sequential elements benefits from CPU cache locality, leading to significantly better performance in practice.

✅ **Index-Based Organization**: Arrays use zero-based indexing where the first element is at index 0. The address of any element can be computed using the formula:
   **address = base_address + (index × element_size)**

**Key Characteristics (Textbook, Chapter 3):**

📌 **Fixed Capacity**: Java arrays have a fixed length that must be specified when created. Once created, the array's length cannot be changed (though a new larger array can be created if needed).

📌 **Type Homogeneity**: All elements in an array must be of the same type (or compatible types in the inheritance hierarchy).

📌 **Memory Efficiency**: Arrays store elements directly (primitives) or references (objects) in sequential memory cells, minimizing overhead.

📌 **Bounds Checking**: Java automatically throws ArrayIndexOutOfBoundsException if you attempt to access an index outside the valid range [0, n-1].

**Memory Layout Example:**
\`\`\`
Index:     0     1     2     3     4
Value:   [10]  [20]  [30]  [40]  [50]
Address: 1000  1004  1008  1012  1016
\`\`\`

**Dynamic Arrays (ArrayList):**
When flexibility is needed, Java provides ArrayList which automatically resizes:
• Starts with default capacity (typically 10)
• When full, creates new array with ~1.5x capacity
• Copies all elements to new array
• Amortized O(1) insertion at end
• Individual resize operation is O(n)

**Array Operations Complexity:**
• Access by index: O(1) - Direct memory calculation
• Search (unsorted): O(n) - Linear scan required
• Search (sorted): O(log n) - Binary search applicable
• Insert at end: O(1) for dynamic, O(n) if resize needed
• Insert at middle: O(n) - Requires shifting elements
• Delete: O(n) - Requires shifting to fill gap

**Textbook Insight (Page 103-121):**
"Arrays are among the oldest and most important data structures. They provide the foundation for implementing many other data structures such as stacks, queues, and hash tables. The ability to access any element in constant time makes arrays invaluable for algorithm design."

**Common Array Patterns in DSA:**
1. **Two Pointers**: For sorted arrays, palindromes, pair sums
2. **Sliding Window**: For contiguous subarray problems
3. **Prefix Sum**: For range query optimization
4. **Kadane's Algorithm**: For maximum subarray sum
5. **Dutch National Flag**: For three-way partitioning`,

    visualDiagrams: [
      {
        id: 'array-memory-layout',
        title: 'Array Memory Layout - Contiguous Storage',
        description: 'How arrays store elements in consecutive memory addresses',
        svgContent: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="18" font-weight="bold">Array in Memory</text>
  
  <!-- Memory cells -->
  <rect x="50" y="60" width="80" height="50" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="90" y="90" fill="#fff" text-anchor="middle" font-size="16">10</text>
  <text x="90" y="130" fill="#94a3b8" font-size="11" text-anchor="middle">index: 0</text>
  <text x="90" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">addr: 1000</text>
  
  <rect x="140" y="60" width="80" height="50" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="180" y="90" fill="#fff" text-anchor="middle" font-size="16">20</text>
  <text x="180" y="130" fill="#94a3b8" font-size="11" text-anchor="middle">index: 1</text>
  <text x="180" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">addr: 1004</text>
  
  <rect x="230" y="60" width="80" height="50" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="270" y="90" fill="#fff" text-anchor="middle" font-size="16">30</text>
  <text x="270" y="130" fill="#94a3b8" font-size="11" text-anchor="middle">index: 2</text>
  <text x="270" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">addr: 1008</text>
  
  <rect x="320" y="60" width="80" height="50" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="360" y="90" fill="#fff" text-anchor="middle" font-size="16">40</text>
  <text x="360" y="130" fill="#94a3b8" font-size="11" text-anchor="middle">index: 3</text>
  <text x="360" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">addr: 1012</text>
  
  <rect x="410" y="60" width="80" height="50" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="450" y="90" fill="#fff" text-anchor="middle" font-size="16">50</text>
  <text x="450" y="130" fill="#94a3b8" font-size="11" text-anchor="middle">index: 4</text>
  <text x="450" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">addr: 1016</text>
  
  <!-- Formula -->
  <text x="300" y="175" fill="#10B981" text-anchor="middle" font-size="13">address = base_address + (index × element_size)</text>
  <text x="300" y="192" fill="#fbbf24" text-anchor="middle" font-size="12">O(1) Direct Access!</text>
</svg>`
      },
      {
        id: 'array-insertion',
        title: 'Array Insertion - Element Shifting',
        description: 'Why insertion takes O(n) time - elements must shift',
        svgContent: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
  <!-- Before insertion -->
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Before: Insert 25 at index 2</text>
  <rect x="100" y="40" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="130" y="65" fill="#fff" text-anchor="middle">10</text>
  <rect x="170" y="40" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="200" y="65" fill="#fff" text-anchor="middle">20</text>
  <rect x="240" y="40" width="60" height="40" fill="#f87171" opacity="0.5" stroke="#f87171" stroke-width="2"/>
  <text x="270" y="65" fill="#fff" text-anchor="middle">30</text>
  <text x="270" y="95" fill="#f87171" font-size="11">← Insert here</text>
  <rect x="310" y="40" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="340" y="65" fill="#fff" text-anchor="middle">40</text>
  <rect x="380" y="40" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="410" y="65" fill="#fff" text-anchor="middle">50</text>
  
  <!-- Shift arrows -->
  <text x="300" y="130" fill="#fbbf24" text-anchor="middle" font-size="15" font-weight="bold">Shift Elements Right →</text>
  <path d="M 270 110 L 330 150" stroke="#fbbf24" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 340 110 L 390 150" stroke="#fbbf24" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  <path d="M 410 110 L 450 150" stroke="#fbbf24" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
  
  <!-- After insertion -->
  <text x="300" y="175" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">After: Array with new element</text>
  <rect x="80" y="190" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="110" y="215" fill="#fff" text-anchor="middle">10</text>
  <rect x="150" y="190" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="180" y="215" fill="#fff" text-anchor="middle">20</text>
  <rect x="220" y="190" width="60" height="40" fill="#10B981" opacity="0.5" stroke="#10B981" stroke-width="3"/>
  <text x="250" y="215" fill="#fff" text-anchor="middle" font-weight="bold">25</text>
  <text x="250" y="245" fill="#10B981" font-size="11">NEW!</text>
  <rect x="290" y="190" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="320" y="215" fill="#fff" text-anchor="middle">30</text>
  <rect x="360" y="190" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="390" y="215" fill="#fff" text-anchor="middle">40</text>
  <rect x="430" y="190" width="60" height="40" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="460" y="215" fill="#fff" text-anchor="middle">50</text>
  
  <text x="300" y="265" fill="#f87171" text-anchor="middle" font-size="13">Time Complexity: O(n) - Must shift n elements</text>
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24"/></marker></defs>
</svg>`
      },
      {
        id: 'two-pointer-technique',
        title: 'Two Pointer Technique - Pair Sum Problem',
        description: 'Find two numbers that sum to target using two pointers',
        svgContent: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Two Pointers: Find pair sum = 12</text>
  
  <!-- Sorted array -->
  <rect x="80" y="60" width="60" height="45" fill="#3B82F6" opacity="0.4" stroke="#3B82F6" stroke-width="3"/>
  <text x="110" y="87" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">1</text>
  <text x="110" y="120" fill="#3B82F6" font-size="12" text-anchor="middle">LEFT ←</text>
  
  <rect x="150" y="60" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="180" y="87" fill="#fff" text-anchor="middle" font-size="18">3</text>
  
  <rect x="220" y="60" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="250" y="87" fill="#fff" text-anchor="middle" font-size="18">5</text>
  
  <rect x="290" y="60" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="320" y="87" fill="#fff" text-anchor="middle" font-size="18">7</text>
  
  <rect x="360" y="60" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="390" y="87" fill="#fff" text-anchor="middle" font-size="18">9</text>
  
  <rect x="430" y="60" width="60" height="45" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="3"/>
  <text x="460" y="87" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">11</text>
  <text x="460" y="120" fill="#10B981" font-size="12" text-anchor="middle">→ RIGHT</text>
  
  <!-- Logic explanation -->
  <rect x="100" y="140" width="400" height="50" fill="#c084fc" opacity="0.2" stroke="#c084fc" stroke-width="1" rx="5"/>
  <text x="300" y="160" fill="#fff" text-anchor="middle" font-size="13">If sum < target: move LEFT right →</text>
  <text x="300" y="177" fill="#fff" text-anchor="middle" font-size="13">If sum > target: move RIGHT left ←</text>
</svg>`
      },
      {
        id: 'sliding-window',
        title: 'Sliding Window - Maximum Sum Subarray',
        description: 'Find maximum sum of k consecutive elements',
        svgContent: `<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Sliding Window: Max sum of 3 elements</text>
  
  <!-- Step 1: Initial window -->
  <text x="100" y="55" fill="#fbbf24" font-size="13">Step 1: Initial window</text>
  <rect x="50" y="65" width="50" height="40" fill="#F59E0B" opacity="0.5" stroke="#F59E0B" stroke-width="2"/>
  <text x="75" y="90" fill="#fff" text-anchor="middle" font-size="16">2</text>
  <rect x="105" y="65" width="50" height="40" fill="#F59E0B" opacity="0.5" stroke="#F59E0B" stroke-width="2"/>
  <text x="130" y="90" fill="#fff" text-anchor="middle" font-size="16">1</text>
  <rect x="160" y="65" width="50" height="40" fill="#F59E0B" opacity="0.5" stroke="#F59E0B" stroke-width="2"/>
  <text x="185" y="90" fill="#fff" text-anchor="middle" font-size="16">5</text>
  <rect x="215" y="65" width="50" height="40" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="240" y="90" fill="#94a3b8" text-anchor="middle" font-size="16">3</text>
  <rect x="270" y="65" width="50" height="40" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="295" y="90" fill="#94a3b8" text-anchor="middle" font-size="16">4</text>
  <text x="350" y="88" fill="#fbbf24" font-size="14">Sum = 8</text>
  
  <!-- Step 2: Slide window -->
  <text x="100" y="130" fill="#fbbf24" font-size="13">Step 2: Slide right →</text>
  <rect x="50" y="140" width="50" height="40" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="75" y="165" fill="#94a3b8" text-anchor="middle" font-size="16">2</text>
  <rect x="105" y="140" width="50" height="40" fill="#F59E0B" opacity="0.5" stroke="#F59E0B" stroke-width="2"/>
  <text x="130" y="165" fill="#fff" text-anchor="middle" font-size="16">1</text>
  <rect x="160" y="140" width="50" height="40" fill="#F59E0B" opacity="0.5" stroke="#F59E0B" stroke-width="2"/>
  <text x="185" y="165" fill="#fff" text-anchor="middle" font-size="16">5</text>
  <rect x="215" y="140" width="50" height="40" fill="#F59E0B" opacity="0.5" stroke="#F59E0B" stroke-width="2"/>
  <text x="240" y="165" fill="#fff" text-anchor="middle" font-size="16">3</text>
  <rect x="270" y="140" width="50" height="40" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="295" y="165" fill="#94a3b8" text-anchor="middle" font-size="16">4</text>
  <text x="350" y="163" fill="#fbbf24" font-size="14">Sum = 9</text>
  
  <text x="300" y="210" fill="#10B981" text-anchor="middle" font-size="13">Remove left, Add right: O(1) per slide</text>
  <text x="300" y="227" fill="#10B981" text-anchor="middle" font-size="13">Total Time: O(n) instead of O(n×k)</text>
</svg>`
      },
      {
        id: 'binary-search-visual',
        title: 'Binary Search - Divide and Conquer',
        description: 'Search in sorted array by halving search space',
        svgContent: `<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Binary Search: Find 23</text>
  
  <!-- Full array -->
  <rect x="50" y="50" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="75" y="72" fill="#fff" text-anchor="middle">3</text>
  <rect x="105" y="50" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="130" y="72" fill="#fff" text-anchor="middle">5</text>
  <rect x="160" y="50" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="185" y="72" fill="#fff" text-anchor="middle">7</text>
  <rect x="215" y="50" width="50" height="35" fill="#fbbf24" opacity="0.5" stroke="#fbbf24" stroke-width="2"/>
  <text x="240" y="72" fill="#fff" text-anchor="middle" font-weight="bold">9</text>
  <text x="240" y="100" fill="#fbbf24" font-size="11">MID</text>
  <rect x="270" y="50" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="295" y="72" fill="#fff" text-anchor="middle">11</text>
  <rect x="325" y="50" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="350" y="72" fill="#fff" text-anchor="middle">23</text>
  <rect x="380" y="50" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="405" y="72" fill="#fff" text-anchor="middle">45</text>
  
  <text x="470" y="72" fill="#f87171" font-size="13">23 > 9</text>
  <text x="470" y="87" fill="#f87171" font-size="12">Search right →</text>
  
  <!-- Narrowed search -->
  <text x="300" y="125" fill="#c084fc" text-anchor="middle" font-size="14">Search space reduced by half</text>
  
  <rect x="270" y="140" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="295" y="162" fill="#fff" text-anchor="middle">11</text>
  <rect x="325" y="140" width="50" height="35" fill="#10B981" opacity="0.5" stroke="#10B981" stroke-width="3"/>
  <text x="350" y="162" fill="#fff" text-anchor="middle" font-weight="bold">23</text>
  <text x="350" y="190" fill="#10B981" font-size="12">FOUND! ✓</text>
  <rect x="380" y="140" width="50" height="35" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="405" y="162" fill="#fff" text-anchor="middle">45</text>
  
  <text x="300" y="215" fill="#22d3ee" text-anchor="middle" font-size="13">O(log n) - Each step halves search space</text>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'array-init',
        description: '🔵 Step 1: Initialize array [10, 20, 30, 40, 50]',
        code: 'int[] arr = {10, 20, 30, 40, 50};',
        highlightElements: ['arr[0]', 'arr[1]', 'arr[2]', 'arr[3]', 'arr[4]'],
        duration: 1200,
        transitionType: 'fade',
        explanation: 'Creating an array allocates contiguous memory blocks. Each element occupies a fixed address, enabling O(1) direct access.',
        visualContent: `<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="arrayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.9" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
    <linearGradient id="labelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#22d3ee;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.8" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="700" height="200" fill="#0f172a" opacity="0.02" rx="8"/>
  
  <!-- Title with gradient -->
  <text x="350" y="30" fill="url(#labelGrad)" text-anchor="middle" font-size="18" font-weight="700" font-family="Inter, system-ui, sans-serif">Array Initialization</text>
  <text x="350" y="50" fill="#64748b" text-anchor="middle" font-size="12" font-family="'Courier New', monospace">int[] arr = {10, 20, 30, 40, 50};</text>
  
  <!-- Memory address bar -->
  <rect x="50" y="75" width="600" height="4" fill="#334155" opacity="0.3" rx="2"/>
  <text x="50" y="70" fill="#64748b" font-size="10" font-weight="600">MEMORY</text>
  
  <!-- Array elements with professional styling -->
  <g filter="url(#shadow)">
    <rect x="70" y="95" width="95" height="65" fill="url(#arrayGrad)" stroke="#22d3ee" stroke-width="2.5" rx="6"/>
    <text x="117" y="132" fill="#ffffff" text-anchor="middle" font-size="24" font-weight="700" font-family="'SF Mono', 'Courier New', monospace">10</text>
    <text x="117" y="152" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">index: 0</text>
    <text x="117" y="175" fill="#475569" font-size="9" text-anchor="middle">0x1000</text>
  </g>
  
  <g filter="url(#shadow)">
    <rect x="175" y="95" width="95" height="65" fill="url(#arrayGrad)" stroke="#22d3ee" stroke-width="2.5" rx="6"/>
    <text x="222" y="132" fill="#ffffff" text-anchor="middle" font-size="24" font-weight="700" font-family="'SF Mono', 'Courier New', monospace">20</text>
    <text x="222" y="152" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">index: 1</text>
    <text x="222" y="175" fill="#475569" font-size="9" text-anchor="middle">0x1004</text>
  </g>
  
  <g filter="url(#shadow)">
    <rect x="280" y="95" width="95" height="65" fill="url(#arrayGrad)" stroke="#22d3ee" stroke-width="2.5" rx="6"/>
    <text x="327" y="132" fill="#ffffff" text-anchor="middle" font-size="24" font-weight="700" font-family="'SF Mono', 'Courier New', monospace">30</text>
    <text x="327" y="152" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">index: 2</text>
    <text x="327" y="175" fill="#475569" font-size="9" text-anchor="middle">0x1008</text>
  </g>
  
  <g filter="url(#shadow)">
    <rect x="385" y="95" width="95" height="65" fill="url(#arrayGrad)" stroke="#22d3ee" stroke-width="2.5" rx="6"/>
    <text x="432" y="132" fill="#ffffff" text-anchor="middle" font-size="24" font-weight="700" font-family="'SF Mono', 'Courier New', monospace">40</text>
    <text x="432" y="152" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">index: 3</text>
    <text x="432" y="175" fill="#475569" font-size="9" text-anchor="middle">0x100C</text>
  </g>
  
  <g filter="url(#shadow)">
    <rect x="490" y="95" width="95" height="65" fill="url(#arrayGrad)" stroke="#22d3ee" stroke-width="2.5" rx="6"/>
    <text x="537" y="132" fill="#ffffff" text-anchor="middle" font-size="24" font-weight="700" font-family="'SF Mono', 'Courier New', monospace">50</text>
    <text x="537" y="152" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600">index: 4</text>
    <text x="537" y="175" fill="#475569" font-size="9" text-anchor="middle">0x1010</text>
  </g>
  
  <!-- Info badge -->
  <rect x="250" y="182" width="200" height="22" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1" rx="11"/>
  <text x="350" y="196" fill="#10b981" text-anchor="middle" font-size="11" font-weight="600">✓ Contiguous Memory Allocation</text>
</svg>`
      },
      {
        id: 'array-access',
        description: '🔍 Step 2: Access element at index 2 - O(1) operation',
        code: 'int value = arr[2]; // value = 30 (Direct memory access)',
        highlightElements: ['arr[2]'],
        duration: 1000,
        transitionType: 'scale',
        explanation: 'Array access is O(1) because we calculate the exact memory address: base_address + (index × element_size). No iteration needed!',
        visualContent: `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accessGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:0.95" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="shadow2">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <rect width="700" height="220" fill="#0f172a" opacity="0.02" rx="8"/>
  
  <text x="350" y="30" fill="#22d3ee" text-anchor="middle" font-size="18" font-weight="700" font-family="Inter, system-ui, sans-serif">Direct Access - O(1) Time</text>
  <text x="350" y="50" fill="#64748b" text-anchor="middle" font-size="12" font-family="'Courier New', monospace">value = arr[2];</text>
  
  <!-- Dimmed elements -->
  <rect x="70" y="85" width="90" height="60" fill="#1e293b" stroke="#334155" stroke-width="1.5" rx="6" opacity="0.4"/>
  <text x="115" y="120" fill="#64748b" text-anchor="middle" font-size="20" font-weight="600">10</text>
  <text x="115" y="137" fill="#475569" font-size="9" text-anchor="middle">index 0</text>
  
  <rect x="170" y="85" width="90" height="60" fill="#1e293b" stroke="#334155" stroke-width="1.5" rx="6" opacity="0.4"/>
  <text x="215" y="120" fill="#64748b" text-anchor="middle" font-size="20" font-weight="600">20</text>
  <text x="215" y="137" fill="#475569" font-size="9" text-anchor="middle">index 1</text>
  
  <!-- Highlighted accessed element with glow -->
  <g filter="url(#glow)">
    <rect x="270" y="80" width="100" height="70" fill="url(#accessGrad)" stroke="#10b981" stroke-width="3" rx="8"/>
    <text x="320" y="120" fill="#ffffff" text-anchor="middle" font-size="28" font-weight="800" font-family="'SF Mono', monospace">30</text>
    <text x="320" y="140" fill="#d1fae5" font-size="11" text-anchor="middle" font-weight="700">ACCESSING</text>
  </g>
  
  <!-- Pointer arrow -->
  <path d="M 320 50 L 320 75" stroke="#10b981" stroke-width="3" marker-end="url(#arrowAccess)" filter="url(#shadow2)"/>
  <circle cx="320" cy="45" r="8" fill="#10b981" opacity="0.3"/>
  <circle cx="320" cy="45" r="4" fill="#10b981"/>
  
  <rect x="380" y="85" width="90" height="60" fill="#1e293b" stroke="#334155" stroke-width="1.5" rx="6" opacity="0.4"/>
  <text x="425" y="120" fill="#64748b" text-anchor="middle" font-size="20" font-weight="600">40</text>
  <text x="425" y="137" fill="#475569" font-size="9" text-anchor="middle">index 3</text>
  
  <rect x="480" y="85" width="90" height="60" fill="#1e293b" stroke="#334155" stroke-width="1.5" rx="6" opacity="0.4"/>
  <text x="525" y="120" fill="#64748b" text-anchor="middle" font-size="20" font-weight="600">50</text>
  <text x="525" y="137" fill="#475569" font-size="9" text-anchor="middle">index 4</text>
  
  <!-- Result display -->
  <rect x="200" y="165" width="300" height="35" fill="#10b981" opacity="0.1" stroke="#10b981" stroke-width="1.5" rx="6"/>
  <text x="350" y="185" fill="#10b981" text-anchor="middle" font-size="13" font-weight="700" font-family="'Courier New', monospace">value = 30</text>
  <text x="350" y="200" fill="#059669" text-anchor="middle" font-size="10" font-weight="600">⚡ Instant retrieval - No iteration required</text>
  
  <defs>
    <marker id="arrowAccess" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
      <circle cx="6" cy="6" r="5" fill="#10b981"/>
      <path d="M 2,2 L 10,6 L 2,10 z" fill="#ffffff"/>
    </marker>
  </defs>
</svg>`
      },
      {
        id: 'array-insert-prep',
        description: '📝 Step 3: Insert 25 at index 2 - Prepare to shift elements',
        code: '// Need to shift arr[2], arr[3], arr[4] to right',
        highlightElements: ['arr[2]', 'arr[3]', 'arr[4]'],
        visualContent: `<svg viewBox="0 0 550 180" xmlns="http://www.w3.org/2000/svg">
  <text x="275" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 3: Prepare to Insert 25 at index 2</text>
  <rect x="50" y="60" width="80" height="50" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="90" y="90" fill="#fff" text-anchor="middle" font-size="20">10</text>
  <rect x="140" y="60" width="80" height="50" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="180" y="90" fill="#fff" text-anchor="middle" font-size="20">20</text>
  <rect x="230" y="60" width="80" height="50" fill="#f87171" opacity="0.5" stroke="#f87171" stroke-width="3"/>
  <text x="270" y="90" fill="#fff" text-anchor="middle" font-size="20">30</text>
  <text x="270" y="125" fill="#f87171" font-size="11" text-anchor="middle">Must shift →</text>
  <rect x="320" y="60" width="80" height="50" fill="#f87171" opacity="0.5" stroke="#f87171" stroke-width="3"/>
  <text x="360" y="90" fill="#fff" text-anchor="middle" font-size="20">40</text>
  <text x="360" y="125" fill="#f87171" font-size="11" text-anchor="middle">Must shift →</text>
  <rect x="410" y="60" width="80" height="50" fill="#f87171" opacity="0.5" stroke="#f87171" stroke-width="3"/>
  <text x="450" y="90" fill="#fff" text-anchor="middle" font-size="20">50</text>
  <text x="450" y="125" fill="#f87171" font-size="11" text-anchor="middle">Must shift →</text>
  <circle cx="210" cy="85" r="25" fill="#10B981" opacity="0.7"/>
  <text x="210" y="92" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">25</text>
  <text x="210" y="140" fill="#10B981" font-size="12" text-anchor="middle">NEW VALUE</text>
  <text x="275" y="165" fill="#fbbf24" text-anchor="middle" font-size="13">Need to shift 3 elements right before insertion</text>
</svg>`
      },
      {
        id: 'array-insert-shift',
        description: '➡️ Step 4: Shift elements right: [10,20,_,30,40,50]',
        code: 'for(int i=n; i>2; i--) arr[i]=arr[i-1]; // Shift O(n)',
        highlightElements: ['shift'],
        visualContent: `<svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 4: Shifting Elements Right</text>
  <rect x="50" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="85" y="87" fill="#fff" text-anchor="middle" font-size="18">10</text>
  <rect x="130" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="165" y="87" fill="#fff" text-anchor="middle" font-size="18">20</text>
  <rect x="210" y="60" width="70" height="45" fill="#fbbf24" opacity="0.4" stroke="#fbbf24" stroke-width="3" stroke-dasharray="5,5"/>
  <text x="245" y="87" fill="#94a3b8" text-anchor="middle" font-size="16">_</text>
  <text x="245" y="120" fill="#fbbf24" font-size="10" text-anchor="middle">EMPTY</text>
  <rect x="290" y="60" width="70" height="45" fill="#3B82F6" opacity="0.5" stroke="#3B82F6" stroke-width="2"/>
  <text x="325" y="87" fill="#fff" text-anchor="middle" font-size="18">30</text>
  <text x="325" y="120" fill="#3B82F6" font-size="10" text-anchor="middle">shifted</text>
  <rect x="370" y="60" width="70" height="45" fill="#3B82F6" opacity="0.5" stroke="#3B82F6" stroke-width="2"/>
  <text x="405" y="87" fill="#fff" text-anchor="middle" font-size="18">40</text>
  <text x="405" y="120" fill="#3B82F6" font-size="10" text-anchor="middle">shifted</text>
  <rect x="450" y="60" width="70" height="45" fill="#3B82F6" opacity="0.5" stroke="#3B82F6" stroke-width="2"/>
  <text x="485" y="87" fill="#fff" text-anchor="middle" font-size="18">50</text>
  <text x="485" y="120" fill="#3B82F6" font-size="10" text-anchor="middle">shifted</text>
  <path d="M 275 82 L 320 82" stroke="#fbbf24" stroke-width="2" marker-end="url(#arY)"/>
  <path d="M 355 82 L 400 82" stroke="#fbbf24" stroke-width="2" marker-end="url(#arY)"/>
  <path d="M 435 82 L 480 82" stroke="#fbbf24" stroke-width="2" marker-end="url(#arY)"/>
  <text x="300" y="150" fill="#f87171" text-anchor="middle" font-size="13">Shifting takes O(n) time</text>
  <text x="300" y="167" fill="#94a3b8" text-anchor="middle" font-size="11">Each element moves one position right</text>
  <defs><marker id="arY" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24"/></marker></defs>
</svg>`
      },
      {
        id: 'array-insert-complete',
        description: '✅ Step 5: Insert complete: [10,20,25,30,40,50]',
        code: 'arr[2] = 25; // Insertion done in O(n) time',
        highlightElements: ['arr[2]'],
        visualContent: `<svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 5: Insertion Complete!</text>
  <rect x="50" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="85" y="87" fill="#fff" text-anchor="middle" font-size="18">10</text>
  <rect x="130" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="165" y="87" fill="#fff" text-anchor="middle" font-size="18">20</text>
  <rect x="210" y="60" width="70" height="45" fill="#10B981" opacity="0.6" stroke="#10B981" stroke-width="4"/>
  <text x="245" y="87" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">25</text>
  <text x="245" y="120" fill="#10B981" font-size="11" text-anchor="middle">INSERTED! ✓</text>
  <rect x="290" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="325" y="87" fill="#fff" text-anchor="middle" font-size="18">30</text>
  <rect x="370" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="405" y="87" fill="#fff" text-anchor="middle" font-size="18">40</text>
  <rect x="450" y="60" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="485" y="87" fill="#fff" text-anchor="middle" font-size="18">50</text>
  <circle cx="245" cy="35" r="6" fill="#10B981"/>
  <text x="260" y="40" fill="#10B981" font-size="12">New element inserted</text>
  <text x="300" y="135" fill="#22d3ee" text-anchor="middle" font-size="13">Array now has 6 elements</text>
</svg>`
      },
      {
        id: 'two-pointer-init',
        description: '👈👉 Step 6: Two Pointers - Initialize left=0, right=5',
        code: 'int left = 0, right = arr.length - 1;',
        highlightElements: ['arr[0]', 'arr[5]'],
        visualContent: `<svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 6: Two Pointer Initialization</text>
  <text x="300" y="45" fill="#c084fc" text-anchor="middle" font-size="12">Find pair with sum = 50</text>
  <rect x="80" y="70" width="60" height="45" fill="#3B82F6" opacity="0.6" stroke="#3B82F6" stroke-width="3"/>
  <text x="110" y="97" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">1</text>
  <text x="110" y="130" fill="#3B82F6" font-size="12" text-anchor="middle">LEFT ← </text>
  <text x="110" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">index 0</text>
  <rect x="150" y="70" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="180" y="97" fill="#fff" text-anchor="middle" font-size="18">10</text>
  <rect x="220" y="70" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="250" y="97" fill="#fff" text-anchor="middle" font-size="18">20</text>
  <rect x="290" y="70" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="320" y="97" fill="#fff" text-anchor="middle" font-size="18">30</text>
  <rect x="360" y="70" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="390" y="97" fill="#fff" text-anchor="middle" font-size="18">40</text>
  <rect x="430" y="70" width="60" height="45" fill="#10B981" opacity="0.6" stroke="#10B981" stroke-width="3"/>
  <text x="460" y="97" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">49</text>
  <text x="460" y="130" fill="#10B981" font-size="12" text-anchor="middle">→ RIGHT</text>
  <text x="460" y="145" fill="#94a3b8" font-size="10" text-anchor="middle">index 5</text>
  <text x="300" y="170" fill="#fbbf24" text-anchor="middle" font-size="13">Start from both ends of sorted array</text>
</svg>`
      },
      {
        id: 'two-pointer-move',
        description: '🔄 Step 7: Move pointers based on condition',
        code: 'if (arr[left] + arr[right] > target) right--;\nelse left++;',
        highlightElements: ['arr[1]', 'arr[4]'],
        visualContent: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 7: Move Pointers Inward</text>
  <text x="300" y="45" fill="#c084fc" text-anchor="middle" font-size="12">sum = 1 + 49 = 50 (target found!)</text>
  <rect x="80" y="70" width="60" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="110" y="97" fill="#94a3b8" text-anchor="middle" font-size="16">1</text>
  <rect x="150" y="70" width="60" height="45" fill="#3B82F6" opacity="0.6" stroke="#3B82F6" stroke-width="3"/>
  <text x="180" y="97" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">10</text>
  <text x="180" y="130" fill="#3B82F6" font-size="12" text-anchor="middle">LEFT ←</text>
  <rect x="220" y="70" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="250" y="97" fill="#fff" text-anchor="middle" font-size="18">20</text>
  <rect x="290" y="70" width="60" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="320" y="97" fill="#fff" text-anchor="middle" font-size="18">30</text>
  <rect x="360" y="70" width="60" height="45" fill="#10B981" opacity="0.6" stroke="#10B981" stroke-width="3"/>
  <text x="390" y="97" fill="#fff" text-anchor="middle" font-size="18" font-weight="bold">40</text>
  <text x="390" y="130" fill="#10B981" font-size="12" text-anchor="middle">→ RIGHT</text>
  <rect x="430" y="70" width="60" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="460" y="97" fill="#94a3b8" text-anchor="middle" font-size="16">49</text>
  <path d="M 110 65 L 150 65" stroke="#fbbf24" stroke-width="2" marker-end="url(#arM)"/>
  <path d="M 460 65 L 420 65" stroke="#fbbf24" stroke-width="2" marker-end="url(#arM)"/>
  <text x="135" y="60" fill="#fbbf24" font-size="11">moved →</text>
  <text x="435" y="60" fill="#fbbf24" font-size="11">← moved</text>
  <text x="300" y="155" fill="#10B981" text-anchor="middle" font-size="14" font-weight="bold">Pointers converge toward solution</text>
  <text x="300" y="175" fill="#94a3b8" text-anchor="middle" font-size="12">If sum < target: left++ | If sum > target: right--</text>
  <defs><marker id="arM" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24"/></marker></defs>
</svg>`
      },
      {
        id: 'sliding-window-init',
        description: '🪟 Step 8: Sliding Window - Window size k=3',
        code: 'int windowSum = 0;\nfor(int i=0; i<k; i++) windowSum += arr[i];',
        highlightElements: ['arr[0]', 'arr[1]', 'arr[2]'],
        visualContent: `<svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 8: Initial Window (k=3)</text>
  <text x="300" y="45" fill="#c084fc" text-anchor="middle" font-size="12">Find maximum sum of 3 consecutive elements</text>
  <rect x="80" y="70" width="70" height="45" fill="#F59E0B" opacity="0.6" stroke="#F59E0B" stroke-width="3"/>
  <text x="115" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">2</text>
  <text x="115" y="130" fill="#F59E0B" font-size="10" text-anchor="middle">WINDOW</text>
  <rect x="160" y="70" width="70" height="45" fill="#F59E0B" opacity="0.6" stroke="#F59E0B" stroke-width="3"/>
  <text x="195" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">1</text>
  <text x="195" y="130" fill="#F59E0B" font-size="10" text-anchor="middle">WINDOW</text>
  <rect x="240" y="70" width="70" height="45" fill="#F59E0B" opacity="0.6" stroke="#F59E0B" stroke-width="3"/>
  <text x="275" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">5</text>
  <text x="275" y="130" fill="#F59E0B" font-size="10" text-anchor="middle">WINDOW</text>
  <rect x="320" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="355" y="97" fill="#94a3b8" text-anchor="middle" font-size="18">3</text>
  <rect x="400" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="435" y="97" fill="#94a3b8" text-anchor="middle" font-size="18">4</text>
  <rect x="480" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="515" y="97" fill="#94a3b8" text-anchor="middle" font-size="18">6</text>
  <path d="M 80 55 L 80 70 L 310 70 L 310 55" stroke="#F59E0B" stroke-width="3" fill="none"/>
  <text x="195" y="50" fill="#F59E0B" text-anchor="middle" font-size="14" font-weight="bold">Window of 3</text>
  <text x="300" y="155" fill="#fbbf24" text-anchor="middle" font-size="14">windowSum = 2 + 1 + 5 = 8</text>
  <text x="300" y="172" fill="#94a3b8" text-anchor="middle" font-size="11">Initial window computation</text>
</svg>`
      },
      {
        id: 'sliding-window-slide',
        description: '↪️ Step 9: Slide window right: Remove arr[0], Add arr[3]',
        code: 'windowSum = windowSum - arr[i-k] + arr[i];',
        highlightElements: ['arr[1]', 'arr[2]', 'arr[3]'],
        visualContent: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 9: Slide Window Right</text>
  <rect x="80" y="70" width="70" height="45" fill="#f87171" opacity="0.4" stroke="#f87171" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="115" y="97" fill="#f87171" text-anchor="middle" font-size="18">2</text>
  <text x="115" y="130" fill="#f87171" font-size="10" text-anchor="middle">REMOVE</text>
  <rect x="160" y="70" width="70" height="45" fill="#F59E0B" opacity="0.6" stroke="#F59E0B" stroke-width="3"/>
  <text x="195" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">1</text>
  <text x="195" y="130" fill="#F59E0B" font-size="10" text-anchor="middle">WINDOW</text>
  <rect x="240" y="70" width="70" height="45" fill="#F59E0B" opacity="0.6" stroke="#F59E0B" stroke-width="3"/>
  <text x="275" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">5</text>
  <text x="275" y="130" fill="#F59E0B" font-size="10" text-anchor="middle">WINDOW</text>
  <rect x="320" y="70" width="70" height="45" fill="#10B981" opacity="0.6" stroke="#10B981" stroke-width="3"/>
  <text x="355" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">3</text>
  <text x="355" y="130" fill="#10B981" font-size="10" text-anchor="middle">ADD</text>
  <rect x="400" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="435" y="97" fill="#94a3b8" text-anchor="middle" font-size="18">4</text>
  <rect x="480" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="515" y="97" fill="#94a3b8" text-anchor="middle" font-size="18">6</text>
  <path d="M 160 55 L 160 70 L 390 70 L 390 55" stroke="#F59E0B" stroke-width="3" fill="none"/>
  <text x="275" y="50" fill="#F59E0B" text-anchor="middle" font-size="14" font-weight="bold">New Window</text>
  <path d="M 125 85 L 145 85" stroke="#fbbf24" stroke-width="2" marker-end="url(#arS)"/>
  <text x="300" y="155" fill="#fbbf24" text-anchor="middle" font-size="14">windowSum = 8 - 2 + 3 = 9</text>
  <text x="300" y="172" fill="#94a3b8" text-anchor="middle" font-size="11">Remove leftmost, add rightmost</text>
  <text x="300" y="187" fill="#10B981" text-anchor="middle" font-size="12">O(1) per slide - No recalculation needed!</text>
  <defs><marker id="arS" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24"/></marker></defs>
</svg>`
      },
      {
        id: 'binary-search-init',
        description: '🔎 Step 10: Binary Search - Array [10,20,30,40,50], Find 30',
        code: 'int left=0, right=4, target=30;',
        highlightElements: ['search'],
        visualContent: `<svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 10: Binary Search - Find 30</text>
  <text x="300" y="45" fill="#c084fc" text-anchor="middle" font-size="12">Sorted Array [10, 20, 30, 40, 50]</text>
  <rect x="80" y="70" width="70" height="45" fill="#3B82F6" opacity="0.4" stroke="#3B82F6" stroke-width="2"/>
  <text x="115" y="97" fill="#fff" text-anchor="middle" font-size="18">10</text>
  <text x="115" y="125" fill="#3B82F6" font-size="10" text-anchor="middle">left = 0</text>
  <rect x="160" y="70" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="195" y="97" fill="#fff" text-anchor="middle" font-size="18">20</text>
  <rect x="240" y="70" width="70" height="45" fill="#fbbf24" opacity="0.6" stroke="#fbbf24" stroke-width="3"/>
  <text x="275" y="97" fill="#fff" text-anchor="middle" font-size="20" font-weight="bold">30</text>
  <text x="275" y="125" fill="#fbbf24" font-size="10" text-anchor="middle">mid = 2</text>
  <rect x="320" y="70" width="70" height="45" fill="#94a3b8" opacity="0.3" stroke="#fff" stroke-width="1"/>
  <text x="355" y="97" fill="#fff" text-anchor="middle" font-size="18">40</text>
  <rect x="400" y="70" width="70" height="45" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="2"/>
  <text x="435" y="97" fill="#fff" text-anchor="middle" font-size="18">50</text>
  <text x="435" y="125" fill="#10B981" font-size="10" text-anchor="middle">right = 4</text>
  <text x="300" y="155" fill="#fbbf24" text-anchor="middle" font-size="14">mid = (0 + 4) / 2 = 2</text>
  <text x="300" y="172" fill="#22d3ee" text-anchor="middle" font-size="12">Check middle element first</text>
</svg>`
      },
      {
        id: 'binary-search-mid',
        description: '📍 Step 11: Calculate mid = (0+4)/2 = 2, arr[2]=30 ✓',
        code: 'int mid = (left + right) / 2;\nif(arr[mid] == target) return mid;',
        highlightElements: ['arr[2]'],
        visualContent: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Step 11: Target Found!</text>
  <rect x="80" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="115" y="97" fill="#94a3b8" text-anchor="middle" font-size="16">10</text>
  <rect x="160" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="195" y="97" fill="#94a3b8" text-anchor="middle" font-size="16">20</text>
  <rect x="240" y="70" width="70" height="45" fill="#10B981" opacity="0.7" stroke="#10B981" stroke-width="4"/>
  <text x="275" y="97" fill="#fff" text-anchor="middle" font-size="24" font-weight="bold">30</text>
  <text x="275" y="125" fill="#10B981" font-size="12" text-anchor="middle">FOUND! ✓</text>
  <circle cx="275" cy="40" r="20" fill="none" stroke="#10B981" stroke-width="3"/>
  <path d="M 275 40 L 275 65" stroke="#10B981" stroke-width="3" marker-end="url(#arF)"/>
  <rect x="320" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="355" y="97" fill="#94a3b8" text-anchor="middle" font-size="16">40</text>
  <rect x="400" y="70" width="70" height="45" fill="#94a3b8" opacity="0.2" stroke="#fff" stroke-width="1"/>
  <text x="435" y="97" fill="#94a3b8" text-anchor="middle" font-size="16">50</text>
  <text x="300" y="155" fill="#10B981" text-anchor="middle" font-size="16" font-weight="bold">arr[mid] == target</text>
  <text x="300" y="175" fill="#22d3ee" text-anchor="middle" font-size="13">return index 2</text>
  <text x="300" y="192" fill="#fbbf24" text-anchor="middle" font-size="11">Found in O(log n) time - Only 1 comparison!</text>
  <defs><marker id="arF" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto"><path d="M0,0 L10,0 L5,9 z" fill="#10B981"/></marker></defs>
</svg>`
      }
    ],

    embeddedVideos: [
      {
        id: 'video-arrays-intro',
        title: 'Arrays Fundamentals - Abdul Bari',
        url: 'https://www.youtube.com/embed/AT14lCXuMKI',
        duration: '12:45',
        platform: 'YouTube',
        thumbnail: 'https://img.youtube.com/vi/AT14lCXuMKI/maxresdefault.jpg'
      },
      {
        id: 'video-two-pointer',
        title: 'Two Pointer Technique Explained',
        url: 'https://www.youtube.com/embed/On03HWe2tZM',
        duration: '8:30',
        platform: 'YouTube',
        thumbnail: 'https://img.youtube.com/vi/On03HWe2tZM/maxresdefault.jpg'
      },
      {
        id: 'video-sliding-window',
        title: 'Sliding Window Pattern',
        url: 'https://www.youtube.com/embed/jM2dhDPYMQM',
        duration: '15:20',
        platform: 'YouTube',
        thumbnail: 'https://img.youtube.com/vi/jM2dhDPYMQM/maxresdefault.jpg'
      }
    ],

    timeComplexity: `**Access**: O(1) - Direct index access
**Search**: O(n) - Linear scan required
**Insertion**: O(n) - Shift elements (O(1) at end)
**Deletion**: O(n) - Shift elements (O(1) at end)`,

    spaceComplexity: `**Static Array**: O(n) - Fixed space
**Dynamic Array**: O(n) - Amortized with occasional O(2n) during resize`,

    commonMistakes: [
      '❌ **Off-by-one errors**: Using `arr.length` instead of `arr.length - 1` for last index',
      '❌ **Index out of bounds**: Not checking if index exists before accessing',
      '❌ **Modifying while iterating**: Changing array size during loop causes skipped elements',
      '❌ **Forgetting sorted array advantage**: Missing O(log n) binary search opportunity',
      '❌ **Not handling edge cases**: Empty array [], single element [1], all duplicates',
      '❌ **Integer overflow**: Sum of large numbers exceeding language limits',
      '❌ **Wrong complexity**: Using nested loops when two-pointer would be O(n)'
    ],

    bestPractices: [
      '✅ Always clarify: Is array sorted? Any duplicates? Negative numbers allowed?',
      '✅ Consider multiple approaches: Brute force → Optimize → Edge cases',
      '✅ Use two pointers for sorted arrays or palindrome checks',
      '✅ Apply sliding window for contiguous subarray problems',
      '✅ HashMap for O(1) lookups when needed',
      '✅ Think in-place to save O(n) space',
      '✅ Dry run with examples before coding'
    ],

    resources: [
      {
        title: 'Visualgo - Array Visualizations',
        url: 'https://visualgo.net/en/array',
        type: 'interactive'
      },
      {
        title: 'Take U Forward - Array Patterns',
        url: 'https://takeuforward.org/arrays/striver-array-series/',
        type: 'article'
      },
      {
        title: 'GeeksforGeeks - Array Data Structure',
        url: 'https://www.geeksforgeeks.org/array-data-structure/',
        type: 'article'
      },
      {
        title: 'MIT OCW - Introduction to Algorithms',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        type: 'video'
      },
      {
        title: 'Abdul Bari - Arrays Playlist',
        url: 'https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
        type: 'video'
      }
    ]
  },

  strings: {
    conceptOverview: `Strings are sequences of characters - the backbone of text processing, pattern matching, and communication protocols. String manipulation appears in 30% of coding interviews and is essential for parsing, validation, and algorithmic thinking.`,
    
    whyItMatters: `🎯 **Interview Impact**: String problems test your understanding of character manipulation, pattern recognition, and optimization.

**Real-World Usage**:
• Text editors and IDEs
• Search engines (pattern matching)
• Data validation and parsing
• Cryptography and encoding`,

    coreExplanation: `**What is a String?**

A string is an immutable sequence of characters. In most languages, strings are:

✅ **Immutable**: Cannot be changed after creation (creates new string)
✅ **Array-like**: Can access characters via indexing
✅ **Rich API**: Built-in methods for manipulation

**Key Operations:**
\`\`\`javascript
const str = "hello";
str[0]              // 'h' - O(1) access
str.length          // 5
str.substring(1, 3) // "el"
str.split("")       // ['h','e','l','l','o']
str.charAt(0)       // 'h'
\`\`\`

**Common Patterns:**
• Two Pointer (palindrome check)
• Sliding Window (substrings)
• HashMap (anagrams, frequency)
• Stack (parentheses matching)`,

    visualDiagrams: [
      {
        id: 'string-palindrome',
        title: 'Palindrome Check with Two Pointers',
        description: 'Comparing characters from both ends',
        svgContent: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
  <text x="200" y="50" fill="#fff" text-anchor="middle" font-size="24">RACECAR</text>
  <line x1="170" y1="70" x2="170" y2="90" stroke="#3B82F6" stroke-width="2"/>
  <line x1="230" y1="70" x2="230" y2="90" stroke="#10B981" stroke-width="2"/>
  <text x="170" y="110" fill="#3B82F6" text-anchor="middle">LEFT</text>
  <text x="230" y="110" fill="#10B981" text-anchor="middle">RIGHT</text>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'step-1',
        description: 'Initialize string: "racecar"',
        code: 'const str = "racecar";',
        highlightElements: ['str']
      },
      {
        id: 'step-2',
        description: 'Set pointers at both ends: left = 0, right = 6',
        code: 'let left = 0, right = str.length - 1;',
        highlightElements: ['str[0]', 'str[6]']
      },
      {
        id: 'step-3',
        description: 'Compare characters: str[0] === str[6] → "r" === "r" ✓',
        code: 'if (str[left] === str[right]) { /* match */ }',
        highlightElements: ['str[0]', 'str[6]']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-strings-basics',
        title: 'String Manipulation Basics',
        url: 'https://www.youtube.com/embed/ajit1oC7R1Y',
        duration: '10:15',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**Access**: O(1)
**Concatenation**: O(n) - creates new string
**Substring**: O(k) where k is substring length
**Search**: O(n*m) naive, O(n) KMP algorithm`,

    spaceComplexity: `**Immutable strings**: Each operation may create O(n) new string
**StringBuilder/Array approach**: O(n) mutable working space`,

    commonMistakes: [
      '❌ String concatenation in loop (creates n strings)',
      '❌ Not using StringBuilder/Array for multiple modifications',
      '❌ Case sensitivity not considered',
      '❌ Unicode and multi-byte character issues'
    ],

    bestPractices: [
      '✅ Use array/StringBuilder for multiple string modifications',
      '✅ Consider case-insensitive comparisons',
      '✅ Use built-in methods (split, join, slice) when appropriate',
      '✅ HashMap for character frequency problems'
    ],

    resources: [
      {
        title: 'Take U Forward - String Algorithms',
        url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
        type: 'article'
      },
      {
        title: 'GeeksforGeeks - String Algorithms',
        url: 'https://www.geeksforgeeks.org/string-data-structure/',
        type: 'article'
      }
    ]
  },

  'linked-lists': {
    conceptOverview: `Linked Lists are dynamic linear data structures where elements (nodes) are connected via pointers. Unlike arrays, they don't require contiguous memory, allowing efficient insertions and deletions. Essential for 25% of interview problems and understanding pointers/memory.`,
    
    whyItMatters: `🎯 **Interview Impact**: Linked list problems test pointer manipulation and memory concepts - core to system design and low-level programming.

**Real-World Usage**: 
• Operating system process scheduling
• Browser history (back/forward navigation)
• Music player playlists
• Undo/Redo functionality`,

    coreExplanation: `**What is a Linked List?**

A linked list is a collection of objects (nodes) where each node contains data and a reference (link) to the next node in the sequence. Unlike arrays, linked lists don't require contiguous memory allocation.

**From "Data Structures & Algorithms in Java" (6th Edition, Chapter 3):**

✅ **Dynamic Memory Allocation**: Linked lists can grow and shrink during execution without the need for costly reallocation and copying of elements.

✅ **Efficient Insertions/Deletions**: Adding or removing elements at known positions takes O(1) time, compared to O(n) for arrays.

✅ **No Wasted Memory**: Each node is allocated exactly when needed, avoiding the unused capacity common in array-based structures.

**Node Structure:**
\`\`\`java
class Node<E> {
  E element;          // Reference to the element
  Node<E> next;       // Reference to next node
  
  Node(E e, Node<E> n) {
    element = e;
    next = n;
  }
}
\`\`\`

**Types of Linked Lists (Textbook Chapter 3.2):**

📌 **Singly Linked List**: Each node has one link pointing to the next node. The last node points to null.
   • Simple implementation
   • Memory efficient (one pointer per node)
   • Forward traversal only

📌 **Doubly Linked List**: Each node has two links - one to the next node and one to the previous node.
   • Bidirectional traversal
   • Efficient deletion of given node (no need to find predecessor)
   • Uses more memory (two pointers per node)

📌 **Circular Linked List**: The last node points back to the first node, forming a circle.
   • Useful for round-robin scheduling
   • Any node can be a starting point
   • Requires care to avoid infinite loops

**Linked List Operations Complexity:**

• **Access element at index i**: O(i) - Must traverse from head
• **Search for element**: O(n) - Linear scan required
• **Insert at head**: O(1) - Update head pointer
• **Insert at tail**: O(n) for singly, O(1) for doubly with tail pointer
• **Insert after node**: O(1) - Given direct node reference
• **Delete at head**: O(1) - Update head pointer
• **Delete at tail**: O(n) for singly, O(1) for doubly
• **Delete given node**: O(1) for doubly, O(n) for singly (need predecessor)

**Memory Layout:**
Unlike arrays, linked list nodes can be scattered throughout memory:
\`\`\`
Node 1 (addr: 1000)  ->  Node 2 (addr: 2500)  ->  Node 3 (addr: 1200)  ->  null
[data: 10 | next: 2500]  [data: 20 | next: 1200]  [data: 30 | next: null]
\`\`\`

**Textbook Insight (Pages 122-146):**
"Linked lists provide an elegant alternative to array-based sequences. While we lose the ability to access an arbitrary element in constant time, we gain the ability to add or remove elements at arbitrary positions without having to shift other elements."

**Key Advantages Over Arrays:**
• No need to predict maximum size in advance
• Insertion/deletion doesn't require shifting elements
• Can easily concatenate two lists in O(1)
• Memory grows/shrinks dynamically

**Key Disadvantages:**
• No constant-time random access
• Extra memory for storing pointers
• Not cache-friendly (nodes scattered in memory)
• Cannot use binary search efficiently

**Common Linked List Patterns:**
1. **Two Pointers (Fast/Slow)**: Detect cycle, find middle, nth from end
2. **Dummy Node**: Simplify edge cases for insertion/deletion
3. **Reversal**: In-place reversal using three pointers
4. **Merge**: Merge sorted lists maintaining sorted order
5. **Runner Technique**: One pointer moves faster than another`,

    visualDiagrams: [
      {
        id: 'linked-list-node-structure',
        title: 'Linked List Node Structure',
        description: 'Node contains data and pointer to next node',
        svgContent: `<svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Node Structure</text>
  
  <!-- Single node breakdown -->
  <rect x="200" y="50" width="200" height="80" fill="#3B82F6" opacity="0.2" stroke="#22d3ee" stroke-width="2" rx="5"/>
  <line x1="300" y1="50" x2="300" y2="130" stroke="#22d3ee" stroke-width="1"/>
  
  <text x="250" y="45" fill="#fbbf24" font-size="12">Data</text>
  <text x="250" y="90" fill="#fff" text-anchor="middle" font-size="24" font-weight="bold">42</text>
  
  <text x="350" y="45" fill="#10B981" font-size="12">Next Pointer</text>
  <text x="350" y="85" fill="#10B981" text-anchor="middle" font-size="14">→</text>
  <text x="350" y="105" fill="#94a3b8" text-anchor="middle" font-size="11">addr: 2500</text>
  
  <text x="300" y="155" fill="#94a3b8" text-anchor="middle" font-size="12">Each node stores value + reference to next node</text>
  <text x="300" y="172" fill="#c084fc" text-anchor="middle" font-size="11">Unlike arrays, nodes can be anywhere in memory!</text>
</svg>`
      },
      {
        id: 'linked-list-complete',
        title: 'Singly Linked List - Complete View',
        description: 'Full linked list with head pointer and null terminator',
        svgContent: `<svg viewBox="0 0 650 150" xmlns="http://www.w3.org/2000/svg">
  <text x="325" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Linked List: 1 → 2 → 3 → null</text>
  
  <!-- Head pointer -->
  <text x="50" y="70" fill="#fbbf24" font-size="14" font-weight="bold">HEAD</text>
  <path d="M 85 65 L 110 65" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Node 1 -->
  <rect x="120" y="50" width="80" height="40" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2" rx="3"/>
  <text x="145" y="75" fill="#fff" text-anchor="middle" font-size="18">1</text>
  <line x1="160" y1="50" x2="160" y2="90" stroke="#22d3ee" stroke-width="1"/>
  <text x="180" y="75" fill="#10B981" text-anchor="middle">→</text>
  <path d="M 200 70 L 230 70" stroke="#10B981" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="160" y="105" fill="#94a3b8" font-size="9" text-anchor="middle">addr: 1000</text>
  
  <!-- Node 2 -->
  <rect x="240" y="50" width="80" height="40" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2" rx="3"/>
  <text x="265" y="75" fill="#fff" text-anchor="middle" font-size="18">2</text>
  <line x1="280" y1="50" x2="280" y2="90" stroke="#22d3ee" stroke-width="1"/>
  <text x="300" y="75" fill="#10B981" text-anchor="middle">→</text>
  <path d="M 320 70 L 350 70" stroke="#10B981" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="280" y="105" fill="#94a3b8" font-size="9" text-anchor="middle">addr: 2500</text>
  
  <!-- Node 3 -->
  <rect x="360" y="50" width="80" height="40" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2" rx="3"/>
  <text x="385" y="75" fill="#fff" text-anchor="middle" font-size="18">3</text>
  <line x1="400" y1="50" x2="400" y2="90" stroke="#22d3ee" stroke-width="1"/>
  <text x="420" y="75" fill="#f87171" text-anchor="middle">⊗</text>
  <path d="M 440 70 L 470 70" stroke="#f87171" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="400" y="105" fill="#94a3b8" font-size="9" text-anchor="middle">addr: 1200</text>
  
  <!-- Null -->
  <text x="500" y="75" fill="#f87171" font-size="14" font-weight="bold">null</text>
  
  <text x="325" y="135" fill="#94a3b8" text-anchor="middle" font-size="12">Nodes scattered in memory, connected by pointers</text>
  
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#10B981"/></marker></defs>
</svg>`
      },
      {
        id: 'linked-list-insertion',
        title: 'Insert at Head - O(1) Operation',
        description: 'Adding new node at the beginning',
        svgContent: `<svg viewBox="0 0 650 250" xmlns="http://www.w3.org/2000/svg">
  <text x="325" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Insert 0 at Head</text>
  
  <!-- Step 1: Before -->
  <text x="100" y="55" fill="#fbbf24" font-size="13">Before:</text>
  <text x="50" y="85" fill="#94a3b8" font-size="12">HEAD</text>
  <path d="M 85 80 L 110 80" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow1)"/>
  <rect x="120" y="65" width="70" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="155" y="87" fill="#fff" text-anchor="middle">1</text>
  <path d="M 190 82 L 210 82" stroke="#10B981" stroke-width="2" marker-end="url(#arrow1)"/>
  <rect x="220" y="65" width="70" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="255" y="87" fill="#fff" text-anchor="middle">2</text>
  
  <!-- Step 2: Create new node -->
  <text x="100" y="135" fill="#fbbf24" font-size="13">Step 1: Create new node</text>
  <rect x="120" y="145" width="70" height="35" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="3"/>
  <text x="155" y="167" fill="#fff" text-anchor="middle" font-weight="bold">0</text>
  <text x="155" y="195" fill="#10B981" font-size="11">newNode</text>
  
  <!-- Step 3: Link newNode.next = head -->
  <text x="350" y="135" fill="#fbbf24" font-size="13">Step 2: newNode.next = head</text>
  <rect x="300" y="145" width="70" height="35" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="3"/>
  <text x="335" y="167" fill="#fff" text-anchor="middle" font-weight="bold">0</text>
  <path d="M 370 162 L 400 162" stroke="#fbbf24" stroke-width="3" marker-end="url(#arrow2)"/>
  <rect x="410" y="145" width="70" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="445" y="167" fill="#fff" text-anchor="middle">1</text>
  <path d="M 480 162 L 500 162" stroke="#10B981" stroke-width="2" marker-end="url(#arrow1)"/>
  <rect x="510" y="145" width="70" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="545" y="167" fill="#fff" text-anchor="middle">2</text>
  
  <!-- Step 4: After - update head -->
  <text x="100" y="220" fill="#10B981" font-size="13" font-weight="bold">Step 3: head = newNode ✓</text>
  <text x="50" y="240" fill="#10B981" font-size="12" font-weight="bold">HEAD</text>
  <path d="M 85 235 L 110 235" stroke="#10B981" stroke-width="3" marker-end="url(#arrow2)"/>
  <text x="450" y="220" fill="#22d3ee" font-size="12">Time: O(1) - Just update pointers!</text>
  
  <defs>
    <marker id="arrow1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#10B981"/></marker>
    <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fbbf24"/></marker>
  </defs>
</svg>`
      },
      {
        id: 'linked-list-reversal',
        title: 'Reverse Linked List - Three Pointers',
        description: 'Reverse pointers using prev, curr, next',
        svgContent: `<svg viewBox="0 0 650 280" xmlns="http://www.w3.org/2000/svg">
  <text x="325" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Reverse List: 1→2→3 becomes 3→2→1</text>
  
  <!-- Original -->
  <text x="100" y="55" fill="#fbbf24" font-size="13">Original:</text>
  <rect x="100" y="65" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="130" y="87" fill="#fff" text-anchor="middle">1</text>
  <path d="M 160 82 L 190 82" stroke="#10B981" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="200" y="65" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="230" y="87" fill="#fff" text-anchor="middle">2</text>
  <path d="M 260 82 L 290 82" stroke="#10B981" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="300" y="65" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="330" y="87" fill="#fff" text-anchor="middle">3</text>
  <path d="M 360 82 L 390 82" stroke="#f87171" stroke-width="2" marker-end="url(#arr)"/>
  <text x="410" y="87" fill="#f87171">null</text>
  
  <!-- Reversal process -->
  <text x="100" y="135" fill="#fbbf24" font-size="13">Reversing with 3 pointers:</text>
  <text x="100" y="155" fill="#c084fc" font-size="11">prev = null, curr = 1, next = 2</text>
  
  <rect x="100" y="165" width="60" height="35" fill="#fbbf24" opacity="0.4" stroke="#fbbf24" stroke-width="2"/>
  <text x="130" y="187" fill="#fff" text-anchor="middle">1</text>
  <text x="130" y="215" fill="#fbbf24" font-size="10">curr</text>
  <path d="M 100 182 L 70 182" stroke="#f87171" stroke-width="3" marker-end="url(#arrRev)"/>
  <text x="50" y="187" fill="#f87171" font-size="11">null</text>
  <text x="40" y="205" fill="#f87171" font-size="9">prev</text>
  
  <path d="M 160 182 L 190 182" stroke="#10B981" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="200" y="165" width="60" height="35" fill="#94a3b8" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="230" y="187" fill="#fff" text-anchor="middle">2</text>
  <text x="230" y="215" fill="#10B981" font-size="10">next</text>
  
  <!-- Reversed -->
  <text x="100" y="255" fill="#10B981" font-size="13" font-weight="bold">Reversed:</text>
  <text x="410" y="273" fill="#f87171">null</text>
  <path d="M 390 268 L 360 268" stroke="#f87171" stroke-width="2" marker-end="url(#arrRev)"/>
  <rect x="300" y="253" width="60" height="35" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="2"/>
  <text x="330" y="275" fill="#fff" text-anchor="middle">3</text>
  <path d="M 300 270 L 270 270" stroke="#10B981" stroke-width="2" marker-end="url(#arrRev)"/>
  <rect x="210" y="253" width="60" height="35" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="2"/>
  <text x="240" y="275" fill="#fff" text-anchor="middle">2</text>
  <path d="M 210 270 L 180 270" stroke="#10B981" stroke-width="2" marker-end="url(#arrRev)"/>
  <rect x="120" y="253" width="60" height="35" fill="#10B981" opacity="0.4" stroke="#10B981" stroke-width="2"/>
  <text x="150" y="275" fill="#fff" text-anchor="middle">1</text>
  <text x="40" y="270" fill="#10B981" font-size="11" font-weight="bold">HEAD</text>
  <path d="M 70 268 L 110 268" stroke="#10B981" stroke-width="3" marker-end="url(#arr)"/>
  
  <defs>
    <marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#10B981"/></marker>
    <marker id="arrRev" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto"><path d="M9,0 L9,6 L0,3 z" fill="#10B981"/></marker>
  </defs>
</svg>`
      },
      {
        id: 'cycle-detection',
        title: 'Floyd\'s Cycle Detection - Tortoise and Hare',
        description: 'Fast pointer moves 2x, slow 1x - meet if cycle exists',
        svgContent: `<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="25" fill="#22d3ee" text-anchor="middle" font-size="16" font-weight="bold">Cycle Detection: Fast & Slow Pointers</text>
  
  <!-- Linked list with cycle -->
  <rect x="100" y="80" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="130" y="102" fill="#fff" text-anchor="middle">1</text>
  <text x="130" y="125" fill="#3B82F6" font-size="10">slow</text>
  <path d="M 160 97 L 190 97" stroke="#10B981" stroke-width="2" marker-end="url(#a1)"/>
  
  <rect x="200" y="80" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="230" y="102" fill="#fff" text-anchor="middle">2</text>
  <text x="230" y="125" fill="#fbbf24" font-size="10">fast</text>
  <path d="M 260 97 L 290 97" stroke="#10B981" stroke-width="2" marker-end="url(#a1)"/>
  
  <rect x="300" y="80" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="330" y="102" fill="#fff" text-anchor="middle">3</text>
  <path d="M 360 97 L 390 97" stroke="#10B981" stroke-width="2" marker-end="url(#a1)"/>
  
  <rect x="400" y="80" width="60" height="35" fill="#3B82F6" opacity="0.3" stroke="#22d3ee" stroke-width="2"/>
  <text x="430" y="102" fill="#fff" text-anchor="middle">4</text>
  
  <!-- Cycle back -->
  <path d="M 430 115 Q 430 180, 230 180 Q 230 115, 230 115" stroke="#f87171" stroke-width="3" fill="none" marker-end="url(#a2)"/>
  <text x="330" y="200" fill="#f87171" font-size="13">← Cycle back to node 2</text>
  
  <!-- Legend -->
  <rect x="100" y="140" width="400" height="50" fill="#c084fc" opacity="0.15" stroke="#c084fc" stroke-width="1" rx="5"/>
  <text x="300" y="160" fill="#fff" text-anchor="middle" font-size="12">🐢 Slow moves 1 step: slow = slow.next</text>
  <text x="300" y="177" fill="#fff" text-anchor="middle" font-size="12">🐇 Fast moves 2 steps: fast = fast.next.next</text>
  
  <text x="300" y="230" fill="#10B981" text-anchor="middle" font-size="13" font-weight="bold">If fast == slow → Cycle detected!</text>
  
  <defs>
    <marker id="a1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#10B981"/></marker>
    <marker id="a2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f87171"/></marker>
  </defs>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'll-create',
        description: '🔗 Step 1: Create Node class with data and next pointer',
        code: 'class Node {\n  int data;\n  Node next;\n  Node(int d) { data = d; next = null; }\n}',
        highlightElements: ['node-structure']
      },
      {
        id: 'll-init',
        description: '📝 Step 2: Initialize: 1 → 2 → 3 → null',
        code: 'Node head = new Node(1);\nhead.next = new Node(2);\nhead.next.next = new Node(3);',
        highlightElements: ['node1', 'node2', 'node3']
      },
      {
        id: 'll-insert-head-prep',
        description: '➕ Step 3: Insert 0 at head - Create new node',
        code: 'Node newNode = new Node(0);',
        highlightElements: ['newNode']
      },
      {
        id: 'll-insert-head-link',
        description: '🔗 Step 4: Link new node: newNode.next = head',
        code: 'newNode.next = head; // Point to current head',
        highlightElements: ['link']
      },
      {
        id: 'll-insert-head-complete',
        description: '✅ Step 5: Update head: 0 → 1 → 2 → 3 → null',
        code: 'head = newNode; // O(1) insertion!',
        highlightElements: ['head']
      },
      {
        id: 'll-delete-prep',
        description: '🗑️ Step 6: Delete node 2 - Find previous node (1)',
        code: 'Node curr = head;\nwhile(curr.next.data != 2) curr = curr.next;',
        highlightElements: ['node1']
      },
      {
        id: 'll-delete-execute',
        description: '⚡ Step 7: Skip node 2: curr.next = curr.next.next',
        code: 'curr.next = curr.next.next; // 1 → 3 (bypass 2)',
        highlightElements: ['deleted']
      },
      {
        id: 'll-delete-complete',
        description: '✅ Step 8: Result: 0 → 1 → 3 → null',
        code: '// Node 2 is now unreachable (garbage collected)',
        highlightElements: ['final']
      },
      {
        id: 'll-reverse-init',
        description: '🔄 Step 9: Reverse list - Initialize prev, curr, next',
        code: 'Node prev = null, curr = head, next = null;',
        highlightElements: ['prev', 'curr']
      },
      {
        id: 'll-reverse-iterate',
        description: '↩️ Step 10: Save next, reverse link, move pointers',
        code: 'next = curr.next;\ncurr.next = prev;\nprev = curr;\ncurr = next;',
        highlightElements: ['reverse']
      },
      {
        id: 'll-reverse-complete',
        description: '✅ Step 11: Reversed: 3 → 1 → 0 → null',
        code: 'head = prev; // New head is old tail',
        highlightElements: ['reversed']
      },
      {
        id: 'll-cycle-detect',
        description: '🐢🐇 Step 12: Detect cycle - Slow & Fast pointers',
        code: 'Node slow = head, fast = head;\nwhile(fast != null && fast.next != null) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if(slow == fast) return true; // Cycle found!\n}',
        highlightElements: ['slow', 'fast']
      },
      {
        id: 'll-middle',
        description: '📍 Step 13: Find middle - Fast moves 2x, slow at middle',
        code: 'while(fast != null && fast.next != null) {\n  slow = slow.next;\n  fast = fast.next.next;\n}\nreturn slow; // Middle node',
        highlightElements: ['middle']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-ll-basics',
        title: 'Linked Lists Explained',
        url: 'https://www.youtube.com/embed/Hj_rA0dhr2I',
        duration: '14:20',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**Access**: O(n) - Must traverse from head
**Search**: O(n) - Linear scan
**Insertion**: O(1) at head, O(n) at position
**Deletion**: O(1) at head, O(n) at position`,

    spaceComplexity: `**Space**: O(n) for n nodes + O(1) for each pointer`,

    commonMistakes: [
      '❌ Losing reference to head during modifications',
      '❌ Not handling null/empty list cases',
      '❌ Forgetting to update next pointers',
      '❌ Infinite loops in circular detection'
    ],

    bestPractices: [
      '✅ Always use dummy nodes for easier edge case handling',
      '✅ Draw diagrams to visualize pointer changes',
      '✅ Use slow/fast pointers for cycle detection',
      '✅ Handle edge cases: empty, single node, two nodes'
    ],

    resources: [
      {
        title: 'VisuAlgo - Linked List Visualization',
        url: 'https://visualgo.net/en/list',
        type: 'interactive'
      },
      {
        title: 'LeetCode Linked List Study Guide',
        url: 'https://leetcode.com/explore/learn/card/linked-list/',
        type: 'article'
      }
    ]
  },

  'stacks-queues': {
    conceptOverview: `Stacks (LIFO) and Queues (FIFO) are fundamental abstract data types that control the order of element access. They're essential for parsing, tree traversals, scheduling, and 20% of interview problems.`,
    
    whyItMatters: `🎯 **Interview Impact**: Stack/Queue problems test understanding of access patterns and are building blocks for complex algorithms like DFS/BFS.

**Real-World Usage**: 
• Function call stack (recursion)
• Browser back button (stack)
• Print queue, task scheduling (queue)
• Expression evaluation`,

    coreExplanation: `**What are Stacks and Queues?**

Stacks and Queues are fundamental Abstract Data Types (ADTs) that restrict access to elements based on specific ordering principles.

**From "Data Structures & Algorithms in Java" (6th Edition, Chapter 6):**

**STACK - LIFO (Last-In, First-Out)**

Like a stack of plates - you can only add or remove plates from the top. The last plate added is the first one to be removed.

📌 **Core Operations:**
• **push(e)**: Add element e to the top of the stack - O(1)
• **pop()**: Remove and return the top element - O(1)
• **peek()/top()**: Return (but don't remove) the top element - O(1)
• **isEmpty()**: Return true if stack is empty - O(1)
• **size()**: Return the number of elements - O(1)

✅ **Key Properties (Textbook):**
• LIFO access pattern
• All operations run in O(1) constant time
• Can be implemented using arrays or linked lists
• Fixed capacity (array) or unlimited (linked list)
• Used extensively in recursive algorithms and parsing

**Real-World Applications:**
• Function call stack in programming languages
• Undo/Redo functionality in editors
• Expression evaluation and syntax parsing
• Backtracking algorithms (DFS, maze solving)
• Browser back button navigation

**Implementation Choices:**
\`\`\`java
// Array-based: Fixed capacity, faster due to cache locality
• pro: O(1) operations, cache-friendly
• con: Fixed maximum size

// Linked-list based: Dynamic size
• pro: No capacity limit, grows as needed
• con: Extra memory for node pointers
\`\`\`

**QUEUE - FIFO (First-In, First-Out)**

Like a line at a checkout counter - the first person in line is the first to be served.

📌 **Core Operations:**
• **enqueue(e)**: Add element e to the back of queue - O(1)
• **dequeue()**: Remove and return the front element - O(1)
• **first()/peek()**: Return (but don't remove) front element - O(1)
• **isEmpty()**: Return true if queue is empty - O(1)
• **size()**: Return the number of elements - O(1)

✅ **Key Properties (Textbook):**
• FIFO access pattern
• All operations run in O(1) constant time
• Requires efficient access to both front and back
• Can be implemented using circular arrays or linked lists
• Essential for breadth-first search algorithms

**Real-World Applications:**
• CPU task scheduling
• Print queue management
• Breadth-First Search (BFS) in graphs/trees
• Request handling in web servers
• Message queues in distributed systems

**Circular Array Implementation (Textbook pg. 241-246):**
To avoid shifting elements, we use a circular array:
\`\`\`
• front: index of the front element
• back: index where next element will be inserted
• When back reaches array end, wrap to index 0
• Use modulo arithmetic: (back + 1) % capacity
\`\`\`

**Special Queue Variants:**

📌 **Deque (Double-Ended Queue)**: Can add/remove from both ends
• Combines stack and queue functionality
• addFirst(), addLast(), removeFirst(), removeLast()
• Used in sliding window problems

📌 **Priority Queue**: Elements have priorities
• Dequeue returns highest priority element
• Typically implemented with heaps
• Not strictly FIFO

**Textbook Insight (Pages 235-256):**
"Stacks and queues are among the simplest data structures, yet they are also among the most important. They serve as fundamental building blocks for more sophisticated data structures and algorithms."

**Stack vs Queue Comparison:**
\`\`\`
STACK (LIFO)              QUEUE (FIFO)
push(e)   - add top       enqueue(e) - add back
pop()     - remove top    dequeue()  - remove front
DFS       - uses stack    BFS        - uses queue
Recursion - call stack    Scheduling - task queue
\`\`\`

**Common Patterns:**
1. **Monotonic Stack**: Maintain increasing/decreasing order
2. **Stack for Parsing**: Matching parentheses, expression evaluation
3. **Queue for BFS**: Level-order tree traversal, shortest path
4. **Two Stacks = Queue**: Implement queue using two stacks
5. **Deque for Sliding Window**: Maintain min/max in window`,

    visualDiagrams: [
      {
        id: 'stack-visual',
        title: 'Stack Operations',
        description: 'Push and Pop operations',
        svgContent: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="150" y="140" width="100" height="30" fill="#3B82F6" opacity="0.3"/>
  <text x="200" y="160" fill="#fff" text-anchor="middle">10</text>
  <rect x="150" y="110" width="100" height="30" fill="#3B82F6" opacity="0.3"/>
  <text x="200" y="130" fill="#fff" text-anchor="middle">20</text>
  <rect x="150" y="80" width="100" height="30" fill="#10B981" opacity="0.3"/>
  <text x="200" y="100" fill="#fff" text-anchor="middle">30 ← TOP</text>
  <text x="200" y="50" fill="#F59E0B">PUSH/POP here</text>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'stack-init',
        description: '📚 Step 1: Create empty stack - LIFO (Last In First Out)',
        code: 'Stack<Integer> stack = new Stack<>();',
        highlightElements: ['stack']
      },
      {
        id: 'stack-push-1',
        description: '⬆️ Step 2: Push 10 - Stack: [10]',
        code: 'stack.push(10); // O(1) operation',
        highlightElements: ['10']
      },
      {
        id: 'stack-push-2',
        description: '⬆️ Step 3: Push 20 - Stack: [10, 20]',
        code: 'stack.push(20); // 20 is now on top',
        highlightElements: ['20']
      },
      {
        id: 'stack-push-3',
        description: '⬆️ Step 4: Push 30 - Stack: [10, 20, 30] ← TOP',
        code: 'stack.push(30); // 30 is now on top',
        highlightElements: ['30']
      },
      {
        id: 'stack-peek',
        description: '👁️ Step 5: Peek - View top without removing: 30',
        code: 'int top = stack.peek(); // top = 30',
        highlightElements: ['peek']
      },
      {
        id: 'stack-pop-1',
        description: '⬇️ Step 6: Pop - Remove 30 (LIFO): Stack: [10, 20]',
        code: 'int val = stack.pop(); // val = 30, O(1)',
        highlightElements: ['pop']
      },
      {
        id: 'stack-pop-2',
        description: '⬇️ Step 7: Pop - Remove 20: Stack: [10]',
        code: 'int val = stack.pop(); // val = 20',
        highlightElements: ['pop2']
      },
      {
        id: 'queue-init',
        description: '🎫 Step 8: Create queue - FIFO (First In First Out)',
        code: 'Queue<Integer> queue = new LinkedList<>();',
        highlightElements: ['queue']
      },
      {
        id: 'queue-enqueue-1',
        description: '➡️ Step 9: Enqueue 10 - Queue: [10]',
        code: 'queue.offer(10); // Add to back, O(1)',
        highlightElements: ['10']
      },
      {
        id: 'queue-enqueue-2',
        description: '➡️ Step 10: Enqueue 20 - Queue: [10, 20]',
        code: 'queue.offer(20); // 20 added to back',
        highlightElements: ['20']
      },
      {
        id: 'queue-enqueue-3',
        description: '➡️ Step 11: Enqueue 30 - Queue: FRONT [10, 20, 30] BACK',
        code: 'queue.offer(30); // 30 added to back',
        highlightElements: ['30']
      },
      {
        id: 'queue-dequeue-1',
        description: '⬅️ Step 12: Dequeue - Remove 10 (FIFO): [20, 30]',
        code: 'int val = queue.poll(); // val = 10, O(1)',
        highlightElements: ['dequeue']
      },
      {
        id: 'queue-dequeue-2',
        description: '⬅️ Step 13: Dequeue - Remove 20: [30]',
        code: 'int val = queue.poll(); // val = 20',
        highlightElements: ['dequeue2']
      },
      {
        id: 'circular-queue',
        description: '🔄 Step 14: Circular Queue - Front & Back wrap around',
        code: 'back = (back + 1) % capacity; // Wrap using modulo',
        highlightElements: ['circular']
      },
      {
        id: 'parentheses-check',
        description: '✓ Step 15: Stack Application - Valid Parentheses (([]))',
        code: 'if (ch == \')\') {\n  if (stack.isEmpty() || stack.pop() != \'(\')\n    return false;\n}',
        highlightElements: ['parentheses']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-stack-queue',
        title: 'Stacks and Queues Explained',
        url: 'https://www.youtube.com/embed/wjI1WNcIntg',
        duration: '12:10',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**All Operations**: O(1) - constant time
**Space**: O(n) for n elements`,

    spaceComplexity: `**Space**: O(n) to store n elements`,

    commonMistakes: [
      '❌ Pop/dequeue on empty stack/queue',
      '❌ Not checking isEmpty() before operations',
      '❌ Confusing stack (LIFO) with queue (FIFO)'
    ],

    bestPractices: [
      '✅ Use stack for DFS, backtracking, undo operations',
      '✅ Use queue for BFS, level-order traversal',
      '✅ Always check if empty before pop/dequeue',
      '✅ Consider deque (double-ended queue) for flexibility'
    ],

    resources: [
      {
        title: 'VisuAlgo - Stack/Queue Visualization',
        url: 'https://visualgo.net/en/list',
        type: 'interactive'
      },
      {
        title: 'GeeksforGeeks - Stack Data Structure',
        url: 'https://www.geeksforgeeks.org/stack-data-structure/',
        type: 'article'
      }
    ]
  },

  trees: {
    conceptOverview: `Trees are hierarchical data structures with a root node and child nodes forming parent-child relationships. They're fundamental for databases, file systems, and 30% of interview problems including BST, traversals, and tree DP.`,
    
    whyItMatters: `🎯 **Interview Impact**: Tree problems test recursion mastery and are asked in 8/10 FAANG interviews.

**Real-World Usage**: 
• File system directories
• Database indexing (B-trees)
• DOM in web browsers
• Decision trees in ML`,

    coreExplanation: `**What is a Tree?**

A tree is a hierarchical data structure consisting of nodes connected by edges, with a single root node and no cycles. Trees are one of the most important non-linear data structures in computer science.

**From "Data Structures & Algorithms in Java" (6th Edition, Chapter 8):**

✅ **Hierarchical Organization**: Trees naturally model hierarchical relationships like file systems, organizational charts, and inheritance hierarchies.

✅ **Efficient Search**: Binary Search Trees enable O(log n) search, insertion, and deletion in balanced trees - much faster than linear structures.

✅ **Recursive Nature**: Tree structure is inherently recursive, making many tree algorithms elegant and intuitive.

**Fundamental Tree Terminology (Textbook pg. 305-310):**

📌 **Root**: The topmost node with no parent (starting point of the tree)

📌 **Parent/Child**: A node u is parent of node v if there's an edge from u to v. Node v is a child of u.

📌 **Siblings**: Nodes with the same parent

📌 **Leaf (External Node)**: A node with no children

📌 **Internal Node**: A node with at least one child

📌 **Ancestor/Descendant**: 
   • Node u is ancestor of v if u is on the path from root to v
   • Node v is descendant of u if v is reachable from u going down

📌 **Depth**: Number of ancestors of a node (excluding the node itself)
   • Root has depth 0
   • Depth of node = depth of parent + 1

📌 **Height**: 
   • Height of node = maximum depth of its descendants
   • Height of tree = height of root
   • Empty tree has height -1, single node has height 0

📌 **Subtree**: Tree consisting of a node and all its descendants

📌 **Level**: All nodes at the same depth

**Binary Tree (Textbook Chapter 8.1):**

A binary tree is an ordered tree where every node has at most two children, designated as left child and right child.

\`\`\`java
class TreeNode<E> {
  E element;              // Data stored at this node
  TreeNode<E> parent;     // Reference to parent (can be null for root)
  TreeNode<E> left;       // Reference to left child
  TreeNode<E> right;      // Reference to right child
}
\`\`\`

**Properties of Binary Trees:**
• Maximum nodes at level i: 2^i
• Maximum nodes in tree of height h: 2^(h+1) - 1
• Minimum height for n nodes: ⌊log₂ n⌋
• n nodes means exactly n-1 edges

**Types of Binary Trees:**

📌 **Full Binary Tree**: Every node has 0 or 2 children (no node has exactly 1 child)

📌 **Complete Binary Tree**: All levels completely filled except possibly the last, which is filled left to right
   • Used in heap data structure
   • Can be efficiently stored in array

📌 **Perfect Binary Tree**: All internal nodes have 2 children and all leaves at same level
   • Has exactly 2^(h+1) - 1 nodes

📌 **Balanced Binary Tree**: Height is O(log n) where n is number of nodes
   • AVL trees and Red-Black trees maintain balance

**Binary Search Tree (BST) - Textbook Chapter 11:**

A binary tree with the ordering property:
• All keys in left subtree < node's key
• All keys in right subtree > node's key
• Both subtrees are also BSTs

\`\`\`
Search, Insert, Delete in BST:
• Best/Average Case: O(log n) - balanced tree
• Worst Case: O(n) - degenerate to linked list
• Space: O(n) for n nodes
\`\`\`

**Tree Traversals (Textbook pg. 317-322):**

📌 **Preorder (Root-Left-Right)**: Visit root, traverse left, traverse right
   • Use: Copy tree, prefix expression evaluation
   • Example: 1-2-4-5-3 for tree with root 1

📌 **Inorder (Left-Root-Right)**: Traverse left, visit root, traverse right
   • Use: Get sorted sequence from BST
   • Example: 4-2-5-1-3 gives sorted output

📌 **Postorder (Left-Right-Root)**: Traverse left, traverse right, visit root
   • Use: Delete tree, postfix evaluation, calculating directory sizes
   • Example: 4-5-2-3-1 processes children before parent

📌 **Level-Order (Breadth-First)**: Visit nodes level by level
   • Uses queue data structure
   • Example: 1-2-3-4-5 visits by levels

**Traversal Implementation Patterns:**
\`\`\`java
// Recursive Inorder (elegant, uses call stack)
void inorder(TreeNode node) {
  if (node == null) return;
  inorder(node.left);
  visit(node);           // Process node
  inorder(node.right);
}

// Iterative Inorder (uses explicit stack)
void inorderIterative(TreeNode root) {
  Stack<TreeNode> stack = new Stack<>();
  TreeNode curr = root;
  while (curr != null || !stack.isEmpty()) {
    while (curr != null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    visit(curr);
    curr = curr.right;
  }
}
\`\`\`

**Tree Operation Complexities:**

| Operation | BST (Balanced) | BST (Worst) | Complete Binary Tree |
|-----------|----------------|-------------|---------------------|
| Search    | O(log n)       | O(n)        | O(n)                |
| Insert    | O(log n)       | O(n)        | O(log n)            |
| Delete    | O(log n)       | O(n)        | O(log n)            |
| Find Min  | O(log n)       | O(n)        | O(1) for heap       |
| Traversal | O(n)           | O(n)        | O(n)                |

**Textbook Insight (Pages 305-360):**
"Trees are one of the most fundamental structures in computer science. Unlike linear structures such as arrays and linked lists, trees are hierarchical. This hierarchy allows for efficient searching and sorting, making trees ideal for implementing dictionaries, priority queues, and many other abstract data types."

**Common Tree Algorithms:**
1. **Height Calculation**: Recursively find max(left_height, right_height) + 1
2. **Size Calculation**: Count nodes recursively
3. **Path Sum**: Check if path from root to leaf equals target
4. **Lowest Common Ancestor (LCA)**: Find deepest node that's ancestor of both nodes
5. **Level Order Traversal**: Use queue for BFS traversal
6. **Serialize/Deserialize**: Convert tree to string and back
7. **Balance Check**: Verify height difference ≤ 1 for all nodes
8. **Mirror Tree**: Swap left and right subtrees recursively`,

    visualDiagrams: [
      {
        id: 'tree-structure',
        title: 'Binary Tree Structure',
        description: 'Visual representation of binary tree',
        svgContent: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="40" r="20" fill="#3B82F6" opacity="0.3"/>
  <text x="200" y="45" fill="#fff" text-anchor="middle">1</text>
  <line x1="200" y1="60" x2="150" y2="90" stroke="#94a3b8" stroke-width="2"/>
  <line x1="200" y1="60" x2="250" y2="90" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="150" cy="100" r="20" fill="#10B981" opacity="0.3"/>
  <text x="150" y="105" fill="#fff" text-anchor="middle">2</text>
  <circle cx="250" cy="100" r="20" fill="#10B981" opacity="0.3"/>
  <text x="250" y="105" fill="#fff" text-anchor="middle">3</text>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'tree-node-create',
        description: '🌳 Step 1: Create TreeNode class',
        code: 'class TreeNode {\n  int data;\n  TreeNode left, right;\n  TreeNode(int d) { data = d; }\n}',
        highlightElements: ['node']
      },
      {
        id: 'tree-init',
        description: '📝 Step 2: Create root node with value 50',
        code: 'TreeNode root = new TreeNode(50);',
        highlightElements: ['root']
      },
      {
        id: 'bst-insert-30',
        description: '➕ Step 3: Insert 30 - Goes left (30 < 50)',
        code: 'if (30 < root.data) root.left = new TreeNode(30);',
        highlightElements: ['left']
      },
      {
        id: 'bst-insert-70',
        description: '➕ Step 4: Insert 70 - Goes right (70 > 50)',
        code: 'if (70 > root.data) root.right = new TreeNode(70);',
        highlightElements: ['right']
      },
      {
        id: 'bst-insert-20',
        description: '➕ Step 5: Insert 20 - Left of 30 (20 < 30 < 50)',
        code: '// Tree: 50\n//       /  \\\n//      30  70\n//     /\n//    20',
        highlightElements: ['20']
      },
      {
        id: 'bst-search-init',
        description: '🔍 Step 6: Search for 30 - Start at root (50)',
        code: 'TreeNode curr = root;',
        highlightElements: ['search']
      },
      {
        id: 'bst-search-left',
        description: '⬅️ Step 7: 30 < 50, move left to node 30 ✓ FOUND',
        code: 'if (target < curr.data) curr = curr.left;',
        highlightElements: ['found']
      },
      {
        id: 'inorder-init',
        description: '🔄 Step 8: Inorder Traversal - Left → Root → Right',
        code: 'void inorder(TreeNode node) {\n  if (node == null) return;',
        highlightElements: ['inorder']
      },
      {
        id: 'inorder-step',
        description: '📋 Step 9: Inorder: 20 → 30 → 50 → 70 (Sorted!)',
        code: 'inorder(node.left);\nvisit(node);\ninorder(node.right);',
        highlightElements: ['sorted']
      },
      {
        id: 'preorder',
        description: '📋 Step 10: Preorder: Root → Left → Right',
        code: 'visit(node);\npreorder(node.left);\npreorder(node.right);\n// Output: 50 → 30 → 20 → 70',
        highlightElements: ['preorder']
      },
      {
        id: 'postorder',
        description: '📋 Step 11: Postorder: Left → Right → Root',
        code: 'postorder(node.left);\npostorder(node.right);\nvisit(node);\n// Output: 20 → 30 → 70 → 50',
        highlightElements: ['postorder']
      },
      {
        id: 'level-order',
        description: '📋 Step 12: Level-Order (BFS): 50 → 30 70 → 20',
        code: 'Queue q = new LinkedList<>();\nq.offer(root);\nwhile (!q.isEmpty()) {\n  TreeNode n = q.poll();\n  visit(n);\n  if (n.left != null) q.offer(n.left);\n  if (n.right != null) q.offer(n.right);\n}',
        highlightElements: ['bfs']
      },
      {
        id: 'tree-height',
        description: '📏 Step 13: Calculate Height - max(left, right) + 1',
        code: 'int height(TreeNode node) {\n  if (node == null) return -1;\n  return 1 + Math.max(\n    height(node.left),\n    height(node.right)\n  );\n} // Height = 2',
        highlightElements: ['height']
      },
      {
        id: 'tree-size',
        description: '🔢 Step 14: Count Nodes - 1 + left + right',
        code: 'int size(TreeNode node) {\n  if (node == null) return 0;\n  return 1 + size(node.left) + size(node.right);\n} // Size = 4',
        highlightElements: ['size']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-trees',
        title: 'Tree Data Structure Explained',
        url: 'https://www.youtube.com/embed/qH6yxkw0u78',
        duration: '16:45',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**BST Search**: O(log n) balanced, O(n) worst
**Insertion**: O(log n) balanced, O(n) worst
**Traversal**: O(n) - visit all nodes`,

    spaceComplexity: `**Space**: O(n) for n nodes
**Recursion Stack**: O(h) where h is height`,

    commonMistakes: [
      '❌ Forgetting base case in recursion',
      '❌ Not handling null nodes',
      '❌ Modifying tree during traversal incorrectly',
      '❌ Confusing preorder/inorder/postorder'
    ],

    bestPractices: [
      '✅ Master the 3 traversals: preorder, inorder, postorder',
      '✅ Use recursion for most tree problems',
      '✅ Draw small examples before coding',
      '✅ Consider iterative with stack for space optimization'
    ],

    resources: [
      {
        title: 'VisuAlgo - Binary Search Tree',
        url: 'https://visualgo.net/en/bst',
        type: 'interactive'
      },
      {
        title: 'Tree Algorithms - LeetCode',
        url: 'https://leetcode.com/explore/learn/card/data-structure-tree/',
        type: 'article'
      }
    ]
  },

  graphs: {
    conceptOverview: `Graphs are collections of nodes (vertices) connected by edges, representing relationships. They're essential for networks, social connections, maps, and 25% of interview problems including BFS, DFS, shortest paths, and topological sort.`,
    
    whyItMatters: `🎯 **Interview Impact**: Graph problems test algorithmic thinking and appear in system design and advanced coding rounds.

**Real-World Usage**: 
• Social networks (friends, connections)
• Google Maps (shortest path)
• Network routing
• Recommendation systems`,

    coreExplanation: `**What is a Graph?**

A graph G = (V, E) consists of:
• **Vertices (V)**: Nodes/points
• **Edges (E)**: Connections between vertices

**Types:**
• **Directed**: Edges have direction (A → B)
• **Undirected**: Edges go both ways (A ↔ B)
• **Weighted**: Edges have costs
• **Unweighted**: All edges equal

**Representations:**
1. Adjacency Matrix: 2D array - O(V²) space
2. Adjacency List: Array of lists - O(V+E) space`,

    visualDiagrams: [
      {
        id: 'graph-visual',
        title: 'Graph Representation',
        description: 'Undirected graph example',
        svgContent: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="20" fill="#3B82F6" opacity="0.3"/>
  <text x="100" y="105" fill="#fff" text-anchor="middle">A</text>
  <circle cx="200" cy="100" r="20" fill="#3B82F6" opacity="0.3"/>
  <text x="200" y="105" fill="#fff" text-anchor="middle">B</text>
  <circle cx="300" cy="100" r="20" fill="#3B82F6" opacity="0.3"/>
  <text x="300" y="105" fill="#fff" text-anchor="middle">C</text>
  <line x1="120" y1="100" x2="180" y2="100" stroke="#10B981" stroke-width="2"/>
  <line x1="220" y1="100" x2="280" y2="100" stroke="#10B981" stroke-width="2"/>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'step-1',
        description: 'Create graph with vertices A, B, C and edges A-B, B-C',
        code: 'const graph = { A: ["B"], B: ["A", "C"], C: ["B"] };',
        highlightElements: ['A', 'B', 'C']
      },
      {
        id: 'step-2',
        description: 'BFS traversal starting from A',
        code: 'function bfs(start) { const queue = [start]; const visited = new Set(); ... }',
        highlightElements: ['queue', 'visited']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-graphs',
        title: 'Graph Algorithms Explained',
        url: 'https://www.youtube.com/embed/tWVWeAqZ0WU',
        duration: '18:30',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**BFS/DFS**: O(V + E) - visit all vertices and edges
**Dijkstra's**: O((V+E) log V) with priority queue
**Adjacency List**: O(1) to O(V) per edge lookup`,

    spaceComplexity: `**Adjacency List**: O(V + E)
**Adjacency Matrix**: O(V²)
**BFS Queue**: O(V) worst case`,

    commonMistakes: [
      '❌ Not tracking visited nodes (infinite loops)',
      '❌ Confusing BFS (queue) with DFS (stack/recursion)',
      '❌ Wrong graph representation for the problem',
      '❌ Not handling disconnected components'
    ],

    bestPractices: [
      '✅ Use BFS for shortest path in unweighted graphs',
      '✅ Use DFS for connectivity, cycle detection',
      '✅ Always track visited nodes',
      '✅ Choose right representation: list vs matrix'
    ],

    resources: [
      {
        title: 'VisuAlgo - Graph Traversal',
        url: 'https://visualgo.net/en/dfsbfs',
        type: 'interactive'
      },
      {
        title: 'Graph Algorithms - CP Algorithms',
        url: 'https://cp-algorithms.com/graph/breadth-first-search.html',
        type: 'article'
      }
    ]
  },

  'dynamic-programming': {
    conceptOverview: `Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into overlapping subproblems. It's essential for 15% of hard interview problems and demonstrates advanced problem-solving skills.`,
    
    whyItMatters: `🎯 **Interview Impact**: DP problems separate mid-level from senior engineers and are common in final rounds at top companies.

**Real-World Usage**: 
• Route optimization (GPS)
• Resource allocation
• Sequence alignment (DNA)
• Compiler optimization`,

    coreExplanation: `**What is Dynamic Programming?**

DP = Recursion + Memoization/Tabulation

**Key Concepts:**
• **Optimal Substructure**: Solution contains optimal solutions to subproblems
• **Overlapping Subproblems**: Same subproblem solved multiple times

**Approaches:**
1. **Top-Down (Memoization)**: Recursion + cache
2. **Bottom-Up (Tabulation)**: Iterative, build table

**Steps:**
1. Define state (what changes)
2. Write recurrence relation
3. Identify base cases
4. Memoize or build table`,

    visualDiagrams: [
      {
        id: 'dp-fibonacci',
        title: 'Fibonacci DP Tree',
        description: 'Overlapping subproblems in Fibonacci',
        svgContent: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="40" r="20" fill="#3B82F6" opacity="0.3"/>
  <text x="200" y="45" fill="#fff" text-anchor="middle">F(5)</text>
  <circle cx="150" cy="100" r="20" fill="#10B981" opacity="0.3"/>
  <text x="150" y="105" fill="#fff" text-anchor="middle">F(4)</text>
  <circle cx="250" cy="100" r="20" fill="#10B981" opacity="0.3"/>
  <text x="250" y="105" fill="#fff" text-anchor="middle">F(3)</text>
  <line x1="200" y1="60" x2="150" y2="80" stroke="#94a3b8"/>
  <line x1="200" y1="60" x2="250" y2="80" stroke="#94a3b8"/>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'step-1',
        description: 'Fibonacci recursive (slow): F(n) = F(n-1) + F(n-2)',
        code: 'function fib(n) { if(n <= 1) return n; return fib(n-1) + fib(n-2); }',
        highlightElements: ['recursive']
      },
      {
        id: 'step-2',
        description: 'Fibonacci with memoization (fast): Store results',
        code: 'const memo = {}; function fib(n) { if(n in memo) return memo[n]; ... memo[n] = result; }',
        highlightElements: ['memo']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-dp',
        title: 'Dynamic Programming Explained',
        url: 'https://www.youtube.com/embed/oBt53YbR9Kk',
        duration: '22:15',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**Without DP**: Often O(2^n) exponential
**With DP**: Usually O(n) to O(n²)
**Space**: O(n) for memoization table`,

    spaceComplexity: `**Memoization**: O(n) recursion stack + O(n) cache
**Tabulation**: O(n) for DP table (can optimize to O(1))`,

    commonMistakes: [
      '❌ Not identifying the state correctly',
      '❌ Wrong base cases',
      '❌ Not considering all transitions',
      '❌ Forgetting to memoize'
    ],

    bestPractices: [
      '✅ Start with brute force recursion',
      '✅ Identify overlapping subproblems',
      '✅ Add memoization (top-down)',
      '✅ Convert to tabulation for better space',
      '✅ Practice common patterns: knapsack, LIS, LCS'
    ],

    resources: [
      {
        title: 'Dynamic Programming Patterns',
        url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns',
        type: 'article'
      },
      {
        title: 'DP Visualization',
        url: 'https://visualgo.net/en/recursion',
        type: 'interactive'
      }
    ]
  },

  'sorting-searching': {
    conceptOverview: `Sorting and Searching are fundamental algorithmic techniques. Sorting arranges data in order, while searching finds elements efficiently. Together they appear in 30% of interviews and underpin database operations, search engines, and optimization.`,
    
    whyItMatters: `🎯 **Interview Impact**: Understanding sorting/searching complexity is essential for optimization and algorithm analysis.

**Real-World Usage**: 
• Database query optimization
• Search engines (binary search variants)
• E-commerce sorting (price, rating)
• File system organization`,

    coreExplanation: `**What is Sorting?**

Sorting is the fundamental algorithmic problem of arranging elements in a specific order (ascending or descending). It's one of the most studied problems in computer science with numerous practical applications.

**From "Data Structures & Algorithms in Java" (6th Edition, Chapter 12):**

✅ **Critical Preprocessing**: Many algorithms become dramatically more efficient when data is sorted first (e.g., binary search, duplicate removal, database operations).

✅ **Comparison-Based Lower Bound**: Any comparison-based sorting algorithm must perform Ω(n log n) comparisons in the worst case - this is a fundamental theoretical limit.

✅ **Stability Matters**: A stable sort maintains the relative order of equal elements, important for multi-level sorting (e.g., sort by name, then by grade).

**SORTING ALGORITHMS (Textbook Chapter 12.1-12.3):**

📌 **Merge Sort - Divide and Conquer (Pages 532-543)**

Textbook: "Merge-sort is a classic divide-and-conquer algorithm that runs in O(n log n) time and is stable."

• **Algorithm**: Divide array in half, recursively sort both halves, merge sorted halves
• **Time Complexity**: O(n log n) in all cases (best, average, worst)
• **Space Complexity**: O(n) extra space for merging
• **Stability**: Yes - maintains order of equal elements
• **Best Use**: When stability is required, external sorting (large datasets)
• **Drawback**: Requires O(n) auxiliary space

\`\`\`
Merge Process (Textbook Fig 12.5):
Left:  [1, 3, 5, 7]
Right: [2, 4, 6, 8]
Merged: [1, 2, 3, 4, 5, 6, 7, 8]  (compare fronts, take smaller)
\`\`\`

**Merge Sort Complexity Analysis (Proposition 12.2):**
• Height of recursion tree: ⌈log n⌉
• Work at each level: O(n) for merging
• Total: O(n log n)

📌 **Quick Sort - Efficient Divide and Conquer (Pages 544-555)**

Textbook: "Quick-sort is generally the fastest sorting algorithm in practice, with average-case O(n log n) time."

• **Algorithm**: Choose pivot, partition around pivot, recursively sort partitions
• **Time Complexity**: 
  - Best/Average: O(n log n)
  - Worst: O(n²) - happens when pivot is always smallest/largest
• **Space Complexity**: O(log n) recursion stack in average case
• **Stability**: No - relative order may change
• **Best Use**: General-purpose sorting, when average case matters
• **Optimization**: Randomized pivot selection avoids worst case

\`\`\`
Quick Sort Steps (Textbook pg 544):
1. Divide: Pick pivot, partition into L (< pivot), E (= pivot), G (> pivot)
2. Conquer: Recursively sort L and G
3. Combine: Concatenate L + E + G
\`\`\`

**In-Place Quick Sort (Code Fragment 12.6):**
• Partitions within original array using two indices
• Swaps elements to avoid extra space
• Achieves O(1) space (excluding recursion)

📌 **Heap Sort - Guaranteed O(n log n) (Pages 373-377)**

• **Algorithm**: Build max-heap, repeatedly extract maximum
• **Time Complexity**: O(n log n) in all cases
• **Space Complexity**: O(1) - sorts in place
• **Stability**: No
• **Best Use**: When guaranteed O(n log n) and O(1) space needed

📌 **Insertion Sort - Simple for Small Arrays (Pages 110-111)**

Textbook: "Insertion-sort considers one element at a time, placing it in correct position relative to earlier elements."

• **Algorithm**: Build sorted array one item at a time
• **Time Complexity**: 
  - Best: O(n) - already sorted
  - Average/Worst: O(n²)
• **Space Complexity**: O(1)
• **Stability**: Yes
• **Best Use**: Small arrays (n < 10), nearly sorted data, online sorting

📌 **Linear-Time Sorting (Chapter 12.3)**

For special cases, we can beat the O(n log n) comparison lower bound:

**Counting Sort**: O(n + k) where k is range of values
• Counts occurrences of each value
• Requires knowing range in advance
• Use when range k is O(n)

**Radix Sort**: O(d(n + k)) where d is number of digits
• Sort digit by digit using stable sort
• Excellent for integers, strings with fixed length
• Used in practice for large datasets

**SEARCHING ALGORITHMS:**

📌 **Binary Search - Divide and Conquer (Textbook Chapter 5.1.3)**

Textbook: "Binary search is among the most important computer algorithms, allowing efficient search in sorted sequences."

• **Requirement**: Array must be sorted
• **Time Complexity**: O(log n)
• **Space Complexity**: O(1) iterative, O(log n) recursive
• **Algorithm**: Compare target with middle element, recurse on appropriate half

\`\`\`java
// Binary Search Implementation (Code Fragment 5.3)
while (low <= high) {
  int mid = (low + high) / 2;
  if (target == data[mid]) return true;
  else if (target < data[mid]) high = mid - 1;
  else low = mid + 1;
}
return false;
\`\`\`

**Binary Search Variants:**
1. **Find First Occurrence**: Leftmost position of target
2. **Find Last Occurrence**: Rightmost position of target
3. **Lower Bound**: First element ≥ target
4. **Upper Bound**: First element > target

📌 **Linear Search**: O(n) - necessary for unsorted data

**COMPARISON OF SORTING ALGORITHMS (Textbook Table 12.1):**

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |
| Radix | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | Yes |

**Textbook Insight (Pages 531-572):**
"The sorting problem is fundamental to algorithm design. While many sorting algorithms exist, understanding their trade-offs—between time complexity, space usage, stability, and performance on different input distributions—is crucial for choosing the right algorithm for a given application."

**When to Use Which Sort:**
• **Merge Sort**: Stable sort needed, linked lists, external sorting
• **Quick Sort**: General purpose, average case matters, in-place
• **Heap Sort**: Guaranteed O(n log n), memory constrained
• **Insertion Sort**: Small n, nearly sorted, online sorting
• **Counting/Radix**: Integer sorting with limited range
• **Java's Arrays.sort()**: Uses Dual-Pivot Quick Sort (primitives), Tim Sort (objects)

**Binary Search Applications:**
• Dictionary lookup
• Finding duplicates efficiently
• Square root computation
• Search in rotated sorted array
• Finding peak element`,

    visualDiagrams: [
      {
        id: 'binary-search',
        title: 'Binary Search Visualization',
        description: 'Divide and conquer approach',
        svgContent: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="40" height="40" fill="#94a3b8" opacity="0.2"/>
  <text x="70" y="75" fill="#fff" text-anchor="middle">1</text>
  <rect x="100" y="50" width="40" height="40" fill="#94a3b8" opacity="0.2"/>
  <text x="120" y="75" fill="#fff" text-anchor="middle">3</text>
  <rect x="150" y="50" width="40" height="40" fill="#F59E0B" opacity="0.3"/>
  <text x="170" y="75" fill="#fff" text-anchor="middle">5</text>
  <rect x="200" y="50" width="40" height="40" fill="#94a3b8" opacity="0.2"/>
  <text x="220" y="75" fill="#fff" text-anchor="middle">7</text>
  <rect x="250" y="50" width="40" height="40" fill="#94a3b8" opacity="0.2"/>
  <text x="270" y="75" fill="#fff" text-anchor="middle">9</text>
  <text x="170" y="110" fill="#F59E0B">MID</text>
</svg>`
      }
    ],

    animationSteps: [
      {
        id: 'step-1',
        description: 'Binary Search: Find 7 in [1,3,5,7,9]',
        code: 'let left=0, right=4, mid=2; // arr[mid]=5',
        highlightElements: ['mid']
      },
      {
        id: 'step-2',
        description: '5 < 7, so search right half: left=3',
        code: 'left = mid + 1; // left=3, right=4',
        highlightElements: ['right-half']
      },
      {
        id: 'step-3',
        description: 'New mid=3, arr[3]=7 → Found!',
        code: 'mid = Math.floor((3+4)/2); // arr[mid] === target',
        highlightElements: ['found']
      }
    ],

    embeddedVideos: [
      {
        id: 'video-sorting',
        title: 'Sorting Algorithms Visualized',
        url: 'https://www.youtube.com/embed/kPRA0W1kECg',
        duration: '15:40',
        platform: 'YouTube'
      }
    ],

    timeComplexity: `**Binary Search**: O(log n)
**Quick Sort**: O(n log n) average, O(n²) worst
**Merge Sort**: O(n log n) always
**Counting Sort**: O(n+k) where k is range`,

    spaceComplexity: `**Binary Search**: O(1)
**Quick Sort**: O(log n) recursion
**Merge Sort**: O(n) extra space`,

    commonMistakes: [
      '❌ Binary search on unsorted array',
      '❌ Integer overflow in mid calculation',
      '❌ Wrong boundary conditions (< vs <=)',
      '❌ Not handling duplicates properly'
    ],

    bestPractices: [
      '✅ Always sort before binary search',
      '✅ Use mid = left + (right-left)/2 to avoid overflow',
      '✅ Master both iterative and recursive binary search',
      '✅ Understand when to use which sorting algorithm'
    ],

    resources: [
      {
        title: 'Sorting Visualizer',
        url: 'https://visualgo.net/en/sorting',
        type: 'interactive'
      },
      {
        title: 'Binary Search Patterns',
        url: 'https://leetcode.com/discuss/general-discussion/786126/python-powerful-ultimate-binary-search-template-solved-many-problems',
        type: 'article'
      }
    ]
  }
};
