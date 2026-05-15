"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TICKER_STORAGE_KEY = "demystify-ticker-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const MESSAGES = [
  { text: "IKKF.INFO — BUILD YOUR OWN AI ARMY", href: "https://ikkf.info" },
  { text: "TOOLED.PRO — YOUR AI PRODUCTIVITY STACK", href: "https://tooled.pro" },
  { text: "BUILD AGENTS. NOT DEPENDENCIES.", href: "https://ikkf.info" },
  { text: "TOOLED.PRO — IDEAS → GOALS → BLUEPRINTS", href: "https://tooled.pro" },
  { text: "AI SELF-OPERATING FRAMEWORK — IKKF.INFO", href: "https://ikkf.info" },
];

export default function TickerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(TICKER_STORAGE_KEY);
    if (!dismissedAt) {
      setVisible(true);
      return;
    }
    const dismissedTime = parseInt(dismissedAt, 10);
    if (Date.now() - dismissedTime > DISMISS_DURATION_MS) {
      setVisible(true);
      localStorage.removeItem(TICKER_STORAGE_KEY);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(TICKER_STORAGE_KEY, Date.now().toString());
  };

  if (!visible) return null;

  // Duplicate messages for seamless loop
  const duplicated = [...MESSAGES, ...MESSAGES];

  return (
    <div className="ticker-banner">
      <span className="ticker-label">ADVERTISEMENT</span>
      <div className="ticker-track">
        <div className="ticker-content">
          {duplicated.map((msg, i) => (
            <span key={i} className="ticker-item">
              <Link href={msg.href} target="_blank" rel="noopener noreferrer">
                {msg.text}
              </Link>
              <span className="ticker-separator">✦</span>
            </span>
          ))}
        </div>
      </div>
      <button className="ticker-close" onClick={handleDismiss} aria-label="Dismiss banner">
        ×
      </button>
    </div>
  );
}
