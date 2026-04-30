/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许 Next.js 访问项目根目录下的技能文件
  serverExternalPackages: [],
  outputFileTracingIncludes: {
    '/api/**/*': ['../workspace/**/*', '../openclaw/**/*', '../agents/**/*'],
  },
};

module.exports = nextConfig;
