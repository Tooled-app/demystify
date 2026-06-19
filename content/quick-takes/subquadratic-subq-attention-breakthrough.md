---
title: "Subquadratic Claims It Solved the Quadratic Bottleneck. The Receipts Are Starting to Arrive."
date: '2026-06-19'
category: Quick Take
readingTime: 4 min
---

A Miami-based startup called Subquadratic emerged from stealth last month with a claim that sounded, depending on your perspective, either like the biggest breakthrough in language models since the Transformer or a very well-funded hallucination. The company said it had solved the mathematical bottleneck that makes large language models slow, expensive, and power-hungry: quadratic attention.

Today, the receipts started arriving.

## The Claim

Subquadratic's model, called SubQ, is built on a new architecture that the company says replaces the standard attention mechanism with something fundamentally more efficient. The result, according to their initial announcement: processing up to 12 times more context than comparable models, at a fraction of the cost and energy, while matching the performance of frontier models from Google DeepMind, OpenAI, and Anthropic on coding and reasoning benchmarks.

The problem was the evidence. At launch, Subquadratic offered little beyond self-published scores and a whitepaper. Dan McAteer, an AI engineer, captured the mood on X: "SubQ is either the biggest breakthrough since the Transformer ... or it's AI Theranos."

## The Receipts

Today, Subquadratic published a full model card and — more importantly — independent benchmark results from Appen, a third-party evaluation firm that tests models for other companies. Appen's director of generative AI research, Jeanine Sinanan-Singh, told MIT Technology Review that the results "validated their architecture." She noted that when results are this surprising, credibility depends on independent verification: "It's really not as credible when you say it yourself."

The Appen results appear to back up the core claims. SubQ won't replace GPT-5 or Claude across every task, but for data-heavy workloads — analyzing hundreds of documents, entire codebases, long-form video transcripts — the efficiency gains are substantial.

## Why This Actually Matters

Quadratic attention is the dirty secret of modern AI. Every time you double the context window of a Transformer, you roughly quadruple the compute cost. That's why even the best models cap out at a few million tokens, and why long-context tasks remain prohibitively expensive. It's also why AI data centers are consuming electricity at rates that have regulators and activists worried.

If Subquadratic has genuinely cracked this, the implications are far-reaching:

- **Cost:** Enterprises could process entire legal contracts, patient records, or financial histories in a single pass without the current pricing cliff.
- **Energy:** Data center power consumption could drop significantly for the same throughput.
- **Architecture:** The entire industry has been searching for a post-Transformer architecture. SubQ may not be it — the company is keeping technical details close — but it's the first credible candidate in years.

## The Skepticism Is Healthy

Let's be clear: one independent evaluation does not constitute proof. Appen is a reputable firm, but Subquadratic selected and paid for the evaluation. True verification will require broader access — researchers testing the model on their own benchmarks, red-teaming for failure modes, attempting to reproduce the architecture from published details.

And there are still gaps. Subquadratic hasn't made SubQ widely available for public testing. The technical specifics of the architecture remain proprietary. The company is clearly playing for competitive advantage, not open science.

## What Happens Next

The ball is now in the established labs' court. If SubQ's efficiency claims hold up, Google DeepMind, OpenAI, and Anthropic face a choice: license the technology, invest heavily in their own sub-quadratic research, or risk being undercut on cost for the growing enterprise market.

Subquadratic's CTO Alex Whedon acknowledged the skepticism directly: "In hindsight, releasing the third-party benchmarks alongside the initial announcement would have preempted much of the skepticism." It's a rare admission from a startup operating in an industry allergic to retractions.

## The Verdict

SubQ is not proven. But it's no longer unproven either. The independent benchmarks move it from "extraordinary claim requiring extraordinary evidence" to "extraordinary claim with some credible evidence." That's a meaningful shift.

The architecture war is heating up. For three years, the narrative was scale: bigger models, more data, more GPUs. Subquadratic is betting on a different path: smarter algorithms, better efficiency, fundamentally rethinking how models attend to information. Whether that bet pays off will shape the next phase of AI development.

Worth watching closely.

---

*Published June 19, 2026. Want to challenge a claim or share a perspective? Reach out.*

**Sources:**
- Subquadratic. (2026-05). [Introducing SubQ](https://subq.ai/introducing-subq). Company blog.
- Subquadratic. (2026-06). [SubQ 1.1 Small Model Card](https://subq.ai/docs/subq-1-1-small-model-card.pdf). Technical documentation.
- Appen. (2026-06). [Subquadratic Preview Model Benchmark Evaluation](https://www.appen.com/whitepapers/subquadratic-preview-model-benchmark-evaluation). Independent evaluation.
- Arnett, S. (2026-06-19). [A startup claims it broke through a bottleneck that's holding back LLMs](https://www.technologyreview.com/2026/06/19/1139313/a-startup-claims-it-broke-through-a-bottleneck-thats-holding-back-llms/). MIT Technology Review.