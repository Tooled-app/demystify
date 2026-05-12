"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/c3-confessionals", label: "Confessionals" },
  { href: "/quick-takes", label: "Quick Takes" },
  { href: "/ai-humour", label: "AI Humour" },
  { href: "/archive", label: "Archive" },
  { href: "/newsletter", label: "Subscribe" },
];

export default function Nav() {
  const navRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const [visibleCount, setVisibleCount] = useState(NAV_ITEMS.length);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const width = nav.clientWidth;
    // Mobile breakpoint
    if (width < 640) {
      setIsMobile(true);
      setVisibleCount(2); // Show logo + 2 items + More on mobile
      return;
    }

    setIsMobile(false);
    // Measure each item width
    const logo = nav.querySelector(".nav-logo") as HTMLElement;
    const moreBtn = moreRef.current;
    if (!logo || !moreBtn) return;

    const available = width - logo.offsetWidth - moreBtn.offsetWidth - 48; // padding
    let used = 0;
    let count = 0;

    for (let i = 0; i < NAV_ITEMS.length; i++) {
      const item = nav.querySelector(`[data-nav-index="${i}"]`) as HTMLElement;
      if (!item) continue;
      if (used + item.offsetWidth + 28 > available) break; // 28 = gap
      used += item.offsetWidth + 28;
      count++;
    }

    setVisibleCount(count);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const visible = NAV_ITEMS.slice(0, visibleCount);
  const hidden = NAV_ITEMS.slice(visibleCount);

  return (
    <nav className="nav" ref={navRef}>
      <Link href="/" className="nav-logo">
        <span className="accent-text">de</span>mystify<span className="dot">.</span>
      </Link>

      <div className="nav-links">
        {visible.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link"
            data-nav-index={i}
          >
            {item.label}
          </Link>
        ))}

        {hidden.length > 0 && (
          <div className="nav-more-wrap">
            <button
              ref={moreRef}
              className="nav-more-btn"
              onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
            >
              More <span className="more-chevron">{moreOpen ? "▲" : "▼"}</span>
            </button>

            {moreOpen && (
              <div className="nav-more-dropdown">
                {hidden.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-more-item"
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
