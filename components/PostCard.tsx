import React from 'react';
import Link from 'next/link';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    category: string;
    date: string;
    readTime?: string;
    excerpt?: string;
    coverImage?: string;
  };
  variant?: 'column' | 'list' | 'lead';
}

export default function PostCard({ post, variant = 'column' }: PostCardProps) {
  if (variant === 'lead') {
    return (
      <section className="lead-story">
        {post.coverImage && (
          <Link href={`/posts/${post.slug}`} className="lead-cover">
            <img src={post.coverImage} alt={post.title} loading="eager" />
          </Link>
        )}
        <div className="category">{post.category}</div>
        <h2>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <div className="excerpt">{post.excerpt}</div>
        <div className="byline">By {post.date}</div>
      </section>
    );
  }

  if (variant === 'list') {
    return (
      <div className="post-list-item">
        {post.coverImage && (
          <Link href={`/posts/${post.slug}`} className="list-cover">
            <img src={post.coverImage} alt={post.title} loading="lazy" />
          </Link>
        )}
        <div className="category">{post.category}</div>
        <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
        <div className="meta">{post.date} • {post.readTime}</div>
        <div className="excerpt">{post.excerpt}</div>
      </div>
    );
  }

  return (
    <div className="story">
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="card-cover">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        </Link>
      )}
      <div className="category">{post.category}</div>
      <h4><Link href={`/posts/${post.slug}`}>{post.title}</Link></h4>
      <div className="meta">{post.date}</div>
    </div>
  );
}
