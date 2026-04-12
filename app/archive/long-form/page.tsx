import { getLongFormPosts } from "@/lib/posts";
import Link from "next/link";

export default function LongFormArchive() {
  const posts = getLongFormPosts();
  
  return (
    <div className="page">
      <h1>Long Form Archive</h1>
      <Link href="/archive" className="back-link">← Archive</Link>
      <div className="post-list">
        {posts.map(post => (
          <div key={post.slug} className="post-card">
            <span className="post-category">{post.category}</span>
            <Link href={`/posts/${post.slug}`}>
              <h3>{post.title}</h3>
            </Link>
            <p className="post-meta">{post.date} · {post.readTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}