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
  // NOTE: Coming Soon gate for Class 6 and 7
  // When Class 6/7 content is ready:
  // 1) Remove the "coming-soon" forcing below
  // 2) In handleClassSelect, route Class 6/7 to 'subject-select' like Class 8
  // 3) Delete the Coming Soon JSX section further down in this file
  useEffect(() => {
    const { view, class: cls, subject } = router.query;

    const nextView = view || 'class-select';
    let clsNum = null;
    if (cls) {
      clsNum = Array.isArray(cls) ? parseInt(cls[0], 10) : parseInt(cls, 10);
    }

    // Force coming-soon view for Class 6 and 7 even on deep links
    if (clsNum === 6 || clsNum === 7) {
      setActiveView('coming-soon');
    } else {
      setActiveView(nextView);
    }

    if (cls) {
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
  // NOTE: When 6/7 content is published, route them like Class 8 by
  // changing this function to always push 'subject-select'
  const handleClassSelect = (cls) => {
    if (cls === 6 || cls === 7) {
      router.push({
        pathname: '/',
        query: { view: 'coming-soon', class: cls }
      }, undefined, { shallow: true });
    } else {
      router.push({
        pathname: '/',
        query: { view: 'subject-select', class: cls }
      }, undefined, { shallow: true });
    }
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
    } else if (activeView === 'coming-soon') {
      router.push({
        pathname: '/',
        query: { view: 'class-select' }
      }, undefined, { shallow: true });
    }
  };

  return (
    <>
      <Head>
        <title>myCBSEnotes – CBSE Syllabus Notes, NCERT Solutions & Practice Material</title>
        <meta name="description" content="Access comprehensive study materials for classes 6-8" />
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
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover detailed notes, step-by-step solutions, and comprehensive study materials for CBSE Students across Classes 6-8.
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
                            {[...new Set(Object.values(chapters).filter(c => c.class === cls).map(c => c.subject))].length} subjects available
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

        {/* Coming Soon View for Class 6 and 7 */}
        {activeView === 'coming-soon' && (
          <section>
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-10">
                <svg className="mx-auto h-14 w-14 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Content coming soon</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">We're preparing Class {selectedClass} materials. Please check back shortly.</p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push({ pathname: '/', query: { view: 'class-select' } }, undefined, { shallow: true })}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Back to Class Selection
                  </button>
                </div>
              </div>
              {/**
               * TIP: When content for Class 6/7 is live:
               * - Remove the Coming Soon block above (this entire <section>)
               * - Update handleClassSelect to route to 'subject-select'
               * - Remove the force-gate in the useEffect at the top
               */}
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
            {/* Mobile-first responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-3">
              {/* Chapter info section */}
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm sm:text-lg">{chapter.chapterNumber || id}</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <h3 className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-bold sm:font-medium leading-tight break-words">{chapter.title}</h3>
                </div>
              </div>
              
              {/* Action buttons section - centered on mobile, right-aligned on desktop */}
              <div className="flex justify-center sm:justify-end gap-3">
                {chapter.notesUrl && (
                  <a
                    href={chapter.notesUrl}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex-shrink-0"
                  >
                    View Notes
                  </a>
                )}
                {chapter.solutionsUrl && (
                  <a
                    href={chapter.solutionsUrl}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex-shrink-0"
                  >
                    View Exercise
                  </a>
                )}
                {!chapter.notesUrl && !chapter.solutionsUrl && (
                  <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm flex-shrink-0">No files uploaded</span>
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
      <footer className="bg-emerald-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">myCBSEnotes</h3>
              <p className="text-emerald-100/80 text-sm md:text-base">Empowering students with quality education resources since 2025.</p>
              <p className="text-emerald-100/80 text-sm mt-2">Simple notes, clear solutions, and comprehensive study materials for CBSE students.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-emerald-100/80 hover:text-white text-sm md:text-base transition">About Us</Link></li>
                <li><a href="https://cbse.nic.in" target="_blank" rel="noopener noreferrer" className="text-emerald-100/80 hover:text-white text-sm md:text-base transition">Official CBSE Website</a></li>
                <li><a href="https://ncert.nic.in/textbook.php?hecu1=0-12" target="_blank" rel="noopener noreferrer" className="text-emerald-100/80 hover:text-white text-sm md:text-base transition">NCERT Textbooks (Classes 1-12)</a></li>
                <li><a href="https://www.ncert.nic.in" target="_blank" rel="noopener noreferrer" className="text-emerald-100/80 hover:text-white text-sm md:text-base transition">NCERT Official Website</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700 text-xs md:text-sm text-gray-400 text-center">
            &copy; 2025 myCBSEnotes. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}