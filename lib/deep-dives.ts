import fs from 'fs/promises';
import path from 'path';
import { DeepDive } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'content/deep-dives');
const MANIFEST_PATH = path.join(process.cwd(), 'data/deep-dives-manifest.json');

export async function getDeepDives(): Promise<DeepDive[]> {
  const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf8');
  return JSON.parse(manifestContent);
}

export async function getDeepDiveBySlug(slug: string): Promise<DeepDive | null> {
  const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf8');
  const manifest: DeepDive[] = JSON.parse(manifestContent);
  return manifest.find(d => d.slug === slug) || null;
}

export async function getDeepDiveContent(slug: string): Promise<string> {
  const filePath = path.join(DATA_DIR, `${slug}.md`);
  return fs.readFile(filePath, 'utf8');
}
