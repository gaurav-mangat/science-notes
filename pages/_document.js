import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Title + Description (default for whole site, can override in pages) */}
        <title>myCBSEnotes - Free CBSE Notes & NCERT Solutions</title>
        <meta
          name="description"
          content="myCBSEnotes provides CBSE Class 6–8 Notes, NCERT Solutions, and Study Materials with simple explanations to help students."
        />

        {/* Preferred Site Name */}
        <meta property="og:site_name" content="myCBSEnotes" />
        <meta
          property="og:title"
          content="myCBSEnotes - Free CBSE Notes & NCERT Solutions"
        />
        <meta
          property="og:description"
          content="Easy-to-understand CBSE Notes, NCERT Solutions, and study resources for Classes 6–8."
        />

        {/* Logo / Image for Google & Social Sharing */}
        <meta
          property="og:image"
          content="https://www.mycbsenotes.com/logo.png"
        />
        <meta
          name="twitter:image"
          content="https://www.mycbsenotes.com/logo.png"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />

        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "myCBSEnotes",
              url: "https://www.mycbsenotes.com/",
            }),
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
