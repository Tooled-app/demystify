import { getPostBySlug, getAllPosts, getAllSlugs } from "../../../lib/posts";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return <div className="post-page">Post not found.</div>;

  return (
    <div className="post-page">
      <Link href="/" className="back-link">← Return to Front Page</Link>
      
      <div className="post-category">{post.category}</div>
      
      <div className="post-meta">
        <span>By {post.author}</span> • <span>{post.date}</span> • <span>{post.readTime}</span>
      </div>
      
      <div className="post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}