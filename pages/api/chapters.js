import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    const { chapters: staticChapters } = await import('../../data/chapters');
    const jsonPath = join(process.cwd(), 'data', 'chapters.json');
    let dynamic = {};
    if (existsSync(jsonPath)) {
      try {
        dynamic = JSON.parse(readFileSync(jsonPath, 'utf8')) || {};
      } catch {
        dynamic = {};
      }
    }
    const merged = { ...staticChapters, ...dynamic };
    res.status(200).json(merged);
  } catch (e) {
    console.error('chapters api error', e);
    res.status(500).json({ error: 'Failed to load chapters' });
  }
}
