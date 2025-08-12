import formidable from 'formidable';
import { writeFile, mkdir } from 'fs/promises';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => Boolean(mimetype && mimetype.includes('pdf')),
      multiples: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => {
        if (err) return reject(err);
        resolve([flds, fls]);
      });
    });

    const title = fields.title?.[0] || fields.title;
    const classNum = fields.class?.[0] || fields.class;
    const subject = fields.subject?.[0] || fields.subject;
    const chapterNumber = fields.chapterNumber?.[0] || fields.chapterNumber || '';
    const description = fields.description?.[0] || fields.description || '';
    const tags = fields.tags?.[0] || fields.tags || '';

    const notesFile = Array.isArray(files.notes) ? files.notes[0] : files.notes;
    const solutionsFile = Array.isArray(files.solutions) ? files.solutions[0] : files.solutions;

    if (!title || !classNum || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!notesFile && !solutionsFile) {
      return res.status(400).json({ error: 'At least one file is required' });
    }

    const safeChapterSlug = (chapterNumber || 'chapter').toString().toLowerCase().replace(/\s+/g, '-');
    const safeSubject = subject.toString().toLowerCase();

    const baseDir = join(process.cwd(), 'public', 'notes');
    const classDir = join(baseDir, `class${classNum}`);
    const subjectDir = join(classDir, safeSubject);
    await mkdir(subjectDir, { recursive: true });

    let notesUrl = '';
    let solutionsUrl = '';

    if (notesFile) {
      const dest = join(subjectDir, `${safeChapterSlug}-notes.pdf`);
      const buf = readFileSync(notesFile.filepath);
      await writeFile(dest, buf);
      notesUrl = `/notes/class${classNum}/${safeSubject}/${safeChapterSlug}-notes.pdf`;
    }

    if (solutionsFile) {
      const dest = join(subjectDir, `${safeChapterSlug}-solutions.pdf`);
      const buf = readFileSync(solutionsFile.filepath);
      await writeFile(dest, buf);
      solutionsUrl = `/notes/class${classNum}/${safeSubject}/${safeChapterSlug}-solutions.pdf`;
    }

    const chapterId = `${classNum}${safeSubject.charAt(0)}${(chapterNumber || '1').toString().replace(/\D/g, '') || '1'}`;

    const chapterData = {
      id: chapterId,
      title: String(title),
      class: parseInt(classNum, 10),
      subject: String(subject),
      chapterNumber: String(chapterNumber || ''),
      description: String(description || ''),
      tags: tags,
      notesUrl,
      solutionsUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const chaptersPath = join(process.cwd(), 'data', 'chapters.json');
    let chapters = {};
    if (existsSync(chaptersPath)) {
      try {
        chapters = JSON.parse(readFileSync(chaptersPath, 'utf8')) || {};
      } catch {
        chapters = {};
      }
    }
    chapters[chapterId] = chapterData;
    writeFileSync(chaptersPath, JSON.stringify(chapters, null, 2));

    return res.status(200).json({ success: true, chapter: chapterData });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
} 
