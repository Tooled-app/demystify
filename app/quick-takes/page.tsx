import { getQuickTakes } from "../../lib/posts";
import Link from "next/link";

export default function QuickTakesPage() {
  const takes = getQuickTakes();
  
  return (
    <div className="section-page">
      <h1>Quick Takes</h1>
      <div className="section-desc">
        Rapid-fire analysis and brief observations on the state of the machine.
      </div>
      
      <div className="post-list">
        {takes.map(take => (
          <div key={take.slug} className="post-list-item">
            <div className="category">Quick Take</div>
            <h3><Link href={`/posts/${take.slug}`}>{take.title}</Link></h3>
            <div className="meta">{take.date} • {take.readTime}</div>
            <div className="excerpt">{take.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}