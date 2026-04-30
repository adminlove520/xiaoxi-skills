// GitHub OAuth Login API
// 触发 GitHub OAuth 登录流程

export async function GET(request) {
  // 彻底清理 Client ID 和 Redirect URI 中的不可见字符（如 UTF-8 BOM）
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID?.replace(/[^a-zA-Z0-9]/g, '');
  let REDIRECT_URI = process.env.GITHUB_REDIRECT_URI?.replace(/[\s\uFEFF\u200B-\u200D]/g, '');
  
  // 智能修正 Redirect URI
  if (REDIRECT_URI && !REDIRECT_URI.includes('/api/auth/callback')) {
    REDIRECT_URI = REDIRECT_URI.endsWith('/') 
      ? REDIRECT_URI + 'api/auth/callback' 
      : REDIRECT_URI + '/api/auth/callback';
  }
  
  // 如果环境变量未配置，返回错误
  if (!GITHUB_CLIENT_ID || !REDIRECT_URI) {
    return Response.json({ success: false, error: 'OAuth not configured' }, { status: 500 });
  }

  // 生成随机 state 用于 CSRF 防护，并可选带上 return_to
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') || '/';
  const state = Math.random().toString(36).substring(7) + '|' + Buffer.from(next).toString('base64');
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', 'repo:status read:user');
  authUrl.searchParams.set('state', state);

  // 将 state 存入 cookie 以便回调时验证 (10分钟有效)
  const isProd = process.env.NODE_ENV === 'production';
  const cookieHeader = `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${isProd ? '; Secure' : ''}`;

  // 如果请求头要求 JSON，则返回 JSON；否则重定向
  const accept = request.headers.get('accept') || '';
  if (accept.includes('application/json')) {
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

  // 默认直接重定向，这样点击链接也能登录
  return new Response(null, {
    status: 302,
    headers: {
      'Location': authUrl.toString(),
      'Set-Cookie': cookieHeader
    }
  });
}
