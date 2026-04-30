// GitHub OAuth Login API
// 触发 GitHub OAuth 登录流程

export async function GET(request) {
  // 从 Vercel 环境变量 或 本地 fallback 获取配置
  // 只从环境变量读取配置
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
  
  // 如果环境变量未配置，返回错误
  if (!GITHUB_CLIENT_ID || !REDIRECT_URI) {
    return Response.json({ success: false, error: 'OAuth not configured' }, { status: 500 });
  }

  // 生成随机 state 用于 CSRF 防护
  const state = Math.random().toString(36).substring(7);
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'repo:status read:user');
  authUrl.searchParams.set('state', state);

  // 将 state 存入 cookie 以便回调时验证
  const cookieHeader = `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;

  const headers = new Headers();
  headers.append('Set-Cookie', cookieHeader);

  return new Response(JSON.stringify({
    success: true,
    authUrl: authUrl.toString(),
    state
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader
    }
  });
}