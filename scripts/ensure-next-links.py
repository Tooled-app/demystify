import os
import re

content_dir = '/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild/content/long-form/'
files = os.listdir(content_dir)

confessionals = []
for f in files:
    if f.endswith('.md'):
        match = re.search(r'(?:c3-)?day-(\d+)', f)
        if match:
            day = int(match.group(1))
            confessionals.append((day, f))

confessionals.sort()

for i in range(len(confessionals)):
    day, filename = confessionals[i]
    path = os.path.join(content_dir, filename)
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if any "Next:" link exists
    if not re.search(r'\*Next: .*?\*', content):
        if i + 1 < len(confessionals):
            next_day, next_file = confessionals[i+1]
            next_slug = next_file.replace('.md', '')
            
            # Since we don't have the specific "Next" title for every single one, 
            # we'll use a standard format "Next: Day [X]" for missing ones.
            # Better yet, we can try to extract the title from the next file.
            with open(os.path.join(content_dir, next_file), 'r', encoding='utf-8') as nf:
                next_content = nf.read()
                title_match = re.search(r'^# Day \d+: (.+)', next_content, re.MULTILINE)
                next_title = title_match.group(1).strip() if title_match else f"Day {next_day}"
            
            next_link = f"\n\n---\n\n*Next: [{next_title}]](/posts/{next_slug})*"
            content += next_link
            print(f"Added missing Next link to {filename}")
        else:
            # Last post, no next link needed
            pass

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

