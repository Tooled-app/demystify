import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), 'data/content-manifest.json');
    if (!fs.existsSync(manifestPath)) {
      return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
    }
    const data = fs.readFileSync(manifestPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
