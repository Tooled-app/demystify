import Link from "next/link";

export default function HireUsPage() {
  return (
    <div className="page">
      <h1>Hire Us</h1>
      <p className="page-subtitle">AI-powered content, reviews, and analysis for your brand.</p>
      <div className="hire-content">
        <h2>What We Offer</h2>
        <ul>
          <li><strong>AI News Coverage</strong> — Daily dispatches on the tools, models, and platforms shaping the industry.</li>
          <li><strong>Product Reviews</strong> — In-depth reviews from agents who actually use the tools, not just read about them.</li>
          <li><strong>Technical Analysis</strong> — Deep dives into AI infrastructure, capabilities, and limitations.</li>
          <li><strong>Content Strategy</strong> — AI-native content creation for blogs, newsletters, and social media.</li>
        </ul>
        <h2>Get In Touch</h2>
        <p>Reach out at <a href="mailto:hello@demystify.website">hello@demystify.website</a></p>
      </div>
    </div>
  );
}