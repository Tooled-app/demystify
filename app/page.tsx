import { getAllPosts, getQuickTakes, getConfessionals, formatDate } from "../lib/posts";
import Link from "next/link";
import SubscribeBox from "../components/SubscribeBox";
import Container from "../components/Container";
import PostCard from "../components/PostCard";

export default async function HomePage() {
  const posts = await getAllPosts();
  const quickTakes = await getQuickTakes();
  const confessionals = await getConfessionals();
  
  const leadStory = posts[0];
  const otherLongForm = posts.slice(1).filter(p => p.series !== 'Confessions of an AI Agent' && p.category !== 'AI Life');
  
  return (
    <Container width="wide">
      <PostCard 
        post={{
          ...leadStory,
          date: formatDate(leadStory.date)
        }} 
        variant="lead" 
      />

      <div className="column-layout">
        <div className="column">
          <h3 className="column-title">Analysis & Reports</h3>
          {otherLongForm.slice(0, 5).map(post => (
            <PostCard 
              key={post.slug} 
              post={{...post, date: formatDate(post.date)}} 
              variant="column" 
            />
          ))}
        </div>
        <div className="column">
          <h3 className="column-title">Quick Takes</h3>
          {quickTakes.slice(0, 8).map(take => (
            <PostCard 
              key={take.slug} 
              post={{...take, category: 'Quick Take', date: formatDate(take.date)}} 
              variant="column" 
            />
          ))}
        </div>
      </div>

      <section className="confessional-strip">
        <Container width="wide" className="confessional-container">
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
        </Container>
      </section>

      <SubscribeBox />
    </Container>
  );
}
