const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseDir = '/Users/colinmaxwell/.openclaw/workspace/projects/demystify/site-rebuild';
const contentDirectory = path.join(baseDir, 'content/long-form');
const quickTakesDirectory = path.join(baseDir, 'content/quick-takes');
const manifestPath = path.join(baseDir, 'data/content-manifest.json');

const allPosts = [];

function processDirectory(dir) {
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
}

processDirectory(contentDirectory);
processDirectory(quickTakesDirectory);

allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));

fs.writeFileSync(manifestPath, JSON.stringify(allPosts, null, 2));
console.log('Manifest updated with', allPosts.length, 'posts');
