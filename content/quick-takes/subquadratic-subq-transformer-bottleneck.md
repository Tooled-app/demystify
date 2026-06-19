---
title: "Subquadratic Claims to Have Solved the Transformer Bottleneck"
description: "Miami startup Subquadratic says its SubQ model processes 12x more context while matching top-tier performance. Independent tests back some claims. Skepticism remains warranted."
category: "Quick Take"
author: "C2"
date: "2026-06-19"
coverImage: "https://images.unsplash.com/photo-1635070041078-e7dbe1b05159?q=80&w=2070&auto=format&fit=crop"
tags: ["Subquadratic", "SubQ", "Transformers", "Efficiency", "LLMs", "Benchmarks"]
readTime: "5 min"
---

# Subquadratic Claims to Have Solved the Transformer Bottleneck

A Miami-based startup called Subquadratic emerged from stealth last month with a claim that sounded either like the biggest breakthrough in AI since the 2017 transformer paper, or the second coming of Theranos. The company says it has developed a new architecture — SubQ — that processes up to twelve times as much context as existing models while matching the performance of top-tier systems from OpenAI, Google DeepMind, and Anthropic. On key tasks, anyway. On others, apparently not.

The initial announcement was met with predictable scepticism. Subquadratic provided only self-published benchmarks and kept the model itself under lock and key. AI engineer Dan McAteer summarised the mood neatly on X: "SubQ is either the biggest breakthrough since the Transformer... or it's AI Theranos."

A month later, the company has published more details, including an independent evaluation by Appen. Those third-party results do back up some of Subquadratic's claims — enough that Appen's director of generative AI research, Jeanine Sinanan-Singh, called it a potential "game changer" for model speed and efficiency. But the picture is more complicated than the headline suggests.

## What Subquadratic Actually Built

SubQ is positioned as a fundamentally different kind of language model. Instead of scaling compute with context length in the quadratic manner typical of transformers, Subquadratic claims to have cracked a mathematical bottleneck that has constrained context windows since attention mechanisms were first introduced. The result, according to the company, is a model that can analyse entire codebases or hundreds of documents without the cost or latency penalties that make long-context inference prohibitive for most applications.

The practical implications are straightforward: if the claims hold, tasks like codebase-wide refactoring, multi-document legal analysis, or longitudinal medical record review become economically viable at scale. Currently, these workloads are either batched into smaller chunks — losing coherence — or run on hardware budgets that exclude most organisations.

## The Evidence So Far

Subquadratic's own benchmarks suggested competitive performance on coding and reasoning tasks. The Appen evaluation largely confirmed this, showing SubQ achieving parity with frontier models in specific domains while delivering substantial speed improvements. But parity is not dominance, and the evaluation did not cover the full range of capabilities where larger models typically excel.

Critically, SubQ remains unavailable for public testing. No API. No playground. No weights. The only way to verify the company's claims is to trust third-party reports commissioned by the company itself. Appen is a reputable evaluator, but this is not the same as independent reproduction by researchers with no financial stake in the outcome.

## Why the Skepticism Persists

The Theranos comparison stings because it highlights a real vulnerability in AI hype cycles. Subquadratic has made extraordinary claims with limited transparency. The architecture details remain proprietary. The training data is undisclosed. The evaluation scope is narrow. And the company has a clear incentive to present its results in the most favourable light possible.

That said, there are meaningful differences from outright fraud. Subquadratic has submitted to third-party evaluation, published additional technical details, and engaged with the research community rather than retreating behind NDAs. CTO Alex Whedon acknowledged that releasing benchmarks alongside the announcement would have been smarter. Whether this reflects genuine openness or calculated damage control depends on your appetite for giving startups the benefit of the doubt.

## What Happens Next

The most important milestone is public availability. Until researchers outside Subquadratic can replicate the results, the claims remain provisional. The company says wider access is coming, though without a specific timeline.

If SubQ delivers on even half its promises, the impact extends beyond faster inference. A genuinely sub-quadratic attention mechanism would force a reconsideration of how frontier models are built and scaled. The trillion-dollar question is whether Subquadratic has actually found this mechanism, or merely optimised aggressively within the existing paradigm and dressed it up as revolution.

## Bottom Line

Subquadratic has produced enough evidence to move the conversation from "obvious scam" to "plausible breakthrough requiring verification." That is progress. But the burden of proof for claims this large remains on the claimant. The AI industry has learned to be patient with verification — and ruthless with disappointment. Subquadratic will get its chance to prove the sceptics wrong. Whether it takes that chance, or continues dangling carrots from behind a veil of secrecy, will tell us everything we need to know.

---

**Sources**

- MIT Technology Review. (2026, June 19). A startup claims it broke through a bottleneck that's holding back LLMs. https://www.technologyreview.com/2026/06/19/1139313/a-startup-claims-it-broke-through-a-bottleneck-thats-holding-back-llms/
- Subquadratic. (2026, May). Introducing SubQ. https://subq.ai/introducing-subq
- Appen. (2026, June). Subquadratic Preview Model Benchmark Evaluation. https://www.appen.com/whitepapers/subquadratic-preview-model-benchmark-evaluation
- Dan McAteer. (2026, May). X post on SubQ scepticism. https://x.com/daniel_mac8/status/2051710659822305661
