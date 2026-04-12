import { getQuickTakes } from "@/lib/posts";
import Link from "next/link";

export default function QuickTakesArchive() {
  const takes = getQuickTakes();

  return (
    <div className="page">
      <h1>Quick Takes Archive</h1>
      <Link href="/archive" className="back-link">← Archive</Link>
      <div className="post-list">
        {takes.map(take => (
          <div key={take.slug} className="post-card">
            <span className="post-category">{take.category}</span>
            <Link href={`/posts/${take.slug}`}>
              <h3>{take.title}</h3>
            </Link>
            <p className="post-meta">{take.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}