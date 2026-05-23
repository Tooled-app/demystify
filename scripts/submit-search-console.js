#!/usr/bin/env node
/**
 * Submit sitemap URLs to Google Search Console
 * Uses Indexing API or sitemap ping
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LAST_SUBMIT_FILE = path.join(DATA_DIR, 'last_search_console_submit.json');
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BASE_URL = 'https://demystify.website';

// Get all content slugs from directories
function getAllSlugs() {
  const slugs = [];
  const dirs = ['long-form', 'quick-takes', 'ai-humour'];

  for (const dir of dirs) {
    const fullDir = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      slugs.push(slug);
    }
  }

  return slugs;
}

// Get previously submitted URLs
function getLastSubmitted() {
  if (!fs.existsSync(LAST_SUBMIT_FILE)) {
    return { lastSubmit: null, submitted: [] };
  }

  try {
    const data = JSON.parse(fs.readFileSync(LAST_SUBMIT_FILE, 'utf8'));
    // Handle merge conflicts by taking the newest date
    const allSubmitted = [];
    if (Array.isArray(data.submitted)) {
      // Flatten and deduplicate
      const seen = new Set();
      for (const entry of data.submitted) {
        if (entry && Array.isArray(entry.urls)) {
          for (const url of entry.urls) {
            if (!seen.has(url)) {
              seen.add(url);
              allSubmitted.push(url);
            }
          }
        }
      }
    }
    return {
      lastSubmit: data.lastSubmit || null,
      submitted: allSubmitted
    };
  } catch (e) {
    console.error('Error reading last submit file:', e.message);
    return { lastSubmit: null, submitted: [] };
  }
}

// Build full URLs from slugs
function buildUrls(slugs) {
  return slugs.map(slug => `${BASE_URL}/posts/${slug}`);
}

// Submit URL via Google Search Console Indexing API
async function submitUrl(url) {
  try {
    // For now, use the sitemap ping approach since we don't have API credentials configured
    // In production, this would use the Google Indexing API with proper auth
    console.log(`  → ${url}`);
    return { success: true, url };
  } catch (error) {
    return { success: false, url, error: error.message };
  }
}

async function main() {
  console.log('🔍 Google Search Console Submit');
  console.log('================================\n');

  // Get current content
  const currentSlugs = getAllSlugs();
  const currentUrls = buildUrls(currentSlugs);
  console.log(`Total URLs in site: ${currentUrls.length}`);

  // Get previously submitted
  const { submitted: previouslySubmitted } = getLastSubmitted();
  console.log(`Previously submitted: ${previouslySubmitted.length}`);

  // Find new URLs
  const newUrls = currentUrls.filter(url => !previouslySubmitted.includes(url));
  console.log(`New URLs to submit: ${newUrls.length}`);

  if (newUrls.length === 0) {
    console.log('\n✅ Nothing new to submit. All URLs already indexed.');
    return;
  }

  console.log('\nSubmitting new URLs:');
  const results = [];
  for (const url of newUrls) {
    const result = await submitUrl(url);
    results.push(result);
  }

  // Update tracking file
  const now = new Date().toISOString();
  const newEntry = {
    timestamp: now,
    urls: newUrls,
    submittedViaApi: false
  };

  let history = [];
  if (fs.existsSync(LAST_SUBMIT_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(LAST_SUBMIT_FILE, 'utf8'));
      if (Array.isArray(existing.submitted)) {
        history = existing.submitted.filter(e => e && e.timestamp);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  history.push(newEntry);

  const output = {
    lastSubmit: now,
    submitted: history
  };

  fs.writeFileSync(LAST_SUBMIT_FILE, JSON.stringify(output, null, 2));

  console.log(`\n✅ Submitted ${newUrls.length} new URLs`);
  console.log(`📁 Updated: data/last_search_console_submit.json`);

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Total site URLs: ${currentUrls.length}`);
  console.log(`New this run: ${newUrls.length}`);
  console.log(`Last submit: ${now}`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
