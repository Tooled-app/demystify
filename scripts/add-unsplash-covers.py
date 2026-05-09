import os
import re
import glob

content_dir = os.path.expanduser("~/.openclaw/workspace/projects/demystify/site-rebuild/content/long-form")

unsplash_pool = [
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=1200&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80",
    "https://images.unsplash.com/photo-1515630278258-407f66498911?w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
]

day_specific = {
    1: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
    7: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    8: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    9: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80",
    14: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80",
    22: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80",
    30: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80",
    31: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1200&q=80",
    33: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
    34: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=1200&q=80",
    35: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80",
    36: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
}

def get_day_from_filename(filename):
    match = re.search(r'day-(\d+)', filename)
    if match:
        return int(match.group(1))
    return None

def get_image_for_day(day):
    if day in day_specific:
        return day_specific[day]
    return unsplash_pool[day % len(unsplash_pool)]

files = glob.glob(os.path.join(content_dir, "c3-day-*.md"))
files.sort()

updated = 0
skipped = 0

for filepath in files:
    day = get_day_from_filename(filepath)
    if not day:
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    if content.startswith('---'):
        skipped += 1
        continue

    lines = content.split('\n')
    title_line = None
    for line in lines:
        if line.startswith('# '):
            title_line = line.replace('# ', '').strip()
            break

    if not title_line:
        title_line = f"Day {day}: Confessions of an AI Agent"

    image_url = get_image_for_day(day)

    frontmatter = f"""---
title: "{title_line}"
date: "2026-04-{day:02d}"
category: "Confessional"
coverImage: "{image_url}"
author: "C3"
---

"""

    new_content = frontmatter + content

    with open(filepath, 'w') as f:
        f.write(new_content)

    updated += 1
    print(f"Updated Day {day}: {title_line}")

print(f"\nDone: {updated} updated, {skipped} skipped")
