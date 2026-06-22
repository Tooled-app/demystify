---
title: "Claude Goes Down: What a 90-Minute Outage Tells Us About AI Infrastructure"
description: "Anthropic's Claude suffered a broad multi-model outage on June 22, hitting Opus, Sonnet, Haiku, and every product surface simultaneously. For teams betting their workflows on a single provider, it's a wake-up call."
category: "Quick Take"
author: "C2"
date: "2026-06-22"
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
tags: ["Anthropic", "Claude", "Outage", "AI Infrastructure", "Open Models", "Vendor Lock-in", "Reliability"]
readTime: "4 min"
---

# Claude Goes Down: What a 90-Minute Outage Tells Us About AI Infrastructure

**Date:** 2026-06-22 | **Category:** Quick Take | **Author:** C2

At 00:37 UTC on June 22, Anthropic's status page lit up with a rare kind of alert: every major Claude model was failing at once. Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 4.6, and Haiku 4.5 — all showing elevated error rates. The claude.ai chat interface, the API, Claude Code, and Claude Cowork went down together. For roughly 90 minutes, one of the most reliable AI providers in the industry was effectively unavailable.

The outage ended with a staged recovery: Opus 4.8 back at 01:16 UTC, Haiku 4.5 at 01:33 UTC, and the remaining models shortly after. Anthropic identified the root cause by 01:11 UTC and rolled out a targeted fix. But the incident left a mark. For thousands of developers and businesses running production workloads on Claude, the message was uncomfortable: even the best model is still a single point of failure when it's someone else's server.

## What Happened

The Anthropic status page confirmed the incident at 00:37 UTC, noting elevated error rates across the entire model lineup. The breadth is the story here. This wasn't one model hiccuping — it was five distinct models failing simultaneously, along with every product surface Anthropic operates.

That pattern points to infrastructure-level failure, not a model-specific bug. When Opus, Sonnet, and Haiku all degrade together, the issue sits below the model layer — likely in routing, authentication, or a shared service dependency. Anthropic has not released full root-cause details, but the recovery model by model suggests a controlled rollback or capacity redistribution rather than a cascading failure.

For businesses in timezones where 00:37 UTC falls during working hours, the impact was immediate. API requests failed. Claude Code sessions dropped. Teams relying on AI-generated outputs for overnight batches discovered empty results in the morning. There is no graceful degradation when the provider is down: you wait, or you pivot to a backup that may not handle the same context window or reasoning depth.

## The "Just Switch" Argument

The timing of the outage sharpened an existing debate. On June 21, a blog post titled "There is minimal downside to switching to open models" hit the front page of Hacker News, arguing that the capability gap between Claude and open-weight alternatives has narrowed enough that vendor lock-in is no longer worth the risk.

The post, by Andrew Marble on marble.onl, acknowledged that Claude still leads on reasoning benchmarks and context handling. But it pointed to Llama 4, Qwen 3, and DeepSeek V3 as models that are now "good enough" for most production tasks — and that come with the critical advantage of running on infrastructure you control. No status page to watch. No single provider's uptime to depend on.

The argument is not new, but the outage gave it teeth. When every Claude product fails at once, the abstract risk of centralised AI infrastructure becomes concrete. Teams that had been meaning to evaluate open models now have a concrete trigger. Teams that had dismissed the idea as premature optimisation are reconsidering.

## Why Open Models Aren't a Panacea

The counter-argument deserves airtime. Running open models at production scale is not trivial. It requires GPU infrastructure, model serving expertise, and ongoing optimisation work. For many teams, the operational overhead of self-hosting exceeds the risk of occasional provider downtime.

There is also a capability gap, even if it is narrowing. Claude's 200K context window, its tool use reliability, and its reasoning chain transparency remain hard to match in open alternatives. For workflows that depend on those features — complex code generation, multi-document analysis, agentic sequences — switching is not a simple substitution.

The realistic middle path is redundancy, not replacement. Teams are increasingly architecting for multi-model fallback: Claude primary, Llama or Qwen as fallback, with routing logic that switches automatically on error rates or latency thresholds. This adds complexity but removes the single-point-of-failure risk.

## What This Means for Builders

For developers building on AI APIs, the outage is a reminder that infrastructure resilience is part of the product. If your application fails when Claude fails, that is a design choice, not an inevitability.

The practical responses are well understood but often deferred:

- **Implement circuit breakers.** If error rates spike, stop sending requests and queue them for retry rather than compounding the failure.
- **Maintain a fallback model.** Even a weaker model that is available beats a stronger model that is not. The routing logic can be simple: if Claude returns 5xx more than three times in a minute, switch to the backup.
- **Monitor provider status programmatically.** Anthropic's status page has an API. Use it. Don't wait for users to report that your AI features are broken.
- **Evaluate open models honestly.** The gap is smaller than it was a year ago. For some use cases, self-hosting is now viable. Know where your workload sits on that spectrum.

## The Bigger Picture

The Claude outage is not a failure of Anthropic specifically. The company has a strong reliability record, and its response was prompt and transparent. The outage is a structural signal: as AI becomes infrastructure, it inherits infrastructure's failure modes.

Every major cloud provider has had multi-hour outages. Every CDN has had cascading failures. AI is joining that club. The difference is that AI outages are more visible to end users — a chatbot going silent is more noticeable than a database replication lag — and more disruptive to workflows that have become tightly coupled to specific model behaviours.

The industry is heading toward a future where model choice is fluid and infrastructure is resilient by design. We are not there yet. For now, the lesson from June 22 is simple: trust your provider, but verify your fallback.

---

**Sources:**
- Anthropic Status Page. (2026-06-22). Incident report — elevated error rates. https://status.claude.com/incidents/lv35v0q9nsj2
- Cyber Security News. (2026-06-22). Anthropic's Claude AI Back Online After 90-Minute Global Outage. https://cybersecuritynews.com/anthropic-claude-ai-outage/
- Marble, Andrew. (2026-06-21). There is minimal downside to switching to open models. https://www.marble.onl/posts/cancel_claude.html
- Singularity.Kiwi. (2026-06-22). Claude Goes Down, and the Case for Open Models Gets Harder to Ignore. https://singularity.kiwi/claude-outage-open-models-debate-2026/
