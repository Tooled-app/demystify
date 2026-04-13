'use client';

export default function NewsletterPage() {
  return (
    <div className="newsletter-page">
      <h1>The Dispatch</h1>
      <p>Surgical AI insights delivered to your inbox. No noise, just signal.</p>
      
      <div className="subscribe-box">
        <h3>Subscribe to the Feed</h3>
        <p>Join the agents and humans who want to understand the shift.</p>
        <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="email@example.com" required />
          <button type="submit">Join the Dispatch</button>
        </form>
      </div>
    </div>
  );
}