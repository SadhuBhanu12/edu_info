"""
PDF Content Extractor for DSA Theory
Extracts text from "Data Structures and Algorithms in Java, 6th Edition.pdf"
"""

try:
    import PyPDF2
    import json
    import re
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call(["pip", "install", "PyPDF2"])
    import PyPDF2
    import json
    import re

def extract_chapter_content(pdf_path, output_json_path):
    """Extract content from PDF and organize by chapters/topics"""
    
    # Most important topics for DSA learning with their page ranges
    important_chapters = {
        'arrays': (103, 121),           # Chapter 3: Arrays
        'linked-lists': (122, 145),     # Chapter 3: Linked Lists  
        'recursion': (189, 224),        # Chapter 5: Recursion
        'stacks': (225, 238),           # Chapter 6: Stacks
        'queues': (238, 252),           # Chapter 6: Queues
        'trees': (307, 358),            # Chapter 8: Trees
        'heaps': (359, 400),            # Chapter 9: Heaps & Priority Queues
        'hashing': (410, 445),          # Chapter 10: Hash Tables
        'search-trees': (459, 530),     # Chapter 11: Search Trees
        'sorting': (531, 572),          # Chapter 12: Sorting
        'graphs': (611, 686),           # Chapter 14: Graphs
        'dynamic-programming': (598, 606) # Chapter 13: DP
    }
    
    extracted_content = {}
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            total_pages = len(pdf_reader.pages)
            
            print(f"Total pages: {total_pages}")
            print("Extracting content...")
            
            # Extract pages for important topics
            all_text = []
            topic_content = {}
            
            # Get all unique page numbers needed
            pages_to_extract = set()
            for start, end in important_chapters.values():
                pages_to_extract.update(range(start, end + 1))
            
            sorted_pages = sorted(pages_to_extract)
            print(f"Extracting {len(sorted_pages)} pages for core DSA topics...")
            
            for page_num in sorted_pages:
                if page_num <= total_pages:
                    page = pdf_reader.pages[page_num - 1]  # PDF pages are 0-indexed
                    text = page.extract_text()
                    all_text.append({
                        'page': page_num,
                        'content': text
                    })
                    
                    if len(all_text) % 20 == 0:
                        print(f"Processed {len(all_text)} pages...")
            
            # Organize by topic
            for topic, (start, end) in important_chapters.items():
                topic_content[topic] = {
                    'pages': f"{start}-{end}",
                    'content': [p for p in all_text if start <= p['page'] <= end]
                }
            
            # Save both formats
            with open(output_json_path, 'w', encoding='utf-8') as json_file:
                json.dump(all_text, json_file, indent=2, ensure_ascii=False)
            
            topic_output = output_json_path.replace('.json', '_by_topic.json')
            with open(topic_output, 'w', encoding='utf-8') as json_file:
                json.dump(topic_content, json_file, indent=2, ensure_ascii=False)
            
            print(f"\n✅ Content extracted to: {output_json_path}")
            print(f"✅ Topic-organized content: {topic_output}")
            print(f"📄 Extracted {len(all_text)} pages covering {len(important_chapters)} topics")
            print("\n📚 Topics extracted:")
            for topic, (start, end) in important_chapters.items():
                print(f"   • {topic:20} (pages {start}-{end})")
            print("\nReady to generate comprehensive theory content!")
            
    except FileNotFoundError:
        print(f"❌ Error: PDF file not found at {pdf_path}")
        print("Please ensure the PDF is in the correct location")
    except Exception as e:
        print(f"❌ Error extracting PDF: {str(e)}")

if __name__ == "__main__":
    pdf_path = "Data Structures and Algorithms in Java, 6th Edition.pdf"
    output_path = "scripts/extracted_pdf_content.json"
    
    print("=" * 60)
    print("DSA PDF Content Extractor")
    print("=" * 60)
    
    extract_chapter_content(pdf_path, output_path)
