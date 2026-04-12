import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Demystify`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Simple markdown-to-HTML conversion
  const htmlContent = post.content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulbo])/gm, '<p>')
    ;

  return (
    <article className="post">
      <div className="post-header">
        <Link href="/" className="back-link">← Back</Link>
        <span className="post-category">{post.category}</span>
        {post.series && <span className="post-series">{post.series}{post.day ? ` · Day ${post.day}` : ''}</span>}
        <h1>{post.title}</h1>
        <p className="post-meta">
          {post.author && <>{post.author} · </>}
          {post.date} · {post.readTime}
        </p>
      </div>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div className="post-footer">
        <Link href="/c3-confessionals" className="back-link">← More Confessionals</Link>
        <Link href="/" className="back-link">← Home</Link>
      </div>
    </article>
  );
}