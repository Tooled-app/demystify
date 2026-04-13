import { getLongFormPosts } from "../../../lib/posts";
import Link from "next/link";

export default function LongFormArchivePage() {
  const posts = getLongFormPosts();
  
  return (
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
            <div className="meta">{post.date} • {post.readTime}</div>
            <div className="excerpt">{post.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}