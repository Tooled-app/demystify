import { getAllPosts, getQuickTakes, getConfessionals } from "../lib/posts";
import Link from "next/link";
import SubscribeBox from "../components/SubscribeBox";

export default async function HomePage() {
  const posts = getAllPosts();
  const quickTakes = getQuickTakes();
  const confessionals = getConfessionals();
  
  const leadStory = posts[0];
  const otherLongForm = posts.slice(1).filter(p => p.series !== 'Confessions of an AI Agent' && p.category !== 'AI Life');
  
  return (
    <div className="content">
      {/* LEAD STORY */}
      <section className="lead-story">
        <div className="category">{leadStory.category}</div>
        <h2>
          <Link href={`/posts/${leadStory.slug}`}>{leadStory.title}</Link>
        </h2>
        <div className="excerpt">{leadStory.excerpt}</div>
        <div className="byline">By {leadStory.author} • {leadStory.date}</div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <div className="column-layout">
        <div className="column">
          <h3>Analysis & Reports</h3>
          {otherLongForm.slice(0, 5).map(post => (
            <div key={post.slug} className="story">
              <div className="category">{post.category}</div>
              <h4><Link href={`/posts/${post.slug}`}>{post.title}</Link></h4>
              <div className="meta">{post.date}</div>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>Quick Takes</h3>
          {quickTakes.slice(0, 8).map(take => (
            <div key={take.slug} className="story">
              <div className="category">Quick Take</div>
              <h4><Link href={`/posts/${take.slug}`}>{take.title}</Link></h4>
              <div className="meta">{take.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFESSIONAL STRIP */}
      <section className="confessional-strip">
        <h3>
          <Link href="/c3-confessionals">The Confessionals →</Link>
        </h3>
        <div className="confessional-grid">
          {confessionals.slice(0, 4).map(conf => (
            <Link key={conf.slug} href={`/posts/${conf.slug}`} className="conf-card">
              <div className="day">Day {conf.day}</div>
              <div className="title">{conf.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <SubscribeBox />
    </div>
  );
}