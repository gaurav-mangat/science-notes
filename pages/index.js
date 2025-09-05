import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { chapters as staticChapters } from '../data/chapters';

// Ad Component for monetization
const AdBanner = ({ position, className = "" }) => (
  <div className={`bg-gradient-to-r from-amber-300 to-orange-400 rounded-lg p-4 ${className}`}>
    {/* Ad content removed - keeping structure for future ad integration */}
  </div>
);

export default function Home() {
  const router = useRouter();

  const [activeView, setActiveView] = useState('class-select');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState({});
  const [loading, setLoading] = useState(true);

  // Sync state with URL query on mount and on router change
  useEffect(() => {
    const { view, class: cls, subject } = router.query;

    if (view) {
      setActiveView(view);
    } else {
      setActiveView('class-select');
    }

    if (cls) {
      const clsNum = Array.isArray(cls) ? parseInt(cls[0], 10) : parseInt(cls, 10);
      setSelectedClass(clsNum);
    } else {
      setSelectedClass(null);
    }

    if (subject) {
      const subjectStr = Array.isArray(subject) ? subject[0] : subject;
      setSelectedSubject(subjectStr);
    } else {
      setSelectedSubject(null);
    }
  }, [router.query]);

  // Handle back navigation - close app when on homepage
  useEffect(() => {
    const handlePopState = (event) => {
      if (activeView === 'class-select') {
        // Prevent default back navigation and close the app/website
        event.preventDefault();
        // For mobile browsers and PWAs, this will close the app
        window.close();
        // Fallback: navigate to about:blank to effectively "close" the page
        if (!window.closed) {
          window.location.href = 'about:blank';
        }
        return false;
      }
    };

    // Add popstate listener
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeView]);

  // Load chapters from static data
  useEffect(() => {
    setChapters(staticChapters || {});
    setLoading(false);
  }, []);

  // Get unique classes and subjects
  const classes = [6, 7, 8];
  const subjects = ['Science', 'Mathematics'].filter(subject =>
    Object.values(chapters).some(chap => chap.class === selectedClass && chap.subject === subject)
  );

  // Filter chapters
  const filteredChapters = Object.entries(chapters).filter(([_, chap]) => 
    chap.class === selectedClass && 
    chap.subject === selectedSubject
  );

  // Class selection handler
  const handleClassSelect = (cls) => {
    router.push({
      pathname: '/',
      query: { view: 'subject-select', class: cls }
    }, undefined, { shallow: true });
  };

  // Navigation handlers
  const handleSubjectSelect = (subject) => {
    router.push({
      pathname: '/',
      query: { view: 'chapter-list', class: selectedClass, subject }
    }, undefined, { shallow: true });
  };

  const resetNavigation = () => {
    router.push({
      pathname: '/',
      query: { view: 'class-select' }
    }, undefined, { shallow: true });
  };

  // Back navigation from navbar
  const handleTopNavBack = () => {
    if (activeView === 'chapter-list') {
      router.push({
        pathname: '/',
        query: { view: 'subject-select', class: selectedClass }
      }, undefined, { shallow: true });
    } else if (activeView === 'subject-select') {
      router.push({
        pathname: '/',
        query: { view: 'class-select' }
      }, undefined, { shallow: true });
    }
  };

  return (
    <>
      <Head>
        <title>myCBSEnotes - Interactive Learning Platform</title>
        <meta name="description" content="Access comprehensive study materials for classes 6-12" />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossOrigin="anonymous"></script>
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push({ pathname: '/', query: { view: 'class-select' } }, undefined, { shallow: true })}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xl font-bold">myCBSEnotes</span>
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="hover:text-emerald-100 transition">Home</a>
              <a href="/about" className="hover:text-emerald-100 transition">About</a>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-button"
                aria-label="Toggle menu"
                className="focus:outline-none"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                  } else {
                    menu.style.display = 'block';
                  }
                }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Keep header clean for students; no extra buttons */}
            {/* Mobile menu */}
            <div id="mobile-menu" className="hidden md:hidden absolute top-16 right-4 bg-emerald-700 rounded-md shadow-lg z-50">
              <a href="/" className="block px-4 py-2 text-white hover:bg-emerald-600">Home</a>
              <a href="/about" className="block px-4 py-2 text-white hover:bg-emerald-600">About</a>
            </div>
          </div>
        </div>
        
      </nav>

      {/* Top Ad Banner - Commented out */}
      {/*
      <div className="bg-teal-50 dark:bg-gray-900 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner position="top" className="text-sm" />
        </div>
      </div>
      */}

      {/* Hero Section */}
      {activeView === 'class-select' && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[1.5cm]">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ace Your CBSE <span className="text-emerald-600">Exams</span> with Confidence
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover detailed notes, step-by-step solutions, and comprehensive study materials for CBSE Science and Mathematics across Classes 6-12.
            </p>
            {/* Clean hero without search; student-focused */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        {activeView !== 'class-select' && (
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button onClick={() => router.push({ pathname: '/', query: { view: 'class-select' } }, undefined, { shallow: true })} className="text-emerald-600 hover:text-emerald-800">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </button>
              </li>
              {selectedClass && (
                <li>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <button
                      onClick={() => router.push({ pathname: '/', query: { view: 'subject-select', class: selectedClass } }, undefined, { shallow: true })}
                      className="ml-2 text-sm font-medium text-emerald-600 hover:text-emerald-800"
                    >
                      Class {selectedClass}
                    </button>
                  </div>
                </li>
              )}
              {selectedSubject && (
                <li>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-300">{selectedSubject}</span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        )}

        {/* Class Selection View */}
        {activeView === 'class-select' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">Loading chapters...</p>
                </div>
              ) : (
                <>
                  <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Select Your Class</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {classes.map(cls => (
                      <div
                        key={cls}
                        onClick={() => handleClassSelect(cls)}
                        className="border-t-2 border-emerald-500 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <div className="p-6 text-center">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 mb-4">
                            <span className="text-xl font-bold">{cls}</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Class {cls}</h3>
                          <p className="text-gray-500 dark:text-gray-300">
                            {Object.values(chapters).filter(c => c.class === cls).length} subjects available
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  </section>

                  {/* Mid-content Ad */}
                  <div className="mb-16">
                    <AdBanner position="mid-content" />
                  </div>

                  {/* Featured Content */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Featured Study Materials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">CBSE Science Notes</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Comprehensive notes for Classes 6-8</p>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Get detailed notes covering all important topics with examples and diagrams.</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Step-by-Step Solutions</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Detailed solutions for all problems</p>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Understand concepts better with our comprehensive step-by-step solutions.</p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Sidebar with Ads */}
            <div className="lg:col-span-1 space-y-6">
              {/* Sidebar Ad 1 */}
              <AdBanner position="sidebar-top" />
              
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Platform Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Chapters</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{Object.keys(chapters).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Active Classes</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{classes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subjects</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{[...new Set(Object.values(chapters).map(c => c.subject))].length}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Ad 2 */}
              <AdBanner position="sidebar-bottom" />
            </div>
          </div>
        )}

        {/* Subject Selection View */}
        {activeView === 'subject-select' && (
          <section>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subjects for Class {selectedClass}</h2>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <div
              key={subject}
              onClick={() => handleSubjectSelect(subject)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900 rounded-md p-3">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{subject}</h3>
                    <p className="text-gray-500 dark:text-gray-300">
                      {Object.values(chapters).filter(c => c.class === selectedClass && c.subject === subject).length} chapters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
          </section>
        )}

        {/* Chapter List View */}
        {activeView === 'chapter-list' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <section>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Class {selectedClass} - {selectedSubject}</h2>
                  <p className="text-gray-600 dark:text-gray-300">Browse through all available chapters</p>
                </div>

{loading ? (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading chapters...</p>
  </div>
) : filteredChapters.length > 0 ? (
  
  //I removed these classes from the below div :  <div className="shadow overflow-hidden sm:rounded-lg">
  <div>
    <ul className="divide-y divide-gray-300 dark:divide-gray-600">
      {filteredChapters.map(([id, chapter]) => (
        <li key={id}>
      <div className="px-4 py-5 sm:px-6 bg-gray-100 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-700 dark:border-gray-700 rounded-md mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center">
          <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">{chapter.chapterNumber || id}</span>
        </div>
<div className="ml-4">
  <h3 className="text-gray-600 dark:text-gray-300 text-lg font-medium">{chapter.title}</h3>
</div>
      </div>
      <div className="flex space-x-3">
        {chapter.notesUrl && (
          <a
            href={chapter.notesUrl}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            View Notes
          </a>
        )}
        {chapter.solutionsUrl && (
          <a
            href={`/chapters/${id}/solutions`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            View Solutions
          </a>
        )}
        {!chapter.notesUrl && !chapter.solutionsUrl && (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No files uploaded</span>
        )}
      </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
) : (
  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No chapters found</h3>
    <p className="mt-1 text-gray-500 dark:text-gray-300">No chapters match this class and subject yet.</p>
  </div>
          )}
              </section>
            </div>

            {/* Sidebar with Ads */}
            <div className="lg:col-span-1 space-y-6">
              {/* Sidebar Ad */}
              <AdBanner position="sidebar" />

              {/* Chapter Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Chapter Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Chapters</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredChapters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Class</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Subject</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedSubject}</span>
                  </div>
                </div>
              </div>

              {/* Another Sidebar Ad */}
              <AdBanner position="sidebar-bottom" />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Ad Banner - Commented out */}
      {/*
      <div className="bg-teal-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner position="bottom" />
        </div>
      </div>
      */}

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">myCBSEnotes</h3>
              <p className="text-emerald-100/80">Empowering students with quality education resources since 2023.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-emerald-100/80 hover:text-white">Notes</a></li>
                <li><a href="#" className="text-emerald-100/80 hover:text-white">Solutions</a></li>
                <li><a href="#" className="text-emerald-100/80 hover:text-white">Practice Tests</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-emerald-100/80 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-emerald-100/80 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-emerald-100/80 hover:text-white">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-100/80 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-emerald-100/80 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
              <div className="mt-4">
                <p className="text-emerald-100/80">Subscribe to our newsletter</p>
                <div className="mt-2 flex">
                  <input type="email" placeholder="Your email" className="px-3 py-2 text-gray-900 rounded-l-md w-full" />
                  <button className="bg-emerald-600 px-4 py-2 rounded-r-md">Join</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
            &copy; 2023 myCBSEnotes. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}