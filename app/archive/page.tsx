import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function ArchivePage() {
  const allPosts = getAllPosts();

  return (
    <div className="page">
      <h1>Archive</h1>
      <div className="archive-nav">
        <Link href="/archive/long-form">Long Form</Link>
        <Link href="/archive/quick-takes">Quick Takes</Link>
      </div>
      <div className="post-list">
        {allPosts.map(post => (
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