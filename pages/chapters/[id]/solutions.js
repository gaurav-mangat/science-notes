import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChapterSolutions() {
  const router = useRouter();
  const { id } = router.query;
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const resp = await fetch('/api/chapters');
        if (!resp.ok) throw new Error('Failed to load chapters');
        const chapters = await resp.json();
        if (chapters[id]) {
          setChapter({ id, ...chapters[id] });
        } else {
          setError('Chapter not found');
        }
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chapter Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested chapter could not be found.'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!chapter.solutionsUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Solutions Not Available</h1>
          <p className="text-gray-600 mb-6">Solutions for this chapter have not been uploaded yet.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back
          </button>
          <h1 className="text-2xl font-bold mb-2">{chapter.title} - Solutions</h1>
          <p className="text-gray-600 mb-2">Class {chapter.class} • {chapter.subject}</p>
          {chapter.description && (
            <p className="text-gray-700 text-sm">{chapter.description}</p>
          )}
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <iframe 
            src={chapter.solutionsUrl} 
            className="w-full h-[600px]"
            frameBorder="0"
            title={`${chapter.title} Solutions`}
          >
            <p>Your browser doesn't support PDFs. <a href={chapter.solutionsUrl} target="_blank" rel="noopener noreferrer">Download the solutions</a></p>
          </iframe>
        </div>
      </div>
    </div>
  );
}