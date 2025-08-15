import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';

function UploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    chapterNumber: '',
    description: '',
    tags: ''
  });
  const [notesFile, setNotesFile] = useState(null);
  const [solutionsFile, setSolutionsFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [firebaseStatus, setFirebaseStatus] = useState('Checking...');
  
  const notesInputRef = useRef(null);
  const solutionsInputRef = useRef(null);

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      // Test Firestore connection
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, { timestamp: new Date(), status: 'connected' });
      setFirebaseStatus('✅ Connected to Firebase');
      
      // Clean up test document
      setTimeout(() => {
        setDoc(testDoc, { timestamp: new Date(), status: 'cleaned' });
      }, 1000);
    } catch (error) {
      console.error('Firebase connection error:', error);
      setFirebaseStatus(`❌ Firebase Error: ${error.message}`);
    }
  };

  // Test connection on component mount
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // CBSE Classes and Subjects
  const classes = [6, 7, 8];
  const subjects = ['Science', 'Mathematics', 'Social Studies', 'English', 'Hindi'];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    
    if (fileType === 'notes') {
      setNotesFile(selectedFile);
    } else {
      setSolutionsFile(selectedFile);
    }
  };

  const removeFile = (fileType) => {
    if (fileType === 'notes') {
      setNotesFile(null);
      if (notesInputRef.current) notesInputRef.current.value = '';
    } else {
      setSolutionsFile(null);
      if (solutionsInputRef.current) solutionsInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.class || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!notesFile && !solutionsFile) {
      toast.error('Please upload at least one file (notes or solutions)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let notesUrl = '';
      let solutionsUrl = '';
      
      // Upload notes file if provided
      if (notesFile) {
        setUploadProgress(20);
        const notesRef = ref(storage, `notes/class${formData.class}/${formData.subject.toLowerCase()}/${formData.chapterNumber.toLowerCase().replace(/\s+/g, '-')}-notes.pdf`);
        const notesSnapshot = await uploadBytes(notesRef, notesFile);
        notesUrl = await getDownloadURL(notesSnapshot.ref);
        setUploadProgress(50);
      }
      
      // Upload solutions file if provided
      if (solutionsFile) {
        setUploadProgress(70);
        const solutionsRef = ref(storage, `notes/class${formData.class}/${formData.subject.toLowerCase()}/${formData.chapterNumber.toLowerCase().replace(/\s+/g, '-')}-solutions.pdf`);
        const solutionsSnapshot = await uploadBytes(solutionsRef, solutionsFile);
        solutionsUrl = await getDownloadURL(solutionsSnapshot.ref);
        setUploadProgress(90);
      }
      
      // Create chapter data
      const chapterData = {
        title: formData.title,
        class: parseInt(formData.class),
        subject: formData.subject,
        chapterNumber: formData.chapterNumber,
        description: formData.description,
        tags: formData.tags,
        notesUrl: notesUrl || null,
        solutionsUrl: solutionsUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Generate unique ID for the chapter
      const chapterId = `${formData.class}${formData.subject.toLowerCase().substring(0, 3)}${formData.chapterNumber.match(/\d+/)?.[0] || '1'}`;
      
      // Save to Firestore
      await setDoc(doc(db, 'chapters', chapterId), chapterData);
      
      setUploadProgress(100);
      
      toast.success(
        <div>
          <p className="font-bold">Chapter uploaded successfully!</p>
          <p>{formData.title} - Class {formData.class} {formData.subject}</p>
          <p className="text-sm opacity-75 mt-1">Files stored in Firebase Storage</p>
        </div>
      );

      // Reset form
      setFormData({
        title: '',
        class: '',
        subject: '',
        chapterNumber: '',
        description: '',
        tags: ''
      });
      setNotesFile(null);
      setSolutionsFile(null);
      if (notesInputRef.current) notesInputRef.current.value = '';
      if (solutionsInputRef.current) solutionsInputRef.current.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">EduSphere Admin</h1>
              <nav className="flex space-x-4">
                <Link href="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link href="/admin/upload-simple" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  Upload Content
                </Link>
                <Link href="/admin/upload" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
                  Advanced Upload
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <Link href="/api/auth/logout" className="text-sm text-red-600 hover:text-red-900">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">CBSE Content Manager</h1>
                <p className="opacity-90 mt-2">Upload and manage study materials for Classes 6-8</p>
              </div>
              <Link 
                href="/admin/dashboard"
                className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Firebase Status */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Firebase Connection Status</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm ${firebaseStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {firebaseStatus}
              </span>
            </div>
            {firebaseStatus.includes('❌') && (
              <div className="mt-2 text-xs text-red-600">
                Please check your Firebase configuration and make sure Firestore and Storage are enabled.
              </div>
            )}
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upload New Chapter</h2>
            <p className="text-gray-600 mt-1">Add comprehensive study materials for students</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E.g., 'Chemical Reactions and Equations'"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Number
                </label>
                <input
                  type="text"
                  name="chapterNumber"
                  value={formData.chapterNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E.g., 'Chapter 1' or '1'"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the chapter content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E.g., chemistry, reactions, equations, cbse"
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notes Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Notes (PDF)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => notesInputRef.current?.click()}
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {notesFile ? notesFile.name : 'Click to select PDF'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Notes and study material</p>
                  </div>
                  <input
                    type="file"
                    ref={notesInputRef}
                    onChange={(e) => handleFileChange(e, 'notes')}
                    accept=".pdf"
                    className="hidden"
                  />
                </div>
                {notesFile && (
                  <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-sm text-blue-700">{notesFile.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('notes')}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Solutions Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Solutions (PDF)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => solutionsInputRef.current?.click()}
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {solutionsFile ? solutionsFile.name : 'Click to select PDF'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Solutions and answers</p>
                  </div>
                  <input
                    type="file"
                    ref={solutionsInputRef}
                    onChange={(e) => handleFileChange(e, 'solutions')}
                    accept=".pdf"
                    className="hidden"
                  />
                </div>
                {solutionsFile && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-sm text-green-700">{solutionsFile.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('solutions')}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Uploading...</span>
                  <span className="text-sm text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white text-lg ${
                  isUploading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                } transition-all duration-200`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading Chapter...
                  </span>
                ) : (
                  'Upload Chapter'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Chapters</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Classes</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Subjects</p>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UploadPage;