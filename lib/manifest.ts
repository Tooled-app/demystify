import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/long-form');
const quickTakesDirectory = path.join(process.cwd(), 'content/quick-takes');
const manifestPath = path.join(process.cwd(), 'data/content-manifest.json');

export async function updateContentManifest() {
  const allPosts: any[] = [];

  const processDirectory = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const fileNames = fs.readdirSync(dir).filter(name => name.endsWith('.md'));
    
    fileNames.forEach(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      allPosts.push({
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        date: data.date || '',
        category: data.category || 'AI',
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || undefined,
      });
    });
  };

  processDirectory(contentDirectory);
  processDirectory(quickTakesDirectory);

  // Sort by date descending
  allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));

  fs.writeFileSync(manifestPath, JSON.stringify(allPosts, null, 2));
  return allPosts;
}
