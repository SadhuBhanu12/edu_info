"""
Integrate DSA PDF content into learningModules.ts
This script reads the extracted PDF content and creates comprehensive theory explanations
"""

import json
import re
from typing import Dict, List

def load_extracted_content(json_path: str) -> List[Dict]:
    """Load the extracted PDF content"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def find_chapter_pages(content: List[Dict]) -> Dict[str, Dict]:
    """Identify pages for each chapter/topic"""
    chapters = {
        'arrays': {'title': 'Arrays', 'start': 103, 'end': 150, 'chapter': 3},
        'linked-lists': {'title': 'Linked Lists', 'start': 122, 'end': 145, 'chapter': 3},
        'stacks': {'title': 'Stacks', 'start': 225, 'end': 238, 'chapter': 6},
        'queues': {'title': 'Queues', 'start': 238, 'end': 252, 'chapter': 6},
        'recursion': {'title': 'Recursion', 'start': 189, 'end': 224, 'chapter': 5},
        'trees': {'title': 'Trees', 'start': 307, 'end': 358, 'chapter': 8},
        'heaps': {'title': 'Priority Queues and Heaps', 'start': 359, 'end': 400, 'chapter': 9},
        'hashing': {'title': 'Hash Tables', 'start': 410, 'end': 445, 'chapter': 10},
        'search-trees': {'title': 'Search Trees', 'start': 459, 'end': 530, 'chapter': 11},
        'sorting': {'title': 'Sorting', 'start': 531, 'end': 572, 'chapter': 12},
        'graphs': {'title': 'Graphs', 'start': 611, 'end': 686, 'chapter': 14},
        'dynamic-programming': {'title': 'Dynamic Programming', 'start': 598, 'end': 606, 'chapter': 13}
    }
    return chapters

def extract_topic_content(content: List[Dict], topic_info: Dict) -> str:
    """Extract content for a specific topic"""
    topic_text = []
    start_page = topic_info['start']
    end_page = topic_info['end']
    
    for page_data in content:
        if start_page <= page_data['page'] <= end_page:
            text = page_data['content']
            # Clean up the text
            text = text.replace('www.it-ebooks.info', '')
            text = re.sub(r'\s+', ' ', text)
            topic_text.append(text)
    
    return '\n\n'.join(topic_text)

def generate_typescript_module(topic_id: str, topic_info: Dict, content_text: str) -> str:
    """Generate TypeScript learning module code"""
    
    # Extract key concepts, examples, etc. from content
    # This is a simplified version - you'd want more sophisticated parsing
    
    template = f"""
  '{topic_id}': {{
    conceptOverview: `{topic_info['title']} - Comprehensive coverage from Data Structures and Algorithms in Java, 6th Edition.`,
    
    whyItMatters: `🎯 **Interview Impact**: {topic_info['title']} is a fundamental concept that appears frequently in technical interviews.

**Real-World Usage**: 
• Critical for software system design
• Essential for algorithmic problem solving
• Foundation for advanced data structures`,

    coreExplanation: `**What is {topic_info['title']}?**

Based on "Data Structures and Algorithms in Java, 6th Edition" Chapter {topic_info['chapter']}.

{content_text[:1000]}...

[Content extracted from the textbook - to be refined]`,

    visualDiagrams: [
      {{
        id: '{topic_id}-diagram-1',
        title: '{topic_info['title']} Visualization',
        description: 'Visual representation from the textbook',
        imageUrl: ''
      }}
    ],

    animationSteps: [
      {{
        id: 'step-1',
        description: 'Initialize {topic_info['title']}',
        code: '// Code example from textbook',
        highlightElements: []
      }}
    ],

    commonPatterns: [
      {{
        name: 'Pattern 1',
        description: 'Common pattern for {topic_info['title']}',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        codeExample: `// Example code`,
        useCases: ['Use case 1']
      }}
    ],

    practiceProblems: [
      {{
        id: 1,
        difficulty: 'Easy',
        title: '{topic_info['title']} Practice Problem',
        description: 'Practice problem from textbook concepts'
      }}
    ],

    videoResources: [
      {{
        id: 1,
        title: '{topic_info['title']} Fundamentals',
        platform: 'YouTube',
        duration: '15:00',
        url: ''
      }}
    ],

    quickReference: {{
      timeComplexities: {{
        'Access': 'O(1)',
        'Search': 'O(n)',
        'Insertion': 'O(n)',
        'Deletion': 'O(n)'
      }},
      spaceComplexity: 'O(n)',
      keyPoints: [
        'Key point 1 from textbook',
        'Key point 2 from textbook',
        'Key point 3 from textbook'
      ]
    }}
  }},
"""
    return template

def main():
    print("=" * 60)
    print("DSA Learning Modules Generator")
    print("=" * 60)
    
    # Load extracted content
    content = load_extracted_content('scripts/extracted_pdf_content.json')
    print(f"✅ Loaded {len(content)} pages of content")
    
    # Identify chapters
    chapters = find_chapter_pages(content)
    print(f"✅ Identified {len(chapters)} topics")
    
    # Generate modules
    output_file = 'scripts/generated_learning_modules.ts'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated learning modules from PDF content\n")
        f.write("import type { LearningModule } from '../src/types';\n\n")
        f.write("export const pdfLearningModules: Record<string, LearningModule> = {\n")
        
        for topic_id, topic_info in chapters.items():
            print(f"Processing: {topic_info['title']}...")
            topic_content = extract_topic_content(content, topic_info)
            module_code = generate_typescript_module(topic_id, topic_info, topic_content)
            f.write(module_code)
        
        f.write("};\n")
    
    print(f"\n✅ Generated learning modules saved to: {output_file}")
    print("\nNext steps:")
    print("1. Review the generated file")
    print("2. Refine the content extraction and formatting")
    print("3. Merge with existing learningModules.ts")

if __name__ == "__main__":
    main()
