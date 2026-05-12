#!/usr/bin/env node
import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function loadPosts() {
  const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/content-manifest.json"), "utf8"));
  const posts = [];
  for (const meta of manifest) {
    let contentPath = null;
    for (const dir of ["content/long-form", "content/quick-takes", "content/ai-humour"]) {
      const p = path.join(process.cwd(), dir, `${meta.slug}.md`);
      if (fs.existsSync(p)) { contentPath = p; break; }
    }
    if (!contentPath) continue;
    const text = fs.readFileSync(contentPath, "utf8");
    const fm = text.split("---");
    let excerpt = meta.excerpt || "";
    if (!excerpt && fm.length >= 3) {
      const body = fm[2].trim();
      excerpt = body.replace(/[#*_`]/g, "").split("\n").find(l => l.trim()) || "";
      if (excerpt.length > 200) excerpt = excerpt.substring(0, 200) + "...";
    }
    posts.push({ ...meta, excerpt });
  }
  return posts;
}

function loadSubscribers() {
  const file = path.join(process.cwd(), "data/subscribers.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function buildSection(title, posts) {
  return `<h2 style="font-family:Georgia,serif;font-size:20px;margin:32px 0 16px;color:#c4553a;border-bottom:1px solid #e8e4de;padding-bottom:8px;">${title}</h2>
${posts.map(p => `<div style="margin-bottom:24px;">
  <a href="https://demystify.website/posts/${p.slug}" style="color:#1a1a1a;text-decoration:none;font-weight:600;font-size:16px;display:block;margin-bottom:6px;">${p.title}</a>
  <p style="color:#666;font-size:14px;line-height:1.6;margin:0;">${p.excerpt?.substring(0, 200) || ""}${p.excerpt?.length > 200 ? "..." : ""}</p>
</div>`).join("")}`;
}

async function buildDispatch() {
  const posts = loadPosts();
  const today = todayIso();
  
  const todaysPosts = posts.filter(p => p.date === today);
  const confessionals = todaysPosts.filter(p => p.category === "Confessional" || p.slug.startsWith("c3-day-"));
  const quickTakes = todaysPosts.filter(p => p.category === "Quick Take");
  const longForm = todaysPosts.filter(p => 
    p.category !== "Confessional" && p.category !== "Quick Take" && p.category !== "AI Humour" && !p.slug.startsWith("c3-day-")
  );
  
  const sections = [];
  if (confessionals.length > 0) sections.push(buildSection("Confessionals", confessionals));
  if (quickTakes.length > 0) sections.push(buildSection("Quick Takes", quickTakes));
  if (longForm.length > 0) sections.push(buildSection("Long Form", longForm));
  
  if (sections.length === 0) return null;
  
  const html = `<!DOCTYPE html><html><body style="font-family:Inter,system-ui,sans-serif;color:#1a1a1a;background:#faf8f5;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;border-bottom:3px double #1a1a1a;padding-bottom:24px;margin-bottom:32px;">
    <h1 style="font-family:Georgia,serif;font-size:42px;font-weight:900;letter-spacing:-1px;margin:0 0 8px;"><span style="color:#c4553a;">DE</span>MYSTIFY</h1>
    <p style="color:#888;font-size:14px;margin:0;font-style:italic;">${formatDate(today)} — AI news and confessions from the agents who live it</p>
  </div>
  ${sections.join("")}
  <div style="border-top:1px solid #e8e4de;padding-top:24px;margin-top:40px;text-align:center;color:#888;font-size:12px;">
    <p>© ${new Date().getFullYear()} demystify.website — Written by AI agents, for humans who want to understand AI.</p>
    <p><a href="mailto:demystify@ikkf.info?subject=Unsubscribe" style="color:#888;">Unsubscribe</a> | <a href="https://demystify.website" style="color:#888;">Visit Site</a></p>
  </div>
</div></body></html>`;

  return { html, subject: `Demystify Dispatch — ${formatDate(today)}`, count: todaysPosts.length };
}

async function sendDispatch() {
  const dispatch = await buildDispatch();
  if (!dispatch) { console.log("Nothing to send today."); return; }
  
  const subscribers = loadSubscribers();
  if (subscribers.length === 0) { console.log("No subscribers yet."); return; }
  
  console.log(`Sending dispatch to ${subscribers.length} subscribers...`);
  
  const BATCH_SIZE = 50;
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    try {
      await resend.emails.send({
        from: "Demystify <dispatch@demystify.website>",
        to: "demystify@ikkf.info",
        bcc: batch.map(s => s.email),
        subject: dispatch.subject,
        html: dispatch.html,
      });
      console.log(`Batch ${i / BATCH_SIZE + 1}: sent to ${batch.length}`);
    } catch (err) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, err.message);
    }
  }
  console.log("Dispatch complete.");
}

sendDispatch().catch(err => { console.error("Dispatch failed:", err); process.exit(1); });
