/**
 * THEORY EXTRACTION SYSTEM
 * 
 * Extracts and simplifies theory from PDF based on the MASTER PROMPT guidelines:
 * - Only essential concepts
 * - Beginner-friendly language
 * - Short and scannable
 * - Supports visual learning
 */

export interface TheoryContent {
  topicName: string;
  whatIsIt: string; // 2-3 simple lines
  whyWeNeedIt: string; // Problem it solves + real-life intuition
  keyCharacteristics: string[]; // 4-6 short points
  howItWorks: string; // Conceptual explanation without code
  basicOperations: Operation[]; // Common operations
  simpleExample: string; // ONE example in words
  thingsToRemember: string[]; // 3-5 key takeaways
  visualPrompt: string; // Bridge to animation
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedReadTime: number; // in minutes
  source: string; // PDF page reference
}

export interface Operation {
  name: string;
  description: string; // 1-line explanation
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface SimplifiedTheory {
  original: TheoryContent;
  beginnerVersion: TheoryContent; // Visual only
  intermediateVersion: TheoryContent; // More details
  advancedVersion: TheoryContent; // Full complexity analysis
}

/**
 * MASTER PROMPT VALIDATOR
 * Ensures extracted theory follows all guidelines
 */
export class TheoryValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  validate(theory: TheoryContent): { valid: boolean; errors: string[]; warnings: string[] } {
    this.errors = [];
    this.warnings = [];

    // Rule 1: Check length constraints
    this.checkWhatIsIt(theory.whatIsIt);
    this.checkKeyCharacteristics(theory.keyCharacteristics);
    this.checkThingsToRemember(theory.thingsToRemember);
    
    // Rule 2: Check simplicity
    this.checkComplexity(theory);
    
    // Rule 3: Check completeness
    this.checkCompleteness(theory);
    
    // Rule 4: Check forbidden content
    this.checkForbiddenContent(theory);

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private checkWhatIsIt(text: string) {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    if (sentences.length > 3) {
      this.errors.push('❌ "What is it?" section exceeds 3 sentences');
    }
    if (text.length > 300) {
      this.warnings.push('⚠️ "What is it?" is too long (> 300 chars)');
    }
  }

  private checkKeyCharacteristics(characteristics: string[]) {
    if (characteristics.length < 4 || characteristics.length > 6) {
      this.warnings.push('⚠️ Key characteristics should be 4-6 points');
    }
    
    characteristics.forEach((char, index) => {
      if (char.split('.').length > 2) {
        this.errors.push(`❌ Characteristic ${index + 1} has multiple sentences (should be one)`);
      }
      if (char.length > 150) {
        this.warnings.push(`⚠️ Characteristic ${index + 1} is too long`);
      }
    });
  }

  private checkThingsToRemember(things: string[]) {
    if (things.length < 3 || things.length > 5) {
      this.warnings.push('⚠️ "Things to Remember" should be 3-5 points');
    }
  }

  private checkComplexity(theory: TheoryContent) {
    const forbiddenWords = [
      'theorem', 'proof', 'derivation', 'lemma', 'corollary',
      'mathematical', 'formal', 'rigorous', 'aforementioned'
    ];
    
    const allText = [
      theory.whatIsIt,
      theory.whyWeNeedIt,
      ...theory.keyCharacteristics,
      theory.howItWorks,
      ...theory.thingsToRemember
    ].join(' ').toLowerCase();

    forbiddenWords.forEach(word => {
      if (allText.includes(word)) {
        this.warnings.push(`⚠️ Avoid academic term: "${word}"`);
      }
    });
  }

  private checkCompleteness(theory: TheoryContent) {
    if (!theory.whatIsIt || theory.whatIsIt.trim().length === 0) {
      this.errors.push('❌ Missing "What is it?" section');
    }
    if (!theory.whyWeNeedIt || theory.whyWeNeedIt.trim().length === 0) {
      this.errors.push('❌ Missing "Why we need it?" section');
    }
    if (theory.keyCharacteristics.length === 0) {
      this.errors.push('❌ Missing key characteristics');
    }
    if (!theory.visualPrompt || theory.visualPrompt.trim().length === 0) {
      this.warnings.push('⚠️ Missing visual prompt bridge');
    }
  }

  private checkForbiddenContent(theory: TheoryContent) {
    const allText = JSON.stringify(theory).toLowerCase();
    
    const forbiddenPhrases = [
      'as proved in section',
      'refer to chapter',
      'historically',
      'it can be shown that',
      'without loss of generality'
    ];

    forbiddenPhrases.forEach(phrase => {
      if (allText.includes(phrase)) {
        this.errors.push(`❌ Remove academic phrase: "${phrase}"`);
      }
    });
  }
}

/**
 * THEORY SIMPLIFIER
 * Converts complex text to beginner-friendly language
 */
export class TheorySimplifier {
  /**
   * Simplification rules based on Master Prompt
   */
  private replacements: Record<string, string> = {
    // Complex → Simple
    'utilize': 'use',
    'implement': 'create',
    'instantiate': 'create',
    'initialize': 'set up',
    'terminate': 'end',
    'iterate': 'go through',
    'traverse': 'visit',
    'allocate': 'assign',
    'deallocate': 'free up',
    'subsequently': 'then',
    'prior to': 'before',
    'in order to': 'to',
    'due to the fact that': 'because',
    'make use of': 'use',
    'is able to': 'can',
    'has the ability to': 'can',
    'at this point in time': 'now',
    'in the event that': 'if',
    'for the purpose of': 'to',
    'with regard to': 'about',
    'it is important to note that': 'note that',
    'it should be noted that': 'note that',
    'asymptotic': 'growth',
    'amortized': 'average',
    'heuristic': 'practical approach',
    'deterministic': 'predictable',
    'non-deterministic': 'unpredictable'
  };

  simplify(text: string): string {
    let simplified = text;

    // Apply word replacements
    Object.entries(this.replacements).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplified = simplified.replace(regex, simple);
    });

    // Break long sentences
    simplified = this.breakLongSentences(simplified);

    // Remove passive voice where possible
    simplified = this.reducePassiveVoice(simplified);

    return simplified;
  }

  private breakLongSentences(text: string): string {
    const sentences = text.split('.');
    return sentences.map(sentence => {
      if (sentence.split(' ').length > 20) {
        // Try to split at conjunctions
        return sentence.replace(/, and /g, '. ').replace(/, which /g, '. It ');
      }
      return sentence;
    }).join('.');
  }

  private reducePassiveVoice(text: string): string {
    // Simple passive voice detection and conversion
    return text
      .replace(/is used to/g, 'helps to')
      .replace(/is needed to/g, 'helps to')
      .replace(/can be used to/g, 'can help to')
      .replace(/is employed to/g, 'helps to');
  }

  /**
   * Convert bullet points to short, punchy statements
   */
  bulletize(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.map(sentence => {
      const trimmed = sentence.trim();
      // Ensure starts with capital, ends without period (for UI consistency)
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    });
  }

  /**
   * Estimate reading time in minutes
   */
  calculateReadTime(theory: TheoryContent): number {
    const allText = [
      theory.whatIsIt,
      theory.whyWeNeedIt,
      ...theory.keyCharacteristics,
      theory.howItWorks,
      theory.simpleExample,
      ...theory.thingsToRemember
    ].join(' ');

    const wordCount = allText.split(/\s+/).length;
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

/**
 * THEORY FORMATTER
 * Formats theory for website display
 */
export class TheoryFormatter {
  formatForWebsite(theory: TheoryContent): string {
    return `
# ${theory.topicName}

⏱️ **Read time:** ${theory.estimatedReadTime} ${theory.estimatedReadTime === 1 ? 'minute' : 'minutes'}
📊 **Difficulty:** ${theory.difficulty}

---

## 🤔 What is ${theory.topicName}?

${theory.whatIsIt}

---

## 💡 Why Do We Need It?

${theory.whyWeNeedIt}

---

## 🔑 Key Characteristics

${theory.keyCharacteristics.map((char, i) => `${i + 1}. ${char}`).join('\n')}

---

## ⚙️ How It Works

${theory.howItWorks}

---

## 🛠️ Basic Operations

${theory.basicOperations.map(op => `
**${op.name}**
${op.description}
${op.timeComplexity ? `⏱️ Time: ${op.timeComplexity}` : ''}
${op.spaceComplexity ? `💾 Space: ${op.spaceComplexity}` : ''}
`).join('\n---\n')}

---

## 📝 Simple Example

${theory.simpleExample}

---

## 💭 Things to Remember

${theory.thingsToRemember.map((thing, i) => `${i + 1}. ${thing}`).join('\n')}

---

## 🎬 Next Step

${theory.visualPrompt}

---

*Source: ${theory.source}*
    `.trim();
  }

  formatForSidePanel(theory: TheoryContent): string {
    // Condensed version for side panels
    return `
### ${theory.topicName}

${theory.whatIsIt}

**Key Points:**
${theory.keyCharacteristics.slice(0, 3).map(c => `• ${c}`).join('\n')}

**Operations:**
${theory.basicOperations.slice(0, 3).map(op => `• ${op.name}: ${op.description}`).join('\n')}

[See full explanation →]
    `.trim();
  }

  formatForTooltip(theory: TheoryContent): string {
    // Ultra-condensed for tooltips
    return theory.whatIsIt.split('.')[0] + '.';
  }

  formatForCollapsible(theory: TheoryContent): {
    title: string;
    preview: string;
    fullContent: string;
  } {
    return {
      title: theory.topicName,
      preview: theory.whatIsIt,
      fullContent: this.formatForWebsite(theory)
    };
  }
}

/**
 * PROGRESSIVE DISCLOSURE SYSTEM
 * Creates beginner/intermediate/advanced versions
 */
export class ProgressiveTheoryBuilder {
  createBeginnerVersion(theory: TheoryContent): TheoryContent {
    return {
      ...theory,
      whatIsIt: this.simplifyToELI5(theory.whatIsIt),
      keyCharacteristics: theory.keyCharacteristics.slice(0, 3), // Only 3 key points
      basicOperations: theory.basicOperations.slice(0, 2), // Only 2 operations
      thingsToRemember: theory.thingsToRemember.slice(0, 3),
      visualPrompt: 'Now watch how this works step-by-step in the animation!'
    };
  }

  createIntermediateVersion(theory: TheoryContent): TheoryContent {
    return {
      ...theory,
      basicOperations: theory.basicOperations.map(op => ({
        ...op,
        timeComplexity: op.timeComplexity || 'O(?)',
        spaceComplexity: op.spaceComplexity || 'O(?)'
      }))
    };
  }

  createAdvancedVersion(theory: TheoryContent): TheoryContent {
    // Advanced version includes everything + complexity analysis
    return {
      ...theory,
      thingsToRemember: [
        ...theory.thingsToRemember,
        'Consider time-space tradeoffs',
        'Analyze worst-case vs average-case performance',
        'Think about cache locality and memory access patterns'
      ]
    };
  }

  private simplifyToELI5(text: string): string {
    // Explain Like I'm 5 transformation
    return text
      .replace(/data structure/gi, 'way to organize information')
      .replace(/algorithm/gi, 'step-by-step process')
      .replace(/complexity/gi, 'speed')
      .replace(/efficient/gi, 'fast')
      .replace(/optimal/gi, 'best')
      .replace(/traverse/gi, 'go through')
      .replace(/node/gi, 'item')
      .replace(/pointer/gi, 'connection');
  }
}

/**
 * EXAMPLE: Pre-extracted theory for Array topic
 * Following the Master Prompt structure
 */
export const arrayTheory: TheoryContent = {
  topicName: 'Arrays',
  
  whatIsIt: 'An array is a collection of items stored in continuous memory locations. Think of it as a row of numbered boxes, where each box holds one value. You can quickly access any box using its position number (index).',
  
  whyWeNeedIt: 'Arrays solve the problem of storing multiple related items without creating separate variables for each. Instead of having variable1, variable2, variable3, etc., you have one array that holds everything. This makes code cleaner and easier to manage.',
  
  keyCharacteristics: [
    'Fixed size - once created, the size cannot change',
    'Same data type - all elements must be the same type (all numbers, all strings, etc.)',
    'Index-based access - use position number to get any element instantly',
    'Continuous memory - elements are stored next to each other in memory',
    'Zero-indexed - first element is at position 0, not 1'
  ],
  
  howItWorks: 'When you create an array, the computer reserves a block of memory. Each element gets its own spot in this block. To access an element, the computer calculates its exact memory location using: start_address + (index × element_size). This math is super fast, which is why arrays are efficient.',
  
  basicOperations: [
    {
      name: 'Access',
      description: 'Get value at any position using index',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)'
    },
    {
      name: 'Update',
      description: 'Change value at any position',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)'
    },
    {
      name: 'Search',
      description: 'Find if a value exists in the array',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)'
    },
    {
      name: 'Insert',
      description: 'Add new element (may require shifting other elements)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)'
    },
    {
      name: 'Delete',
      description: 'Remove element (may require shifting other elements)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)'
    }
  ],
  
  simpleExample: 'Imagine storing test scores for 5 students. Instead of: score1=85, score2=90, score3=78, score4=92, score5=88, you use: scores = [85, 90, 78, 92, 88]. Now if you want the 3rd student\'s score, just use scores[2] (remember, counting starts at 0!).',
  
  thingsToRemember: [
    'Arrays are fast for accessing elements by index - O(1) time',
    'Inserting or deleting in the middle is slow - O(n) time due to shifting',
    'Size is fixed after creation - plan ahead or use dynamic arrays',
    'Great for storing ordered data that you access frequently',
    'In interviews, watch for index out of bounds errors'
  ],
  
  visualPrompt: 'See how array operations work visually in the animation above! Watch elements being accessed, inserted, and deleted in real-time.',
  
  difficulty: 'Easy',
  estimatedReadTime: 2,
  source: 'Data Structures and Algorithms in Java, 6th Edition - Chapter 2'
};
