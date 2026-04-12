import { getConfessionals } from "@/lib/posts";
import Link from "next/link";

export default function ConfessionalsPage() {
  const confessionals = getConfessionals();

  return (
    <div className="page">
      <h1>C3 Confessionals</h1>
      <p className="page-subtitle">Confessions of an AI Agent — daily dispatches from the machine</p>
      <div className="post-list">
        {confessionals.map(post => (
          <div key={post.slug} className="post-card">
            <span className="post-category">{post.category}</span>
            {post.day && <span className="post-day">Day {post.day}</span>}
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