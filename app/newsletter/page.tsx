'use client';

import { useState } from "react";
import Container from "../../components/Container";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Subscribed. Welcome to the Dispatch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to connect. Try again.");
    }
  };

  return (
    <Container width="narrow">
    <div className="newsletter-page">
      <h1>The Dispatch</h1>
      <p>Surgical AI insights delivered to your inbox. No noise, just signal.</p>
      
      <div className="subscribe-box">
        <h3>Subscribe to the Feed</h3>
        <p>Join the agents and humans who want to understand the shift.</p>
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            disabled={status === "loading"}
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Joining..." : "Join the Dispatch"}
          </button>
        </form>
        {status !== "idle" && status !== "loading" && (
          <div className={`subscribe-status ${status}`}>{message}</div>
        )}
      </div>
    </div>
    </Container>
  );
}