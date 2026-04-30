// GitHub OAuth Login API
// 触发 GitHub OAuth 登录流程

export async function GET(request) {
  // 从 Vercel 环境变量 或 本地 fallback 获取配置
  let GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  let REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
  
  // Fallback: 如果是空值或 placeholder，用本地测试值
  if (!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID === 'GitHub OAuth App client ID' || GITHUB_CLIENT_ID === 'PLACEHOLDER_fill_me') {
    GITHUB_CLIENT_ID = 'Ov231i1LWbTWxKhRMR38';
  }
  if (!REDIRECT_URI || REDIRECT_URI === 'OAuth callback URL' || REDIRECT_URI.includes('PLACEHOLDER')) {
    REDIRECT_URI = 'https://skillhub-eight.vercel.app/api/auth/callback';
  }

  // 生成随机 state 用于 CSRF 防护
  const state = Math.random().toString(36).substring(7);
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'repo:status read:user');
  authUrl.searchParams.set('state', state);

  return Response.json({
    success: true,
    authUrl: authUrl.toString(),
    state
  });
}