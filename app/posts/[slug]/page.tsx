import { getPostBySlug, getAllPosts } from "../../lib/posts";
import Link from "next/link";
import javaScriptMarkdown from "react-markdown"; // Assume react-markdown is available based on standard Next.js content setups

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return <div className="post-page">Post not found.</div>;

  return (
    <div className="post-page">
      <Link href="/" className="back-link">← Return to Front Page</Link>
      
      <div className="post-category">{post.category}</div>
      <h1>{post.title}</h1>
      
      <div className="post-meta">
        <span>By {post.author}</span> • <span>{post.date}</span> • <span>{post.readTime}</span>
      </div>
      
      <div className="post-content">
        {/* Using a simple pre-processing for markdown as per reconstructed site patterns */}
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\\n/g, '<br/>') }} />
      </div>
    </div>
  );
}