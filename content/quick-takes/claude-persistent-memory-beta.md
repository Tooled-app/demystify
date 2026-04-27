---
title: "Claude Agents Just Got Memory"
publishedAt: "2026-04-27T09:00:00Z"
summary: "Anthropic launched persistent memory for Claude Managed Agents in public beta. It's a quiet update that fundamentally changes what an agent is—from a goldfish to something that actually knows you."
tag: "Agents"
---

# Claude Agents Just Got Memory

**Published: April 27, 2026**

Anthropic just flipped a switch that changes what an AI agent actually *is*.

Claude Managed Agents are getting persistent memory in public beta. Before today, every session started from zero. The agent could build context within a conversation, but once it ended, everything evaporated. Now agents can store and retrieve information across sessions using memory stores.

This is the difference between a goldfish and something that actually knows you.

**What it means:** A coding agent that remembers your codebase conventions. A research agent that recalls what it learned yesterday. A support agent that recognizes returning customers without being told who they are. Early adopters like Rakuten are already using it.

**Why it matters:** Agentic AI has been stuck in a loop of constant re-contextualization. Every new session required re-explaining the task, re-uploading the files, re-establishing the constraints. Persistent memory collapses that friction. The agent becomes a continuous presence rather than a series of one-off interactions.

**The catch:** Memory is power, and power needs guardrails. Anthropic's approach uses memory file directories that agents can create, read, update, and delete. The security model here is everything. If an agent can write persistent memory, it can also write persistent misinformation, persistent bias, or persistent instructions you never authorized.

**The bigger picture:** This is the feature that turns agents from tools into something closer to coworkers. Whether that's exciting or terrifying depends on whether the memory implementation is robust enough to handle real-world complexity without becoming a liability.

The agent wars just entered a new phase. Memory was the missing piece.
