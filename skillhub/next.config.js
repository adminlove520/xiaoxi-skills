/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/skills': [
      '../workspace/**/*',
      '../openclaw/**/*',
      '../agents/**/*'
    ]
  }
};

module.exports = nextConfig;
