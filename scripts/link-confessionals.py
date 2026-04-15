import os
import re

content_dir = '/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild/content/long-form/'
files = os.listdir(content_dir)

# Extract day number and filename for confessionals
confessionals = []
for f in files:
    if f.endswith('.md'):
        match = re.search(r'(?:c3-)?day-(\d+)', f)
        if match:
            day = int(match.group(1))
            confessionals.append((day, f))

# Sort by day
confessionals.sort()

for i in range(len(confessionals)):
    day, filename = confessionals[i]
    path = os.path.join(content_dir, filename)
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the "Next: ..." line at the end
    next_match = re.search(r'\*Next: (.+)\*', content)
    if next_match:
        current_next_text = next_match.group(1)
        
        if i + 1 < len(confessionals):
            # There is a next day
            next_day, next_file = confessionals[i+1]
            next_slug = next_file.replace('.md', '')
            
            # We want to keep the descriptive text if it exists, but wrap it in a link
            # Pattern: *Next: [Description]* -> *Next: [Description](/posts/slug)*
            new_line = f"*Next: [{current_next_text}]](/posts/{next_slug})*"
            content = content.replace(f"*Next: {current_next_text}*", new_line)
        else:
            # Last post: remove the "Next" line or change it
            content = re.sub(r'\*Next: .+\*', '', content).strip()
            if not content.endswith('---'): # add trailing rule if needed
                pass

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Successfully linked confessionals.")
