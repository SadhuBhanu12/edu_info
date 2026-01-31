"""
Generate comprehensive learning modules from extracted PDF content
Integrates textbook content for all important DSA topics
"""

import json
import re

def clean_text(text):
    """Clean extracted PDF text"""
    # Remove website watermarks
    text = text.replace('www.it-ebooks.info', '')
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove page numbers and headers
    text = re.sub(r'^\d+\s+Chapter\s+\d+\..*?\n', '', text, flags=re.MULTILINE)
    return text.strip()

def extract_key_content(pages_content):
    """Extract key educational content from pages"""
    full_text = ' '.join([p['content'] for p in pages_content])
    cleaned = clean_text(full_text)
    
    # Extract first meaningful paragraph (usually definition/overview)
    paragraphs = [p.strip() for p in cleaned.split('\n') if len(p.strip()) > 100]
    overview = paragraphs[0] if paragraphs else cleaned[:500]
    
    return {
        'overview': overview[:800],  # Keep it concise
        'full_text': cleaned
    }

# Load extracted content
print("Loading PDF content...")
with open('scripts/extracted_pdf_content_by_topic.json', encoding='utf-8') as f:
    pdf_data = json.load(f)

# Define topic priorities and enhanced descriptions
TOPIC_ENHANCEMENTS = {
    'arrays': {
        'priority': 1,
        'interview_weight': 'Very High',
        'concepts': ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'Kadane Algorithm'],
        'why_matters': 'Foundation of all data structures. Used in 40% of interview problems.',
    },
    'linked-lists': {
        'priority': 1,
        'interview_weight': 'High',
        'concepts': ['Fast & Slow Pointers', 'Reversal', 'Cycle Detection', 'Merging'],
        'why_matters': 'Tests pointer manipulation and memory management skills.',
    },
    'stacks': {
        'priority': 1,
        'interview_weight': 'High',
        'concepts': ['Monotonic Stack', 'Expression Evaluation', 'Backtracking'],
        'why_matters': 'Essential for parsing, DFS, and undo operations.',
    },
    'queues': {
        'priority': 1,
        'interview_weight': 'Medium-High',
        'concepts': ['BFS', 'Sliding Window', 'Priority Queue Applications'],
        'why_matters': 'Critical for BFS, scheduling, and stream processing.',
    },
    'recursion': {
        'priority': 1,
        'interview_weight': 'Very High',
        'concepts': ['Base Case', 'Recursive Case', 'Backtracking', 'Tree Recursion'],
        'why_matters': 'Fundamental problem-solving technique. Required for trees, graphs, DP.',
    },
    'trees': {
        'priority': 1,
        'interview_weight': 'Very High',
        'concepts': ['DFS Traversals', 'BFS', 'Binary Search Trees', 'Tree Construction'],
        'why_matters': 'Hierarchical data representation. 20% of interview problems.',
    },
    'sorting': {
        'priority': 2,
        'interview_weight': 'High',
        'concepts': ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting Sort'],
        'why_matters': 'Fundamental algorithms. Understanding sorting unlocks many optimizations.',
    },
    'hashing': {
        'priority': 2,
        'interview_weight': 'Very High',
        'concepts': ['Hash Maps', 'Hash Sets', 'Collision Resolution', 'Hash Functions'],
        'why_matters': 'O(1) lookups enable efficient solutions. Used in 30% of problems.',
    },
    'heaps': {
        'priority': 2,
        'interview_weight': 'High',
        'concepts': ['Min/Max Heap', 'Priority Queue', 'Heap Sort', 'Top K Elements'],
        'why_matters': 'Efficient priority operations. Essential for many algorithms.',
    },
    'search-trees': {
        'priority': 3,
        'interview_weight': 'Medium',
        'concepts': ['BST', 'AVL Trees', 'Red-Black Trees', 'B-Trees'],
        'why_matters': 'Self-balancing structures for ordered data.',
    },
    'graphs': {
        'priority': 2,
        'interview_weight': 'High',
        'concepts': ['DFS', 'BFS', 'Dijkstra', 'Union-Find', 'Topological Sort'],
        'why_matters': 'Models complex relationships. Common in system design interviews.',
    },
    'dynamic-programming': {
        'priority': 2,
        'interview_weight': 'Very High',
        'concepts': ['Memoization', 'Tabulation', 'State Transition', 'Optimization'],
        'why_matters': 'Optimization technique. 15-20% of hard interview problems.',
    }
}

# Generate enhanced content summary
output = []
output.append("# DSA Topics - Comprehensive Learning Guide")
output.append("\nBased on 'Data Structures and Algorithms in Java, 6th Edition'\n")
output.append("=" * 80)

# Sort by priority
sorted_topics = sorted(TOPIC_ENHANCEMENTS.items(), key=lambda x: x[1]['priority'])

for topic_id, enhancements in sorted_topics:
    if topic_id not in pdf_data:
        continue
    
    topic_data = pdf_data[topic_id]
    content_info = extract_key_content(topic_data['content'])
    
    output.append(f"\n## {topic_id.upper().replace('-', ' ')}")
    output.append(f"**Priority:** Tier {enhancements['priority']} | **Interview Weight:** {enhancements['interview_weight']}")
    output.append(f"**Pages:** {topic_data['pages']} ({len(topic_data['content'])} pages extracted)")
    output.append(f"\n**Why It Matters:** {enhancements['why_matters']}")
    output.append(f"\n**Key Concepts to Master:**")
    for concept in enhancements['concepts']:
        output.append(f"  • {concept}")
    output.append(f"\n**From the Textbook:**")
    output.append(f"{content_info['overview'][:600]}...")
    output.append("\n" + "-" * 80)

# Save summary
summary_file = 'scripts/topics_summary.txt'
with open(summary_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f"\nGenerated comprehensive summary: {summary_file}")
print(f"\nTopics processed: {len(sorted_topics)}")
print("\nNext: I'll integrate this content into learningModules.ts")

# Show priority breakdown
print("\n" + "=" * 80)
print("LEARNING PRIORITY BREAKDOWN")
print("=" * 80)
print("\nTier 1 (Essential - Master First):")
for topic_id, info in sorted_topics:
    if info['priority'] == 1:
        print(f"  ✓ {topic_id:20} - {info['interview_weight']}")

print("\nTier 2 (Very Important):")
for topic_id, info in sorted_topics:
    if info['priority'] == 2:
        print(f"  ✓ {topic_id:20} - {info['interview_weight']}")

print("\nTier 3 (Advanced):")
for topic_id, info in sorted_topics:
    if info['priority'] == 3:
        print(f"  ✓ {topic_id:20} - {info['interview_weight']}")
