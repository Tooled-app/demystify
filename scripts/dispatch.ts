import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const baseDir = '/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild';
const manifestPath = path.join(baseDir, 'data/content-manifest.json');
const subscribersPath = path.join(baseDir, 'data/subscribers.json');
const lastPublishedPath = path.join(baseDir, 'data/last_published.json');

function loadManifest() {
  if (!fs.existsSync(manifestPath)) return [];
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function loadSubscribers() {
  if (!fs.existsSync(subscribersPath)) return [];
  return JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
}

function loadLastPublished() {
  if (!fs.existsSync(lastPublishedPath)) {
    return { last_dispatch_date: null, last_published_posts: [] };
  }
  return JSON.parse(fs.readFileSync(lastPublishedPath, 'utf8'));
}

function saveLastPublished(data) {
  fs.writeFileSync(lastPublishedPath, JSON.stringify(data, null, 2));
}

function getNewPosts(manifest, sinceDate) {
  if (!sinceDate) return manifest.filter(p => p.date);
  const since = new Date(sinceDate);
  return manifest.filter(p => {
    if (!p.date) return false;
    const postDate = new Date(p.date);
    return postDate > since;
  });
}

function synthesizeDispatch(newPosts) {
  if (newPosts.length === 0) return null;

  const sorted = [...newPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sorted[0];
  const dateStr = latest.date;

  const longForm = sorted.filter(p => p.category === 'Long Form' || p.category === 'Model Analysis' || p.category === 'Surgical Analysis');
  const quickTakes = sorted.filter(p => p.category === 'Quick Take' || p.category === 'quick-takes');

  let body = `## This Week's Signal\n\n`;

  if (longForm.length > 0) {
    longForm.forEach(post => {
      body += `**${post.title}**\n\n`;
      if (post.excerpt) body += `${post.excerpt}\n\n`;
      body += `[Read the full analysis](https://demystify.co/posts/${post.slug})\n\n---\n\n`;
    });
  }

  if (quickTakes.length > 0) {
    body += `### Quick Takes\n\n`;
    quickTakes.forEach(post => {
      body += `• **${post.title}** — [Read](https://demystify.co/posts/${post.slug})\n`;
    });
    body += `\n`;
  }

  const dispatch = {
    subject: `Sovereign Dispatch — ${dateStr} | ${latest.title}`,
    preview: latest.excerpt || `${newPosts.length} new post${newPosts.length > 1 ? 's' : ''} from Demystify`,
    body,
    post_count: newPosts.length,
    posts: sorted.map(p => ({ slug: p.slug, title: p.title, date: p.date }))
  };

  return dispatch;
}

function generateEmailHtml(dispatch) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dispatch.subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .masthead { border-bottom: 1px solid #333; padding-bottom: 24px; margin-bottom: 32px; }
    .masthead h1 { font-family: 'Times New Roman', serif; font-size: 28px; margin: 0 0 8px 0; color: #faf8f5; letter-spacing: -0.02em; }
    .masthead p { margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; }
    .dispatch-body { font-size: 15px; line-height: 1.7; color: #ccc; }
    .dispatch-body h2 { font-family: 'Times New Roman', serif; font-size: 20px; color: #faf8f5; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #222; padding-bottom: 8px; }
    .dispatch-body h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-top: 24px; }
    .dispatch-body strong { color: #faf8f5; font-weight: 600; }
    .dispatch-body a { color: #d4a574; text-decoration: none; }
    .dispatch-body a:hover { text-decoration: underline; }
    .dispatch-body p { margin-bottom: 16px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #222; font-size: 11px; color: #666; }
    .footer a { color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="masthead">
      <h1>The Sovereign Dispatch</h1>
      <p>Demystify AI • Surgical intelligence, no noise</p>
    </div>
    <div class="dispatch-body">
      ${dispatch.body.replace(/\n/g, '<br>').replace(/## /g, '<h2>').replace(/### /g, '<h3>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')}
    </div>
    <div class="footer">
      <p><em>The Sovereign Dispatch is sent when there is signal worth sending.</em></p>
      <p><a href="https://demystify.co/unsubscribe">Unsubscribe</a> • <a href="https://demystify.co">demystify.co</a></p>
    </div>
  </div>
</body>
</html>`;
}

async function sendDispatch() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not set. Export it and try again.');
    process.exit(1);
  }

  const subscribers = loadSubscribers();
  if (subscribers.length === 0) {
    console.error('No subscribers in data/subscribers.json');
    process.exit(1);
  }

  const lastPublished = loadLastPublished();
  const manifest = loadManifest();
  const newPosts = getNewPosts(manifest, lastPublished.last_dispatch_date);

  if (newPosts.length === 0) {
    console.log('No new posts since last dispatch. Nothing to send.');
    return;
  }

  const dispatch = synthesizeDispatch(newPosts);
  const html = generateEmailHtml(dispatch);

  const resend = new Resend(apiKey);

  const toEmails = subscribers.map(s => s.email).filter(Boolean);

  try {
    const result = await resend.emails.send({
      from: 'Demystify <dispatch@demystify.co>',
      to: toEmails,
      subject: dispatch.subject,
      html: html,
      text: dispatch.body,
    });

    console.log('Dispatch sent successfully:', result);

    // Update manifest
    const updated = {
      ...lastPublished,
      last_dispatch_date: new Date().toISOString(),
      last_published_posts: [
        ...newPosts.map(p => `projects/demystify/site-rebuild/content/${p.category === 'Long Form' || p.category === 'Model Analysis' || p.category === 'Surgical Analysis' ? 'long-form' : 'quick-takes'}/${p.slug}.md`),
        ...(lastPublished.last_published_posts || [])
      ].slice(0, 50),
      pending_posts: [],
      dispatch_status: 'SENT'
    };
    saveLastPublished(updated);

    // Save dispatch draft for reference
    const draftPath = path.join(baseDir, `data/dispatch-sent-${new Date().toISOString().split('T')[0]}.md`);
    fs.writeFileSync(draftPath, `---\ndispatch_id: sovereign-pulse-${new Date().toISOString().split('T')[0]}\nstatus: SENT\nsent_at: "${new Date().toISOString()}"\nrecipients: ${toEmails.length}\nposts: ${newPosts.length}\n---\n\n**Subject:** ${dispatch.subject}\n\n**Preview:** ${dispatch.preview}\n\n${dispatch.body}`);

    console.log(`Dispatch saved to ${draftPath}`);

  } catch (err) {
    console.error('Failed to send dispatch:', err.message);
    process.exit(1);
  }
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  sendDispatch();
}

export { synthesizeDispatch, generateEmailHtml, getNewPosts, loadManifest, loadSubscribers, loadLastPublished };
