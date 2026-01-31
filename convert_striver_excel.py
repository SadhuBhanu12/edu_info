#!/usr/bin/env python3
"""
Convert Striver DSA Excel Sheet to TypeScript
Handles 1680 questions from DSA_1680_Questions1.xlsx
"""

import pandas as pd
import re
from collections import defaultdict

def extract_problem_slug(leetcode_url):
    """Extract problem slug from LeetCode URL"""
    if not leetcode_url or pd.isna(leetcode_url):
        return None
    match = re.search(r'problems/([^/]+)', str(leetcode_url))
    return match.group(1) if match else None

def categorize_by_topic(question_name):
    """Categorize question into topics based on name"""
    name_lower = question_name.lower()
    
    # Array patterns
    if any(kw in name_lower for kw in ['array', 'subarray', 'sum', 'product', 'rotate', 'maximum', 'minimum', 'median']):
        return 'arrays-strings'
    
    # String patterns
    if any(kw in name_lower for kw in ['string', 'substring', 'palindrome', 'anagram', 'character', 'word']):
        return 'arrays-strings'
    
    # Linked List patterns
    if any(kw in name_lower for kw in ['linked', 'list', 'node', 'cycle']):
        return 'linked-lists'
    
    # Tree patterns
    if any(kw in name_lower for kw in ['tree', 'binary', 'bst', 'traversal', 'ancestor', 'path']):
        return 'trees-graphs'
    
    # Graph patterns
    if any(kw in name_lower for kw in ['graph', 'island', 'connected', 'course', 'clone', 'topological']):
        return 'trees-graphs'
    
    # Stack/Queue patterns
    if any(kw in name_lower for kw in ['stack', 'queue', 'parentheses', 'valid']):
        return 'stacks-queues'
    
    # DP patterns
    if any(kw in name_lower for kw in ['dp', 'dynamic', 'fibonacci', 'climb', 'coin', 'partition', 'knapsack']):
        return 'dynamic-programming'
    
    # Sorting/Searching patterns
    if any(kw in name_lower for kw in ['sort', 'search', 'binary', 'merge', 'quick', 'heap']):
        return 'sorting-searching'
    
    return 'arrays-strings'  # Default

def extract_patterns(question_name):
    """Extract common patterns from question name"""
    patterns = []
    name_lower = question_name.lower()
    
    pattern_keywords = {
        'Two Pointers': ['two pointer', 'left', 'right'],
        'Sliding Window': ['window', 'subarray', 'substring'],
        'Binary Search': ['binary search', 'search'],
        'Dynamic Programming': ['dp', 'dynamic', 'fibonacci'],
        'Backtracking': ['backtrack', 'permutation', 'combination'],
        'DFS': ['dfs', 'depth'],
        'BFS': ['bfs', 'breadth', 'level'],
        'Hash Map': ['hash', 'map', 'frequency'],
        'Greedy': ['maximum', 'minimum', 'optimal'],
        'Sorting': ['sort', 'merge', 'quick'],
        'Stack': ['stack', 'parentheses'],
        'Queue': ['queue'],
        'Tree': ['tree', 'binary'],
        'Graph': ['graph', 'island', 'connected']
    }
    
    for pattern, keywords in pattern_keywords.items():
        if any(kw in name_lower for kw in keywords):
            patterns.append(pattern)
    
    return patterns if patterns else ['Array']

def generate_typescript_file(df, output_file='src/data/striverSheetComplete.ts'):
    """Generate complete TypeScript file with all problems"""
    
    problems_by_topic = defaultdict(list)
    
    print(f'\n🔄 Processing {len(df)} questions...')
    
    for idx, row in df.iterrows():
        if pd.isna(row['Question Name']):
            continue
            
        question_name = str(row['Question Name']).strip()
        difficulty = str(row['Difficulty']).strip() if not pd.isna(row['Difficulty']) else 'Medium'
        leetcode_url = str(row['LeetCode Link']).strip() if not pd.isna(row['LeetCode Link']) else ''
        
        # Categorize
        topic = categorize_by_topic(question_name)
        patterns = extract_patterns(question_name)
        
        # Create problem object
        problem = {
            'title': question_name,
            'difficulty': difficulty,
            'url': leetcode_url,
            'topic': topic,
            'patterns': patterns,
            'index': idx + 1
        }
        
        problems_by_topic[topic].append(problem)
    
    # Generate TypeScript content
    ts_content = """import type { Problem } from '../types';

/**
 * Complete Striver DSA Sheet - 1680 Questions
 * Auto-generated from DSA_1680_Questions1.xlsx
 * Last updated: January 11, 2026
 */

export const striverSheetComplete: Problem[] = [
"""
    
    # Topic prefixes
    topic_prefixes = {
        'arrays-strings': 'arr',
        'linked-lists': 'll',
        'stacks-queues': 'sq',
        'trees-graphs': 'tg',
        'dynamic-programming': 'dp',
        'sorting-searching': 'ss',
        'recursion-backtracking': 'rb'
    }
    
    problem_count = 0
    for topic, problems in sorted(problems_by_topic.items()):
        ts_content += f"\n  // {topic.replace('-', ' ').title()} ({len(problems)} problems)\n"
        
        prefix = topic_prefixes.get(topic, 'prb')
        
        for i, prob in enumerate(problems, 1):
            problem_count += 1
            problem_id = f"{prefix}-{i}"
            
            patterns_str = "', '".join(prob['patterns'])
            
            ts_content += f"""  {{
    id: '{problem_id}',
    title: '{prob['title'].replace("'", "\\'")}',
    difficulty: '{prob['difficulty']}',
    platform: 'LeetCode',
    url: '{prob['url']}',
    topicId: '{prob['topic']}',
    patterns: ['{patterns_str}']
  }},
"""
    
    ts_content += """];

// Statistics
export const striverSheetStats = {
  totalProblems: """ + str(problem_count) + """,
  topics: {
"""
    
    for topic, problems in sorted(problems_by_topic.items()):
        ts_content += f"    '{topic}': {len(problems)},\n"
    
    ts_content += """  },
  difficulties: {
    Easy: """ + str(len([p for probs in problems_by_topic.values() for p in probs if p['difficulty'] == 'Easy'])) + """,
    Medium: """ + str(len([p for probs in problems_by_topic.values() for p in probs if p['difficulty'] == 'Medium'])) + """,
    Hard: """ + str(len([p for probs in problems_by_topic.values() for p in probs if p['difficulty'] == 'Hard'])) + """
  }
};

console.log('📚 Striver Sheet Loaded:', striverSheetStats.totalProblems, 'problems');
"""
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f'\n✅ Successfully generated {output_file}')
    print(f'📊 Total Problems: {problem_count}')
    print(f'\n📋 Problems per topic:')
    for topic, problems in sorted(problems_by_topic.items()):
        print(f'   • {topic}: {len(problems)}')

def main():
    print('🚀 Striver DSA Sheet Converter')
    print('=' * 60)
    
    # Read Excel file
    excel_file = 'DSA_1680_Questions1.xlsx'
    print(f'\n📥 Reading: {excel_file}')
    
    try:
        df = pd.read_excel(excel_file)
        print(f'✅ Loaded {len(df)} questions')
        print(f'📋 Columns: {list(df.columns)}')
        
        # Generate TypeScript file
        generate_typescript_file(df)
        
        print('\n🎉 Conversion complete!')
        print('\n📝 Next steps:')
        print('   1. Import in your components:')
        print('      import { striverSheetComplete } from "@/data/striverSheetComplete"')
        print('   2. Update Problems page to display all questions')
        print('   3. All questions have direct LeetCode links!')
        
    except Exception as e:
        print(f'\n❌ Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
