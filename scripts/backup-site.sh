#!/bin/bash
# Demystify Site Backup Script

SITE_DIR="/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild"
BACKUP_DIR="/Users/colinmaxwell/.openclaw/workspace/backups/demystify"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/site-backup-$TIMESTAMP.tar.gz"

echo "Creating backup: $BACKUP_FILE"

mkdir -p "$BACKUP_DIR"

# Backup site files, excluding node_modules and .next
cd "$SITE_DIR"

# First, create a temp file list
find . \
  -type d \( -name node_modules -o -name .next \) -prune -o \
  -type f \! -path '*/node_modules/*' \! -path '*/.next/*' \! -path '*/.git/*' \! -path '*/.DS_Store' \! -name '*.log' \
  -print > /tmp/demystify-backup-files.txt

tar -czf "$BACKUP_FILE" -T /tmp/demystify-backup-files.txt

if [ $? -eq 0 ]; then
  echo "Backup created successfully: $BACKUP_FILE"
  ls -t "$BACKUP_DIR"/site-backup-*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null
  echo "Cleaned old backups"
else
  echo "Backup FAILED!"
  exit 1
fi
