/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for production build to increase stability
  /* experimental: {
    turbo: {
      // ...
    }
  }, */
  outputFileTracingIncludes: {
    '/api/skills': [
      '../workspace/**/*',
      '../openclaw/**/*',
      '../agents/**/*'
    ]
  }
};

module.exports = nextConfig;
