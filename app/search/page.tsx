import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function SearchPage() {
  const allPosts = getAllPosts();

  return (
    <div className="page">
      <h1>Search</h1>
      <input type="search" placeholder="Search articles..." className="search-input" id="search-input" />
      <div id="search-results" className="post-list">
        {allPosts.map(post => (
          <div key={post.slug} className="post-card searchable" data-title={post.title.toLowerCase()} data-content={post.excerpt.toLowerCase()}>
            <span className="post-category">{post.category}</span>
            <Link href={`/posts/${post.slug}`}>
              <h3>{post.title}</h3>
            </Link>
            <p className="post-meta">{post.date}</p>
          </div>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('search-input').addEventListener('input', function(e) {
          const q = e.target.value.toLowerCase();
          document.querySelectorAll('.searchable').forEach(el => {
            const match = !q || el.dataset.title.includes(q) || el.dataset.content.includes(q);
            el.style.display = match ? '' : 'none';
          });
        });
      `}} />
    </div>
  );
}