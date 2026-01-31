#!/usr/bin/env python3
"""
Excel to DSA Tracker Converter
Convert Excel/CSV data to TypeScript format for DSA Tracker

Usage:
    python excel_converter.py input.csv output.ts

CSV Format:
    Title,Topic,Difficulty,LeetCode Link,GFG Link,Companies,Patterns
"""

import csv
import sys
from typing import List, Dict, Optional

# Topic ID mapping
TOPIC_MAPPING = {
    'arrays': 'arrays',
    'array': 'arrays',
    'strings': 'strings',
    'string': 'strings',
    'linked-lists': 'linked-lists',
    'linkedlists': 'linked-lists',
    'linked list': 'linked-lists',
    'stacks': 'stacks-queues',
    'queues': 'stacks-queues',
    'stack': 'stacks-queues',
    'queue': 'stacks-queues',
    'trees': 'trees',
    'tree': 'trees',
    'bst': 'trees',
    'binary tree': 'trees',
    'graphs': 'graphs',
    'graph': 'graphs',
    'dp': 'dynamic-programming',
    'dynamic programming': 'dynamic-programming',
    'sorting': 'sorting-searching',
    'searching': 'sorting-searching',
    'binary search': 'sorting-searching'
}

def get_topic_prefix(topic: str) -> str:
    """Get 3-letter prefix for topic ID"""
    prefixes = {
        'arrays': 'arr',
        'strings': 'str',
        'linked-lists': 'll',
        'stacks-queues': 'sq',
        'trees': 'tre',
        'graphs': 'gra',
        'dynamic-programming': 'dp',
        'sorting-searching': 'ss'
    }
    return prefixes.get(topic, topic[:3])

def normalize_topic(topic: str) -> str:
    """Normalize topic name to standard ID"""
    topic_lower = topic.lower().strip()
    return TOPIC_MAPPING.get(topic_lower, topic_lower)

def parse_list_field(field: str) -> List[str]:
    """Parse comma/semicolon separated field into list"""
    if not field or field.strip() == '':
        return []
    separators = [',', ';', '|']
    for sep in separators:
        if sep in field:
            return [item.strip() for item in field.split(sep) if item.strip()]
    return [field.strip()]

def determine_platform(leetcode_url: str, gfg_url: str) -> tuple:
    """Determine platform and URL to use"""
    if leetcode_url and leetcode_url.strip():
        return 'LeetCode', leetcode_url.strip()
    elif gfg_url and gfg_url.strip():
        return 'GeeksForGeeks', gfg_url.strip()
    return 'LeetCode', ''

def generate_problem_object(problem: Dict, problem_id: str) -> str:
    """Generate TypeScript object string for a problem"""
    patterns_str = ', '.join([f"'{p}'" for p in problem['patterns']])
    parts = [
        f"id: '{problem_id}'",
        f"title: '{problem['title']}'",
        f"difficulty: '{problem['difficulty']}'",
        f"platform: '{problem['platform']}'",
        f"url: '{problem['url']}'",
        f"topicId: '{problem['topicId']}'",
        f"patterns: [{patterns_str}]"
    ]
    
    if problem.get('companies'):
        companies_str = ', '.join([f"'{c}'" for c in problem['companies']])
        parts.append(f"companies: [{companies_str}]")
    
    return '  { ' + ', '.join(parts) + ' },'

def convert_excel_to_ts(input_file: str, output_file: str, start_id: int = 1):
    """Convert CSV/Excel file to TypeScript format"""
    problems = []
    current_id = start_id
    
    # Read CSV file
    try:
        with open(input_file, 'r', encoding='utf-8') as csvfile:
            # Try different delimiters
            sample = csvfile.read(1024)
            csvfile.seek(0)
            
            delimiter = ','
            if '\t' in sample:
                delimiter = '\t'
            
            reader = csv.DictReader(csvfile, delimiter=delimiter)
            
            for row in reader:
                # Get fields with flexible header names
                title = (row.get('Title') or row.get('title') or 
                        row.get('Problem') or row.get('problem') or '').strip()
                
                if not title:
                    continue
                
                topic_raw = (row.get('Topic') or row.get('topic') or 
                            row.get('Category') or 'arrays').strip()
                topic = normalize_topic(topic_raw)
                
                difficulty = (row.get('Difficulty') or row.get('difficulty') or 
                             row.get('Level') or 'Medium').strip()
                
                leetcode_url = (row.get('LeetCode Link') or row.get('LeetCode') or 
                               row.get('leetcode') or '').strip()
                
                gfg_url = (row.get('GFG Link') or row.get('GFG') or 
                          row.get('GeeksForGeeks') or '').strip()
                
                companies_str = (row.get('Companies') or row.get('companies') or '').strip()
                companies = parse_list_field(companies_str)
                
                patterns_str = (row.get('Patterns') or row.get('patterns') or 
                               row.get('Tags') or '').strip()
                patterns = parse_list_field(patterns_str)
                if not patterns:
                    patterns = ['Array']  # Default pattern
                
                platform, url = determine_platform(leetcode_url, gfg_url)
                
                topic_prefix = get_topic_prefix(topic)
                problem_id = f"{topic_prefix}-{current_id}"
                
                problem = {
                    'id': problem_id,
                    'title': title,
                    'difficulty': difficulty,
                    'platform': platform,
                    'url': url,
                    'topicId': topic,
                    'patterns': patterns,
                    'companies': companies if companies else None
                }
                
                problems.append(problem)
                current_id += 1
    
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return False
    
    # Generate TypeScript code
    try:
        with open(output_file, 'w', encoding='utf-8') as outfile:
            outfile.write('// Generated by excel_converter.py\n')
            outfile.write('// Add these problems to the problems array in src/data/topics.ts\n\n')
            
            for problem in problems:
                ts_code = generate_problem_object(problem, problem['id'])
                outfile.write(ts_code + '\n')
            
            # Generate statistics
            topics = set(p['topicId'] for p in problems)
            outfile.write(f'\n// Statistics:\n')
            outfile.write(f'// Total Problems: {len(problems)}\n')
            outfile.write(f'// Topics: {", ".join(sorted(topics))}\n')
            
            # Topic breakdown
            outfile.write(f'\n// Problems per topic:\n')
            topic_counts = {}
            for p in problems:
                topic_counts[p['topicId']] = topic_counts.get(p['topicId'], 0) + 1
            
            for topic, count in sorted(topic_counts.items()):
                outfile.write(f'// {topic}: {count} problems\n')
        
        print(f'\n✅ Successfully converted {len(problems)} problems!')
        print(f'📊 Topics covered: {len(topics)}')
        print(f'📁 Output saved to: {output_file}')
        print(f'\n📋 Next steps:')
        print(f'   1. Open src/data/topics.ts')
        print(f'   2. Copy content from {output_file}')
        print(f'   3. Paste into problems array')
        print(f'   4. Update problemIds for each topic')
        
        return True
        
    except Exception as e:
        print(f"❌ Error writing file: {e}")
        return False

def main():
    """Main function"""
    print('🚀 Excel to DSA Tracker Converter')
    print('=' * 50)
    
    if len(sys.argv) < 2:
        print('\n📋 Usage:')
        print('   python excel_converter.py input.csv [output.ts] [start_id]')
        print('\n📝 Example:')
        print('   python excel_converter.py striver_sheet.csv problems.ts 1')
        print('\n💡 CSV Format:')
        print('   Title,Topic,Difficulty,LeetCode Link,GFG Link,Companies,Patterns')
        return
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'output.ts'
    start_id = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    
    print(f'\n📥 Input:  {input_file}')
    print(f'📤 Output: {output_file}')
    print(f'🔢 Start ID: {start_id}')
    print()
    
    success = convert_excel_to_ts(input_file, output_file, start_id)
    
    if not success:
        sys.exit(1)

if __name__ == '__main__':
    main()
