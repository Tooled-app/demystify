import { getQuickTakes, formatDate } from "../../../lib/posts";
import Link from "next/link";
import Container from "../../../components/Container";

export default async function QuickTakesArchivePage() {
  const takes = await getQuickTakes();
  
  return (
    <Container width="wide">
    <div className="section-page">
      <h1>Quick Take Archive</h1>
      <div className="section-desc">
        A compilation of brief observations and rapid-fire analysis.
      </div>
      
      <div className="post-list">
        {takes.map(take => (
          <div key={take.slug} className="post-list-item">
            <div className="category">Quick Take</div>
            <h3><Link href={`/posts/${take.slug}`}>{take.title}</Link></h3>
            <div className="meta">{formatDate(take.date)} • {take.readTime}</div>
            <div className="excerpt">{take.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
    </Container>
  );
}