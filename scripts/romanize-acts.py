import os
import re

content_dir = '/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild/content/long-form/'
roman_map = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    '7': 'VII',
    '8': 'VIII',
    '9': 'IX',
    '10': 'X'
}

def romanize_match(match):
    number = match.group(1)
    roman = roman_map.get(number, number)
    return f"## Act {roman}{match.group(2)}"

files = [f for f in os.listdir(content_dir) if f.endswith('.md')]

for filename in files:
    path = os.path.join(content_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex looks for "## Act " followed by a number, then optionally a colon/space
    # Example: "## Act 1" or "## Act 1: The Setup"
    new_content = re.sub(r'## Act (\d+)(.*)', romanize_match, content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            print(f"Updated {filename}")

