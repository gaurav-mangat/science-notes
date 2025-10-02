/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.mycbsenotes.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    const result = [];
    const chapters = [
      { notes: '/Curiosity-8/Chapter-1/Notes.html' },
      { notes: '/Curiosity-8/Chapter-2/Notes.html', exercise: '/Curiosity-8/Chapter-2/Exercise.html' },
      { notes: '/Curiosity-8/Chapter-3/Notes.html', exercise: '/Curiosity-8/Chapter-3/Exercise.html' },
      { notes: '/Curiosity-8/Chapter-4/Notes.html', exercise: '/Curiosity-8/Chapter-4/Exercise.html' },
      { notes: '/Curiosity-8/Chapter-5/Notes.html', exercise: '/Curiosity-8/Chapter-5/Exercise.html' },
      { notes: '/Curiosity-8/Chapter-6/Notes.html', exercise: '/Curiosity-8/Chapter-6/Exercise.html' },
    ];

    chapters.forEach(chapter => {
      result.push({
        loc: chapter.notes,
        changefreq: 'monthly',
        priority: 0.8,
      });
      if (chapter.exercise) {
        result.push({
          loc: chapter.exercise,
          changefreq: 'monthly',
          priority: 0.7,
        });
      }
    });

    return result;
  },
};
