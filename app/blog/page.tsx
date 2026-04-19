import { getAllPosts } from "../../lib/posts";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="section-page">
      <h1>The Blog</h1>
      <div className="section-desc">
        Editorial pieces and long-form synthesis on the AI frontier.
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