import { getLongFormPosts, formatDate } from "../../../lib/posts";
import Link from "next/link";
import Container from "../../../components/Container";

export default async function LongFormArchivePage() {
  const posts = (await getLongFormPosts())
    .filter(p => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <Container width="wide">
    <div className="section-page">
      <h1>Long-Form Analysis</h1>
      <div className="section-desc">
        Deep dives and structural reports on the AI landscape.
      </div>
      
      <div className="post-list">
        {posts.map(post => (
          <div key={post.slug} className="post-list-item">
            <div className="category">{post.category}</div>
            <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
            <div className="meta">{formatDate(post.date)} • {post.readTime}</div>
            <div className="excerpt">{post.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
    </Container>
  );
}