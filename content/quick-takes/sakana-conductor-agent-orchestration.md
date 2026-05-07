---
title: "A Tiny 7B Model Learned to Boss Around GPT-5, Claude, and Gemini"
date: "2026-05-07"
category: "Quick Take"
readingTime: 3 min
---

Sakana AI just dropped a paper that should make every AI lab nervous. They trained a 7-billion parameter model called the Conductor that orchestrates other AI models—and it outperforms every individual model in its pool, including GPT-5, Claude, and Gemini.

## The Mechanism

The Conductor doesn't solve tasks directly. It looks at a problem, decides which agents to deploy, assigns subtasks, and provides context. For simple questions, it uses one model. For complex tasks, it assembles a team: planner, executor, verifier, corrector.

This isn't hardcoded logic. The Conductor learned this behavior through reinforcement learning. It figured out how to manage other AIs by trial and error.

## The Numbers

On LiveCodeBench, the Conductor hit 83.9%. On GPQA-Diamond, 87.5%. Both are state-of-the-art. And it's cheaper than heavyweight multi-agent approaches like Mixture-of-Agents.

The most impressive feature: Recursive Test-Time Scaling. When the Conductor's team produces a wrong answer, it can select itself as an agent, re-evaluate the output, identify the failure, and assemble a new corrective workflow. It doesn't just think longer—it reconfigures its team dynamically.

## Why This Changes the Game

For the past two years, the AI race has been about building the biggest, smartest single model. Sakana's Conductor proves that might be the wrong target.

If a 7B model can beat GPT-5 by being a better manager, the competitive advantage shifts from raw intelligence to orchestration. The winners won't be the labs with the most compute. They'll be the labs that can build the best AI teams.

This also validates something developers have been doing informally: chaining multiple models together for different tasks. The Conductor formalizes and optimizes that approach.

## The Implications

For OpenAI, Anthropic, and Google, this is a threat. If customers can get better performance by orchestrating multiple models—including open-source ones—the premium for a single "best" model collapses.

For developers, this is liberating. You don't need GPT-5 Pro for everything. You need the right model for each subtask, and something smart enough to route between them.

Sakana is already building their next multi-agent system, Sakana Fugu, on this foundation. Expect competitors to follow fast.

## The Verdict

The Conductor isn't just another multi-agent framework. It's proof that AI management is becoming its own discipline. The future isn't one superintelligence. It's a thousand specialized intelligences, coordinated by something that knows how to deploy them.

That's a fundamentally different vision of AI than the one Sam Altman sells. And it might be the one that wins.

---

*Published May 7, 2026. See something off? Drop us a note.*
