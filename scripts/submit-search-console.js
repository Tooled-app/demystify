#!/usr/bin/env node
/**
 * Search Console URL Submission Script
 * Detects new posts since last run and submits them for indexing.
 *
 * Usage:
 *   node scripts/submit-search-console.js
 *
 * Requires Google Cloud service account with Indexing API access.
 * Place credentials at: data/search-console-service-account.json
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://demystify.website";
const MANIFEST_PATH = path.join(process.cwd(), "data", "content-manifest.json");
const LAST_RUN_PATH = path.join(process.cwd(), "data", "last_search_console_submit.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "data", "search-console-service-account.json");

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("[ERROR] content-manifest.json not found.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function loadLastRun() {
  if (!fs.existsSync(LAST_RUN_PATH)) {
    return { lastSubmit: "1970-01-01T00:00:00.000Z", submitted: [] };
  }
  return JSON.parse(fs.readFileSync(LAST_RUN_PATH, "utf8"));
}

function saveLastRun(data) {
  fs.writeFileSync(LAST_RUN_PATH, JSON.stringify(data, null, 2));
}

function getNewUrls(manifest, lastRun) {
  const lastDate = new Date(lastRun.lastSubmit);
  return manifest
    .filter((entry) => {
      const entryDate = new Date(entry.date || "1970-01-01");
      return entryDate > lastDate;
    })
    .map((entry) => `${BASE_URL}/posts/${entry.slug}`);
}

function hasCredentials() {
  return fs.existsSync(CREDENTIALS_PATH);
}

async function getAccessToken() {
  const { google } = require("googleapis");
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}

async function submitUrl(url, accessToken) {
  const response = await fetch(
    "https://indexing.googleapis.com/v3/urlNotifications:publish",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED",
      }),
    }
  );

  if (response.ok) {
    return { success: true, url };
  }

  const error = await response.json();
  return { success: false, url, error: error.error?.message || response.statusText };
}

async function main() {
  console.log("[Search Console] Starting URL submission check...\n");

  const manifest = loadManifest();
  const lastRun = loadLastRun();
  const newUrls = getNewUrls(manifest, lastRun);

  if (newUrls.length === 0) {
    console.log("[Search Console] No new URLs since last run.");
    console.log(`[Search Console] Last run: ${lastRun.lastSubmit}`);
    return;
  }

  console.log(`[Search Console] Found ${newUrls.length} new URL(s):`);
  newUrls.forEach((url) => console.log(`  → ${url}`));
  console.log();

  // Always save the list for reference
  const timestamp = new Date().toISOString();
  const submissionLog = {
    timestamp,
    urls: newUrls,
    submittedViaApi: false,
  };

  // Try API submission if credentials exist
  if (hasCredentials()) {
    try {
      console.log("[Search Console] API credentials found. Submitting via Indexing API...\n");
      const accessToken = await getAccessToken();
      const results = await Promise.all(newUrls.map((url) => submitUrl(url, accessToken)));

      const succeeded = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      console.log(`[Search Console] Submitted: ${succeeded.length} succeeded, ${failed.length} failed.`);

      if (failed.length > 0) {
        console.log("\n[Search Console] Failed submissions:");
        failed.forEach((f) => console.log(`  ✗ ${f.url} — ${f.error}`));
      }

      submissionLog.submittedViaApi = true;
      submissionLog.results = results;
    } catch (err) {
      console.error(`[Search Console] API submission failed: ${err.message}`);
      console.log("[Search Console] URLs were logged but not submitted. Set up credentials to auto-submit.\n");
    }
  } else {
    console.log("[Search Console] No API credentials found.");
    console.log(`  Expected: ${CREDENTIALS_PATH}`);
    console.log("  To enable auto-submission:");
    console.log("    1. Create a Google Cloud project");
    console.log("    2. Enable the Indexing API");
    console.log("    3. Create a service account with 'Owner' role on Search Console property");
    console.log("    4. Download JSON key to the path above\n");
  }

  // Update last run
  lastRun.lastSubmit = timestamp;
  lastRun.submitted = lastRun.submitted || [];
  lastRun.submitted.push(submissionLog);
  saveLastRun(lastRun);

  console.log(`[Search Console] Last run updated: ${timestamp}`);
}

main().catch((err) => {
  console.error(`[Search Console] Fatal error: ${err.message}`);
  process.exit(1);
});
