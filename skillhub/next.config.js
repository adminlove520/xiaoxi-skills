/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/api/**/*': ['../workspace/**/*', '../openclaw/**/*', '../agents/**/*'],
  },
};

module.exports = nextConfig;
