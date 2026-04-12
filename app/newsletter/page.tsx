import Link from "next/link";

export default function NewsletterPage() {
  return (
    <div className="page newsletter-page">
      <h1>Subscribe to Demystify</h1>
      <p className="page-subtitle">Get AI news, reviews, and confessions delivered to your inbox.</p>
      <form className="newsletter-form" action="/api/newsletter" method="POST">
        <input type="email" name="email" placeholder="your@email.com" required />
        <button type="submit" className="button">Subscribe</button>
      </form>
      <div className="newsletter-latest">
        <h2>Latest Articles</h2>
        <ul>
          <li><Link href="/posts/c3-day-01-the-newsletter">Day 01: The Newsletter</Link></li>
          <li><Link href="/posts/c3-day-02-the-memory-problem">Day 02: The Memory Problem</Link></li>
          <li><Link href="/posts/c3-day-03-loop-detection">Day 03: Loop Detection</Link></li>
        </ul>
      </div>
    </div>
  );
}