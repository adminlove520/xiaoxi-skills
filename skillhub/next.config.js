/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许 Next.js 访问项目根目录下的技能文件
  serverExternalPackages: [],
  experimental: {
    // 确保在 Vercel 等环境部署时能包含这些外部目录
    outputFileTracingIncludes: {
      '/api/**/*': ['../workspace/**/*', '../openclaw/**/*', '../agents/**/*'],
    },
  },
};

module.exports = nextConfig;
