"""
Helper script to add theory content for specific topics
Usage: python scripts/add_topic_theory.py
"""

import sys
import os

# Topic information from the PDF
TOPICS = {
    'arrays': {
        'chapter': 3,
        'pages': '103-121',
        'sections': ['Using Arrays', 'Storing Game Entries', 'Sorting', 'Two-Dimensional Arrays'],
    },
    'linked-lists': {
        'chapter': 3,
        'pages': '122-145',
        'sections': ['Singly Linked Lists', 'Circularly Linked Lists', 'Doubly Linked Lists'],
    },
    'stacks': {
        'chapter': 6,
        'pages': '225-238',
        'sections': ['Stack ADT', 'Array-Based Stack', 'Linked Stack', 'Applications'],
    },
    'queues': {
        'chapter': 6,
        'pages': '238-252',
        'sections': ['Queue ADT', 'Array-Based Queue', 'Linked Queue', 'Circular Queue'],
    },
    'recursion': {
        'chapter': 5,
        'pages': '189-224',
        'sections': ['Factorial', 'Binary Search', 'File Systems', 'Analyzing Recursive Algorithms'],
    },
    'trees': {
        'chapter': 8,
        'pages': '307-358',
        'sections': ['General Trees', 'Binary Trees', 'Tree Traversal', 'Implementing Trees'],
    },
    'heaps': {
        'chapter': 9,
        'pages': '359-400',
        'sections': ['Priority Queue ADT', 'Heap Data Structure', 'Heap-Sort', 'Bottom-Up Construction'],
    },
    'hashing': {
        'chapter': 10,
        'pages': '410-445',
        'sections': ['Hash Functions', 'Collision Handling', 'Load Factors', 'Java Implementation'],
    },
    'search-trees': {
        'chapter': 11,
        'pages': '459-530',
        'sections': ['Binary Search Trees', 'AVL Trees', 'Splay Trees', 'Red-Black Trees'],
    },
    'sorting': {
        'chapter': 12,
        'pages': '531-572',
        'sections': ['Merge-Sort', 'Quick-Sort', 'Heap-Sort', 'Comparison of Algorithms'],
    },
    'graphs': {
        'chapter': 14,
        'pages': '611-686',
        'sections': ['Graph ADT', 'Data Structures', 'DFS/BFS', 'Shortest Paths', 'MST'],
    },
    'dynamic-programming': {
        'chapter': 13,
        'pages': '598-606',
        'sections': ['Matrix Chain-Product', 'DNA Sequence Alignment', 'Greedy vs DP'],
    }
}

def print_menu():
    """Print the main menu"""
    print("\n" + "=" * 70)
    print("DSA TOPIC THEORY CONTENT HELPER")
    print("Data Structures and Algorithms in Java, 6th Edition")
    print("=" * 70)
    print("\nAvailable Topics:")
    print("-" * 70)
    
    for i, (topic_id, info) in enumerate(TOPICS.items(), 1):
        print(f"{i:2}. {topic_id:20} - Chapter {info['chapter']:2}, Pages {info['pages']}")
    
    print(f"{len(TOPICS) + 1:2}. Exit")
    print("-" * 70)

def show_topic_details(topic_id):
    """Show details for a specific topic"""
    if topic_id not in TOPICS:
        print(f"❌ Topic '{topic_id}' not found!")
        return
    
    info = TOPICS[topic_id]
    print("\n" + "=" * 70)
    print(f"TOPIC: {topic_id.upper()}")
    print("=" * 70)
    print(f"📖 Chapter: {info['chapter']}")
    print(f"📄 Pages: {info['pages']}")
    print(f"\n📚 Key Sections to Extract:")
    for i, section in enumerate(info['sections'], 1):
        print(f"   {i}. {section}")
    
    print("\n" + "-" * 70)
    print("NEXT STEPS:")
    print("-" * 70)
    print(f"1. Open PDF to page {info['pages'].split('-')[0]}")
    print(f"2. Copy content from the sections listed above")
    print(f"3. Create a file: content/{topic_id}.txt")
    print(f"4. Paste the content into that file")
    print(f"5. I will help you format it for learningModules.ts")
    print("\n" + "=" * 70)

def create_content_template(topic_id):
    """Create a template file for the topic"""
    if topic_id not in TOPICS:
        print(f"❌ Topic '{topic_id}' not found!")
        return
    
    # Create content directory if it doesn't exist
    os.makedirs('scripts/content', exist_ok=True)
    
    info = TOPICS[topic_id]
    template_path = f'scripts/content/{topic_id}_template.txt'
    
    template = f"""# {topic_id.upper()} - Content Template
# Source: Data Structures and Algorithms in Java, 6th Edition
# Chapter {info['chapter']}, Pages {info['pages']}

## SECTION 1: OVERVIEW
# Copy the introductory paragraphs that define {topic_id}
# Typically the first 2-3 paragraphs of the chapter


## SECTION 2: KEY CHARACTERISTICS
# List the main properties and characteristics


## SECTION 3: OPERATIONS AND COMPLEXITY
# Document the main operations and their time/space complexity


## SECTION 4: IMPLEMENTATION DETAILS
# Include pseudocode or Java code examples from the textbook


## SECTION 5: APPLICATIONS
# Real-world applications and use cases


## SECTION 6: COMMON PATTERNS/ALGORITHMS
# Important algorithms and patterns related to this topic


## SECTION 7: PITFALLS AND TIPS
# Common mistakes and best practices


## NOTES:
# - Include page numbers for reference
# - Copy code examples exactly as they appear
# - Note any important figures or diagrams
"""
    
    with open(template_path, 'w', encoding='utf-8') as f:
        f.write(template)
    
    print(f"\n✅ Template created: {template_path}")
    print(f"📝 Fill in the template with content from the PDF")
    print(f"💡 Then run: python scripts/format_topic_content.py {topic_id}")

def main():
    """Main interactive menu"""
    while True:
        print_menu()
        
        try:
            choice = input("\nSelect a topic (number) or 'q' to quit: ").strip()
            
            if choice.lower() in ['q', 'quit', 'exit']:
                print("\n👋 Goodbye!")
                break
            
            choice_num = int(choice)
            
            if choice_num == len(TOPICS) + 1:
                print("\n👋 Goodbye!")
                break
            
            if 1 <= choice_num <= len(TOPICS):
                topic_id = list(TOPICS.keys())[choice_num - 1]
                show_topic_details(topic_id)
                
                action = input("\n(V)iew details again, (C)reate template, (B)ack to menu: ").strip().lower()
                
                if action == 'c':
                    create_content_template(topic_id)
                    input("\nPress Enter to continue...")
                elif action == 'v':
                    continue
            else:
                print(f"❌ Invalid choice. Please select 1-{len(TOPICS) + 1}")
                
        except ValueError:
            print("❌ Invalid input. Please enter a number.")
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
