import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About - myCBSEnotes</title>
        <meta
          name="description"
          content="Learn about myCBSEnotes - simple notes, clear solutions, and study help for CBSE students."
        />
      </Head>

      <nav className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="text-xl font-bold">myCBSEnotes</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-emerald-100 transition">
                Home
              </Link>
              <Link href="/about" className="hover:text-emerald-100 transition">
                About
              </Link>
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
            {/* Mobile menu */}
            <div id="mobile-menu" className="hidden md:hidden absolute top-16 right-4 bg-emerald-700 rounded-md shadow-lg z-50">
              <Link href="/" className="block px-4 py-2 text-white hover:bg-emerald-600">Home</Link>
              <Link href="/about" className="block px-4 py-2 text-white hover:bg-emerald-600">About</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About <span className="text-emerald-600">myCBSEnotes</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your trusted companion for simple notes, clear solutions, and exam-ready study material.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 ml-3">
                Our Mission
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
We want to make learning simple, clear, and stress-free for every student. Our goal is to provide easy-to-understand notes, step-by-step NCERT solutions, and helpful study resources that make even tough chapters easier to learn. We follow the latest CBSE books, including the new Science Curiosity series, so that students always get updated and relevant material.             </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 ml-3">
                What We Offer
              </h3>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
    <li>• Notes for every chapter in simple language</li>
    <li>• Step-by-step NCERT Solutions</li>
    <li>• Quick revision materials</li>
    <li>• CBSE-aligned study content</li>
    <li>• Latest content as per new books — <strong>Science Curiosity</strong> and updated material for other subjects too</li>
  </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Instead of searching everywhere, you can find all notes and solutions in one place. Our resources are student-friendly, exam-focused, and always updated.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Get Started
          </Link>
        </div>
      </main>

      <footer className="bg-emerald-900 text-white py-8 md:py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">myCBSEnotes</h3>
              <p className="text-emerald-100/80 text-sm md:text-base">Empowering students with quality education resources since 2023.</p>
              <p className="text-emerald-100/80 text-sm mt-2">Simple notes, clear solutions, and comprehensive study materials for CBSE students.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-emerald-100/80 hover:text-white text-sm md:text-base transition">Home</Link></li>
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
