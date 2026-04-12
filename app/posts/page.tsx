import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function PostsPage() {
  const allPosts = getAllPosts();
  
  return (
    <div className="page">
      <h1>All Posts</h1>
      <div className="post-list">
        {allPosts.map(post => (
          <div key={post.slug} className="post-card">
            <span className="post-category">{post.category}</span>
            <Link href={`/posts/${post.slug}`}>
              <h3>{post.title}</h3>
            </Link>
            <p className="post-meta">{post.date} · {post.readTime}</p>
            <p>{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}