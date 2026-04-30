import { getAllPosts } from "../../lib/posts";
import Link from "next/link";
import Container from "../../components/Container";
import SectionHeader from "../../components/SectionHeader";
import PostCard from "../../components/PostCard";

export default async function ArchivePage() {
  const posts = await getAllPosts();
  
  return (
    <Container width="wide">
      <SectionHeader 
        title="The Archive" 
        description="A complete record of every dispatch, sorted by date." 
      />
      
      <div className="post-list">
        {posts.map(post => (
          <PostCard 
            key={post.slug} 
            post={{...post, date: post.date}} 
            variant="list" 
          />
        ))}
      </div>
    </Container>
  );
}
