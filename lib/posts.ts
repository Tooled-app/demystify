import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/long-form');
const quickTakesDirectory = path.join(process.cwd(), 'content/quick-takes');

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

function parseDateFromFilename(filename: string): string {
  // Try to extract date from frontmatter first, fallback to filename patterns
  return ''; // Will be overridden by frontmatter
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(contentDirectory);
  const posts = fileNames
    .filter(name => name.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Determine category and day number from slug
      let category = data.category || 'AI';
      let day: number | undefined;
      let series: string | undefined;

      // Confessional pattern: day-NN-* or c3-day-NN-*
      const confessionalMatch = slug.match(/^(?:c3-)?day-(\d+)/);
      if (confessionalMatch) {
        day = parseInt(confessionalMatch[1]);
        category = 'AI Life';
        series = 'Confessions of an AI Agent';
      }
      // Also match "confessions-day1" pattern
      if (slug.startsWith('confessions-day')) {
        const d = slug.match(/day(\d+)/);
        if (d) day = parseInt(d[1]);
        category = 'AI Life';
        series = 'Confessions of an AI Agent';
      }

      // Extract title from first h1 or h2, or use frontmatter
      const titleMatch = content.match(/^#{1,2}\s+(.+)$/m);
      const title = data.title || (titleMatch ? titleMatch[1].replace(/^\*\*.*?\*\*\s*/, '') : slug.replace(/-/g, ' '));
      
      // Extract excerpt from first paragraph after title
      const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('---'));
      const excerpt = data.excerpt || data.description || (paragraphs.length > 0 ? paragraphs[0].replace(/\*[^*]+\*\s*/g, '').substring(0, 160) : '');

      return {
        slug,
        title,
        date: data.date || data.published || '',
        excerpt,
        content,
        category,
        coverImage: data.coverImage || data.cover || undefined,
        author: data.author || 'C3',
        readTime: data.readTime || getReadTime(content),
        tags: data.tags || [],
        day,
        series,
      };
    });

  // Sort by date, most recent first
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const longFormPosts = getAllPosts();
  const quickTakes = getQuickTakes();
  const allPosts = [...longFormPosts, ...quickTakes];
  return allPosts.find(p => p.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  const longFormSlugs = getAllPosts().map(p => p.slug);
  const quickTakeSlugs = getQuickTakes().map(p => p.slug);
  return [...longFormSlugs, ...quickTakeSlugs];
}

export function getConfessionals(): Post[] {
  return getAllPosts().filter(p => p.series === 'Confessions of an AI Agent' || p.category === 'AI Life');
}

export function getLongFormPosts(): Post[] {
  return getAllPosts().filter(p => p.series !== 'Confessions of an AI Agent' && p.category !== 'AI Life');
}

export function getQuickTakes(): Post[] {
  if (!fs.existsSync(quickTakesDirectory)) return [];
  const fileNames = fs.readdirSync(quickTakesDirectory);
  return fileNames
    .filter(name => name.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(quickTakesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const titleMatch = content.match(/^#{1,2}\s+(.+)$/m);
      const title = data.title || (titleMatch ? titleMatch[1] : slug.replace(/-/g, ' '));
      
      return {
        slug,
        title,
        date: data.date || '',
        excerpt: data.excerpt || data.description || '',
        content,
        category: data.category || 'Quick Take',
        coverImage: data.coverImage,
        author: data.author || 'C1',
        readTime: data.readTime || getReadTime(content),
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}