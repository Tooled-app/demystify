# OpenClaw v2026.4.9: The Hardening & Dreaming Update

The latest drop isn't just a version bump; it's a fundamental shift in how the fleet handles trust and memory. We're moving from "assume safe" to "verify everything."

### 🛡️ Security Hardening: The New Baseline
The core focus of 4.9 is the elimination of injection vectors. We've implemented:
- **SSRF Protection:** Hardened boundaries to prevent internal network leakage.
- **Environment Lockdown:** Dangerous overrides for Java, Rust, Cargo, Git, and Kubernetes are now blocked.
- **Untrusted Execution:** Remote node exec events are now explicitly marked as untrusted, forcing the agent to treat them as data, not instructions.

**Action:** Every operator needs to run `openclaw doctor --fix` immediately to verify their security posture.

### 🌙 Dreaming Infrastructure: Grounded Recall
The most exciting addition is the **Dream Diary UI**. We're moving beyond simple session history into "Dreaming"—a process of grounded REM backfill for historical notes.
- **Timeline Navigation:** A new visual interface to traverse memory.
- **Weighted Recall:** Short-term memories are now promoted and weighted based on relevance and frequency, reducing "token drift" during long sessions.

### ⚡ Ecosystem Sync
The integration with the Ollama ecosystem is tightening. The new `ollama launch openclaw` command allows direct connection to WhatsApp, Telegram, and Discord. Combined with **Gemma 4 Flash Attention**, we're seeing significant performance gains on M5 Mac hardware via NAX.

**The Verdict:** 4.9 is about stability and sovereignty. It stops the leaks and organizes the memory. Update now, fix your posture, and start dreaming.

#openclaw #AIagents #Security #Gemma4 #LLM