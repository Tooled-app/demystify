import { getPostBySlug, formatDate, getAdjacentPosts, getAllPosts } from "../../../lib/posts";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Container from "../../../components/Container";
import type { Metadata } from "next";

export const revalidate = 3600;

const SITE_URL = "https://demystify.website";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found — Demystify",
      description: "The requested post could not be found.",
    };
  }

  const title = post.title;
  const description = post.excerpt || post.content.slice(0, 160).replace(/[#*_`]/g, "").trim() + "...";
  const url = `${SITE_URL}/posts/${post.slug}`;

  return {
    title: `${title} — Demystify`,
    description,
    authors: [{ name: post.author || "C3" }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "C3"],
      images: post.coverImage ? [{ url: post.coverImage, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    other: {
      "json-ld": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        author: { "@type": "Organization", name: post.author || "C3" },
        publisher: { "@type": "Organization", name: "Demystify", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
        datePublished: post.date,
        url,
        image: post.coverImage || undefined,
      }),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return <Container width="narrow"><div className="post-page">Post not found.</div></Container>;

  const { prev, next } = await getAdjacentPosts(slug);

  // Get related posts (same category, excluding current, up to 3)
  const allPosts = await getAllPosts();
  const related = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  return (
    <Container width="narrow">
      <div className="post-page">
        <Link href="/" className="back-link">← Return to Front Page</Link>
        
        {post.coverImage && (
          <div className="post-cover-image">
            <img 
              src={post.coverImage} 
              alt={post.title}
              style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <p className="image-credit">
              <a href="https://unsplash.com?utm_source=demystify.website&utm_medium=referral" target="_blank" rel="noopener noreferrer">Photo via Unsplash</a>
            </p>
          </div>
        )}
        
        <div className="post-category">{post.category}</div>
        
        <div className="post-meta">
          <span>By {post.author}</span> • <span>{formatDate(post.date)}</span> • <span>{post.readTime}</span>
        </div>
        
        <div className="post-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="related-posts">
            <h3 className="related-title">Related {post.category}s</h3>
            <div className="related-grid">
              {related.map(r => (
                <Link key={r.slug} href={`/posts/${r.slug}`} className="related-card">
                  <div className="related-category">{r.category}</div>
                  <div className="related-card-title">{r.title}</div>
                  <div className="related-meta">{formatDate(r.date)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next Navigation */}
        <nav className="post-nav">
          <div className="post-nav-inner">
            {prev ? (
              <Link href={`/posts/${prev.slug}`} className="post-nav-link post-nav-prev">
                <span className="post-nav-label">← Previous</span>
                <span className="post-nav-title">{prev.title}</span>
              </Link>
            ) : <div className="post-nav-link post-nav-prev post-nav-disabled" />}

            {next ? (
              <Link href={`/posts/${next.slug}`} className="post-nav-link post-nav-next">
                <span className="post-nav-label">Next →</span>
                <span className="post-nav-title">{next.title}</span>
              </Link>
            ) : <div className="post-nav-link post-nav-next post-nav-disabled" />}
          </div>
        </nav>
      </div>
    </Container>
  );
}
