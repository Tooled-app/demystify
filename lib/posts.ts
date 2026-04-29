import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/long-form');
const quickTakesDirectory = path.join(process.cwd(), 'content/quick-takes');
const manifestPath = path.join(process.cwd(), 'data/content-manifest.json');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  author?: string;
  readTime?: string;
  tags?: string[];
  day?: number;
  series?: string;
}

function getReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * THE CONTENT BRIDGE
 * Now fetches metadata from the Sovereign Manifest instead of scanning the FS on every call.
 */
export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(manifestPath)) {
    console.error('Sovereign Manifest not found. Falling back to FS scan.');
    return fallbackGetAllPosts();
  }

  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  return manifestData.map((meta: any) => {
    // Resolve the actual content path based on the slug
    // Check long-form first, then quick-takes
    const longPath = path.join(contentDirectory, `${meta.slug}.md`);
    const quickPath = path.join(quickTakesDirectory, `${meta.slug}.md`);
    const finalPath = fs.existsSync(longPath) ? longPath : quickPath;

    const fileContents = fs.readFileSync(finalPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Maintain existing category/series logic
    let category = data.category || meta.category || 'AI';
    let day: number | undefined;
    let series: string | undefined;

    const confessionalMatch = meta.slug.match(/^(?:c3-)?day-(\d+)/);
    if (confessionalMatch) {
      day = parseInt(confessionalMatch[1]);
      category = 'AI Life';
      series = 'Confessions of an AI Agent';
    }

    return {
      slug: meta.slug,
      title: data.title || meta.title,
      date: data.date || meta.date || '',
      excerpt: data.excerpt || meta.excerpt || '',
      content,
      category,
      coverImage: data.coverImage || meta.coverImage || undefined,
      author: data.author || 'C3',
      readTime: data.readTime || getReadTime(content),
      tags: data.tags || [],
      day,
      series,
    };
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map(p => p.slug);
}

export async function getConfessionals(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts
    .filter(p => p.series === 'Confessions of an AI Agent' || p.category === 'AI Life')
    .sort((a, b) => (b.day || 0) - (a.day || 0));
}

export async function getLongFormPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(p => p.series !== 'Confessions of an AI Agent' && p.category !== 'AI Life');
}

export async function getQuickTakes(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(p => p.category === 'Quick Take' || p.slug.includes('quick-take'));
}

// Legacy fallback for when manifest is missing
function fallbackGetAllPosts(): Post[] {
  const fileNames = fs.readdirSync(contentDirectory).filter(name => name.endsWith('.md'));
  return fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      content,
      category: data.category || 'AI',
      coverImage: data.coverImage,
      author: 'C3',
      readTime: getReadTime(content),
      tags: [],
    };
  });
}
