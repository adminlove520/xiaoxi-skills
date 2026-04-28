// GitHub OAuth Login API
// 触发 GitHub OAuth 登录流程

export async function GET(request) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  
  if (!GITHUB_CLIENT_ID) {
    return Response.json({ 
      success: false, 
      error: 'GitHub OAuth 未配置 (GITHUB_CLIENT_ID missing)' 
    }, { status: 500 });
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
