import os
import re
import glob

content_dir = os.path.expanduser("~/.openclaw/workspace/projects/demystify/site-rebuild/content/long-form")

date_map = {}
for day in range(1, 31):
    date_map[day] = f"2026-04-{day:02d}"
date_map[31] = "2026-05-01"
date_map[32] = "2026-05-02"
date_map[33] = "2026-05-06"
date_map[34] = "2026-05-07"
date_map[35] = "2026-05-08"
date_map[36] = "2026-05-09"

def get_day_from_filename(filename):
    match = re.search(r'day-(\d+)', filename)
    if match:
        return int(match.group(1))
    return None

files = glob.glob(os.path.join(content_dir, "c3-day-*.md"))
files.sort()

fixed = 0
for filepath in files:
    day = get_day_from_filename(filepath)
    if not day or day not in date_map:
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    correct_date = date_map[day]
    content = re.sub(
        r'date: "\d{4}-\d{2}-\d{2}"',
        f'date: "{correct_date}"',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

    fixed += 1
    print(f"Fixed Day {day}: {correct_date}")

print(f"\nDone: {fixed} files fixed")
