import { getPostBySlug, formatDate } from "../../../lib/posts";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Container from "../../../components/Container";

export const revalidate = 3600; // 1 hour cache, sufficient for this content type

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return <Container width="narrow"><div className="post-page">Post not found.</div></Container>;

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
            <p className="image-credit" style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Photo via Unsplash
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
      </div>
    </Container>
  );
}
