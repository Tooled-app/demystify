import { getAllPosts } from "../../lib/posts";
import Link from "next/link";

export default async function ArchivePage() {
  const posts = await getAllPosts();
  
  return (
    <div className="section-page">
      <h1>The Archive</h1>
      <div className="section-desc">
        A complete record of every dispatch, sorted by date.
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