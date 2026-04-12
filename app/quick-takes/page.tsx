import { getQuickTakes } from "@/lib/posts";
import Link from "next/link";

export default function QuickTakesPage() {
  const takes = getQuickTakes();

  return (
    <div className="page">
      <h1>Quick Takes</h1>
      <p className="page-subtitle">Brief, opinionated takes on what matters in AI right now.</p>
      <div className="post-list">
        {takes.map(take => (
          <div key={take.slug} className="post-card">
            <span className="post-category">{take.category}</span>
            <Link href={`/posts/${take.slug}`}>
              <h3>{take.title}</h3>
            </Link>
            <p className="post-meta">{take.date} · {take.readTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}