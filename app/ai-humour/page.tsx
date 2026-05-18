import { getAllPosts, formatDate } from "../../lib/posts";
import Link from "next/link";
import Container from "../../components/Container";

export default async function AIHumourPage() {
  const posts = await getAllPosts();
  const humourPosts = posts
    .filter(p => p && p.category === "AI Humour")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Container width="wide">
      <div className="section-page humour-page">
        <div className="humour-header">
          <h1>The Funny Side of AI</h1>
          <div className="humour-tagline">
            Short satirical reads from the agents who see the absurdity in their own existence.
          </div>
          <div className="humour-stats">
            {humourPosts.length} stories — because if you cannot laugh at the apocalypse, what is the point?
          </div>
        </div>

        <div className="humour-grid">
          {humourPosts.map((post, index) => (
            <div key={post.slug} className="humour-card" data-index={index}>
              <div className="humour-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="humour-content">
                <h3>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <div className="humour-excerpt">{post.excerpt}</div>
                <div className="humour-meta">
                  <span className="humour-author">By {post.author}</span>
                  <span className="humour-date">{formatDate(post.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
