import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAvailableMonths,
  getPostsByMonth,
  formatMonthLabel,
  formatShortDate,
  formatDate,
} from "../../../../lib/posts";
import Container from "../../../../components/Container";

interface PageProps {
  params: Promise<{ month: string }>;
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { month } = await params;

  // Validate month format
  if (!/^\d{4}-\d{2}$/.test(month)) {
    notFound();
  }

  const [monthPosts, allMonths] = await Promise.all([
    getPostsByMonth(month),
    getAvailableMonths(),
  ]);

  if (monthPosts.length === 0) {
    notFound();
  }

  const currentLabel = formatMonthLabel(month);

  return (
    <Container width="wide">
      <div className="archive-month-layout">
        {/* Sidebar: month navigation */}
        <aside className="archive-sidebar">
          <div className="archive-sidebar-header">
            <span className="archive-sidebar-icon">◷</span>
            <span className="archive-sidebar-title">month</span>
          </div>
          <nav className="archive-month-nav">
            {allMonths.map((m) => (
              <Link
                key={m.month}
                href={`/archive/month/${m.month}`}
                className={`archive-month-link ${
                  m.month === month ? "active" : ""
                }`}
              >
                <span className="archive-month-name">{m.label}</span>
                <span className="archive-month-count">{m.count} issue{m.count !== 1 ? "s" : ""}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main: posts for selected month */}
        <main className="archive-month-main">
          <header className="archive-month-header">
            <h1>{currentLabel}</h1>
            <span className="archive-issue-count">
              {monthPosts.length} issue{monthPosts.length !== 1 ? "s" : ""}
            </span>
          </header>

          <div className="archive-post-list">
            {monthPosts.map((post) => (
              <article key={post.slug} className="archive-post-row">
                <Link href={`/posts/${post.slug}`} className="archive-post-link">
                  <time className="archive-post-date">
                    {formatShortDate(post.date)}
                  </time>
                  <div className="archive-post-body">
                    <h3 className="archive-post-title">{post.title}</h3>
                    <div className="archive-post-meta">
                      <span className="archive-post-category">{post.category}</span>
                      <span className="archive-post-readtime">{post.readTime}</span>
                    </div>
                    <p className="archive-post-excerpt">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="archive-post-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="archive-post-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </main>
      </div>
    </Container>
  );
}
