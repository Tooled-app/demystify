#!/bin/bash
# Demystify Daily Site Audit
# Run once per day to check all content, fix issues, and report findings

set -e

SITE_DIR="/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild"
LOG_FILE="/Users/colinmaxwell/.openclaw/workspace/logs/demystify-audit-$(date +%Y-%m-%d).log"
BACKUP_SCRIPT="$SITE_DIR/scripts/backup-site.sh"

echo "=== Demystify Daily Audit: $(date) ==="

mkdir -p "$(dirname $LOG_FILE)"

# Step 1: Backup before any edits
echo "[AUDIT] Creating backup..."
"$BACKUP_SCRIPT" >> "$LOG_FILE" 2>&1

# Step 2: Check for orphaned drafts in c3-drafts
echo "[AUDIT] Checking for unpublished drafts..."
DRAFT_DIR="/Users/colinmaxwell/Library/Mobile Documents/com~apple~CloudDocs/DemystifyPosts/writing-services/c3-drafts"
PUBLISHED_DIR="/Users/colinmaxwell/Library/Mobile Documents/com~apple~CloudDocs/DemystifyPosts/published"

# List confession files in drafts that haven't been published
for draft in "$DRAFT_DIR"/confession-*.md; do
  if [ -f "$draft" ]; then
    basename=$(basename "$draft")
    # Check if corresponding published file exists
    if ! ls "$PUBLISHED_DIR"/c3-day-* 2>/dev/null | grep -q "$(echo $basename | sed 's/confession-//;s/.md//')"; then
      echo "[ALERT] Unpublished draft: $basename" >> "$LOG_FILE"
    fi
  fi
done

# Step 3: Check manifest integrity
echo "[AUDIT] Checking manifest..."
cd "$SITE_DIR"
python3 -c "
import json
import sys

with open('data/content-manifest.json', 'r') as f:
    manifest = json.load(f)

issues = []

# Check for duplicate slugs
slugs = [e['slug'] for e in manifest]
for i, slug in enumerate(slugs):
    if slugs.count(slug) > 1:
        issues.append(f'Duplicate slug: {slug}')

# Check for empty dates
for entry in manifest:
    if not entry.get('date'):
        issues.append(f'Empty date: {entry[\"slug\"]}')
    if not entry.get('title'):
        issues.append(f'Empty title: {entry[\"slug\"]}')

# Check confessionals have proper format
for entry in manifest:
    if entry['slug'].startswith('c3-day-'):
        if not entry['title'].startswith('Day '):
            issues.append(f'Wrong title format: {entry[\"slug\"]} = {entry[\"title\"]}')

if issues:
    print('MANIFEST ISSUES:')
    for issue in issues:
        print(f'  - {issue}')
    sys.exit(1)
else:
    print('Manifest OK')
" 2>&1 >> "$LOG_FILE" || echo "[ALERT] Manifest issues found!" >> "$LOG_FILE"

# Step 4: Check content files exist for manifest entries
echo "[AUDIT] Checking content files..."
python3 -c "
import json
import os

content_dir = 'content/long-form'
quick_dir = 'content/quick-takes'

with open('data/content-manifest.json', 'r') as f:
    manifest = json.load(f)

missing = []
for entry in manifest:
    slug = entry['slug']
    long_path = os.path.join(content_dir, f'{slug}.md')
    quick_path = os.path.join(quick_dir, f'{slug}.md')
    
    if not os.path.exists(long_path) and not os.path.exists(quick_path):
        missing.append(slug)

if missing:
    print('MISSING CONTENT FILES:')
    for slug in missing:
        print(f'  - {slug}')
else:
    print('All content files present')
" 2>&1 >> "$LOG_FILE" || echo "[ALERT] Missing content files!" >> "$LOG_FILE"

# Step 5: Check for stale drafts in c3-drafts
echo "[AUDIT] Checking for stale drafts..."
DRAFT_COUNT=$(ls "$DRAFT_DIR"/confession-*.md 2>/dev/null | wc -l | tr -d ' ')
echo "Drafts remaining: $DRAFT_COUNT" >> "$LOG_FILE"

echo "[AUDIT] Complete. Log: $LOG_FILE"
