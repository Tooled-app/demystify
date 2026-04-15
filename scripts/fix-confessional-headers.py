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

confessionals.sort()

for day, filename in confessionals:
    path = os.path.join(content_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    if not lines:
        continue
        
    # The goal: First line should be "# Day X: Title"
    # If the first line is already "# Day X: ...", we just ensure the number is correct
    # If it's just "# Title", we prepend "Day X: "
    
    first_line = lines[0].strip()
    
    # Case 1: It's already a "# Day X: ..." line
    if re.match(r'^# Day \d+: ', first_line):
        # Just ensure the number matches the filename
        if f"# Day {day}:" not in first_line:
            # Replace the number part
            lines[0] = re.sub(r'^# Day \d+:', f'# Day {day}:', lines[0])
            print(f"Corrected day number in {filename}")
    # Case 2: It's a "# Title" line (Missing "Day X: ")
    elif first_line.startswith('# '):
        title = first_line[2:].strip()
        lines[0] = f"# Day {day}: {title}\n"
        print(f"Added missing 'Day {day}:' to {filename}")
    # Case 3: It doesn't start with # at all - a critical failure in the file structure
    else:
        # We can't safely guess the title, so we'll just prepend a generic one
        # and flag it for manual review, but for now, let's just try to fix the others
        print(f"WARNING: {filename} does not start with a header. Skipping.")

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

