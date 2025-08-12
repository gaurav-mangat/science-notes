import { useState, useRef } from 'react';
import Link from 'next/link';

export default function UploadSimple() {
  const [form, setForm] = useState({ title: '', class: '', subject: '', chapterNumber: '', description: '', tags: '' });
  const [notesFile, setNotesFile] = useState(null);
  const [solutionsFile, setSolutionsFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const notesRef = useRef(null);
  const solutionsRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e, type) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      alert('Only PDF files allowed');
      return;
    }
    if (type === 'notes') setNotesFile(f);
    else setSolutionsFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.class || !form.subject) return alert('Please fill required fields');
    if (!notesFile && !solutionsFile) return alert('Upload at least one PDF');

    setIsUploading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (notesFile) fd.append('notes', notesFile);
      if (solutionsFile) fd.append('solutions', solutionsFile);

      const resp = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Upload failed');
      alert('Uploaded successfully');
      setForm({ title: '', class: '', subject: '', chapterNumber: '', description: '', tags: '' });
      setNotesFile(null); setSolutionsFile(null);
      if (notesRef.current) notesRef.current.value = '';
      if (solutionsRef.current) solutionsRef.current.value = '';
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Upload Chapter</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input name="title" value={form.title} onChange={onChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chapter number</label>
              <input name="chapterNumber" value={form.chapterNumber} onChange={onChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <select name="class" value={form.class} onChange={onChange} className="w-full border rounded px-3 py-2" required>
                <option value="">Select</option>
                {[6,7,8].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <select name="subject" value={form.subject} onChange={onChange} className="w-full border rounded px-3 py-2" required>
                {['', 'Science', 'Mathematics', 'Social Studies', 'English', 'Hindi'].map(s => <option key={s} value={s}>{s || 'Select'}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={onChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Notes (PDF)</label>
              <div onClick={() => notesRef.current?.click()} className="border-2 border-dashed rounded p-4 text-sm text-gray-600 cursor-pointer hover:border-blue-400">
                {notesFile ? notesFile.name : 'Click to select PDF'}
              </div>
              <input ref={notesRef} type="file" accept="application/pdf" onChange={(e) => onFile(e, 'notes')} className="hidden" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Solutions (PDF)</label>
              <div onClick={() => solutionsRef.current?.click()} className="border-2 border-dashed rounded p-4 text-sm text-gray-600 cursor-pointer hover:border-blue-400">
                {solutionsFile ? solutionsFile.name : 'Click to select PDF'}
              </div>
              <input ref={solutionsRef} type="file" accept="application/pdf" onChange={(e) => onFile(e, 'solutions')} className="hidden" />
            </div>
          </div>
          <div className="pt-2">
            <button disabled={isUploading} className={`w-full rounded-md py-3 text-white ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isUploading ? 'Uploading…' : 'Upload Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
