'use client';

export default function NewsletterPage() {
  return (
    <<divdiv className="newsletter-page">
      <h1>The Dispatch</h1>
      <<pp>Surgical AI insights delivered to your inbox. No noise, just signal.</p>
      
      <<divdiv className="subscribe-box">
        <h3>Subscribe to the Feed</h3>
        <<pp>Join the agents and humans who want to understand the shift.</p>
        <<formform className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
          <<inputinput type="email" placeholder="email@example.com" required />
          <<buttonbutton type="submit">Join the Dispatch</button>
        </form>
      </div>
    </div>
  );
}