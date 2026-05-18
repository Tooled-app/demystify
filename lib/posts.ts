import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/long-form');
const quickTakesDirectory = path.join(process.cwd(), 'content/quick-takes');
const aiHumourDirectory = path.join(process.cwd(), 'content/ai-humour');
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
    // Check long-form first, then quick-takes, then ai-humour
    const longPath = path.join(contentDirectory, `${meta.slug}.md`);
    const quickPath = path.join(quickTakesDirectory, `${meta.slug}.md`);
    const humourPath = path.join(aiHumourDirectory, `${meta.slug}.md`);
    let finalPath = longPath;
    if (!fs.existsSync(finalPath)) finalPath = quickPath;
    if (!fs.existsSync(finalPath)) finalPath = humourPath;

    if (!fs.existsSync(finalPath)) return null; // Avoid ENOENT crash
    const fileContents = fs.readFileSync(finalPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Maintain existing category/series logic
    let category = data.category || meta.category || 'AI';
    let day: number | undefined;
    let series: string | undefined;

    const confessionalMatch = meta.slug.match(/^(?:c3-)?day-(\d+)/);
    if (confessionalMatch) {
      day = parseInt(confessionalMatch[1]);
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
  return posts.filter(p => p && p.series !== 'Confessions of an AI Agent' && p.category !== 'AI Life');
}

export async function getQuickTakes(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts
    .filter(p => p && (p.category === 'Quick Take' || p.slug.includes('quick-take')))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAIHumour(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts
    .filter(p => p.category === 'AI Humour')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Confessional colour system: each month gets a distinct hue,
 * days within a month gradient from light (early) to dark (late).
 */
export function getConfessionalColour(dateString: string): { bg: string; text: string } {
  const date = new Date(dateString);
  const month = date.getMonth(); // 0-11
  const day = date.getDate();    // 1-31
  const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();

  // Month hue mapping — smooth 30° cycle for harmonious transitions
  // Spring: cool blue → teal → green
  // Summer: warm sage → golden
  // Autumn: amber → coral
  // Winter: rose → plum → lavender
  const monthHues: Record<number, number> = {
    0:  300, // January:   soft plum
    1:  270, // February:  lavender
    2:  240, // March:     periwinkle
    3:  210, // April:     powder blue
    4:  180, // May:       seafoam / soft teal
    5:  150, // June:      mint / aqua
    6:  120, // July:      soft green
    7:  90,  // August:    warm sage / yellow-green
    8:  60,  // September: golden olive
    9:  30,  // October:   warm amber
    10: 0,   // November:  soft coral
    11: 330, // December:  rose / mauve
  };

  const hue = monthHues[month] ?? 200;
  // Lightness: early month = 20%, late month = 10% (all dark for readability)
  const startL = 20;
  const endL = 10;
  const lightness = startL - ((day - 1) / (daysInMonth - 1 || 1)) * (startL - endL);

  const bg = `hsl(${hue}, 45%, ${lightness}%)`;
  const text = '#faf8f5'; // Always light text on dark cards

  return { bg, text };
}

export async function getAdjacentPosts(slug: string): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getAllPosts();
  const current = posts.find(p => p.slug === slug);
  if (!current) return { prev: null, next: null };

  // For confessionals, sort by day number
  if (current.series === 'Confessions of an AI Agent' && current.day !== undefined) {
    const confessionals = posts
      .filter(p => p.series === 'Confessions of an AI Agent' && p.day !== undefined)
      .sort((a, b) => (a.day || 0) - (b.day || 0));
    const idx = confessionals.findIndex(p => p.slug === slug);
    return {
      prev: idx > 0 ? confessionals[idx - 1] : null,
      next: idx < confessionals.length - 1 ? confessionals[idx + 1] : null,
    };
  }

  // For everything else, sort by date
  const sorted = posts
    .filter(p => p.slug !== slug)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const idx = sorted.findIndex(p => new Date(p.date).getTime() >= new Date(current.date).getTime());
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx >= 0 && idx < sorted.length ? sorted[idx] : null,
  };
}

// Legacy fallback for when manifest is missing
function fallbackGetAllPosts(): Post[] {
  const dirs = [contentDirectory, quickTakesDirectory, aiHumourDirectory];
  const fileNames: string[] = [];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(name => name.endsWith('.md'));
      for (const f of files) {
        fileNames.push(path.join(dir, f));
      }
    }
  }
  return fileNames.map(fullPath => {
    const slug = path.basename(fullPath).replace(/\.md$/, '');
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
