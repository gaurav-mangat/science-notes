import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'myCBSEnotes - Interactive Learning Platform' }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
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
              <Link href="/" className="hover:text-emerald-100 transition">Home</Link>
              <Link href="/about" className="hover:text-emerald-100 transition">About</Link>
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

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">myCBSEnotes</h3>
              <p className="text-emerald-100/80">Empowering students with quality education resources since 2023.</p>
              <p className="text-emerald-100/80 text-sm mt-2">Simple notes, clear solutions, and comprehensive study materials for CBSE students.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-emerald-100/80 hover:text-white">About Us</Link></li>
                <li><a href="https://cbse.nic.in" target="_blank" rel="noopener noreferrer" className="text-emerald-100/80 hover:text-white">Official CBSE Website</a></li>
                <li><a href="https://ncert.nic.in/textbook.php?hecu1=0-12" target="_blank" rel="noopener noreferrer" className="text-emerald-100/80 hover:text-white">NCERT Textbooks (Classes 1-12)</a></li>
                <li><a href="https://www.ncert.nic.in" target="_blank" rel="noopener noreferrer" className="text-emerald-100/80 hover:text-white">NCERT Official Website</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
            &copy; 2025 myCBSEnotes. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
