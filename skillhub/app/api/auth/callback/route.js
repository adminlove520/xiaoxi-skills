// GitHub OAuth Callback API
// 处理 GitHub OAuth 回调，交换 access_token 并设置 cookie

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 获取 host 和 protocol 来动态构建 origin
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
  const origin = host ? `${protocol}://${host}` : 'https://skillhub-eight.vercel.app';

  // 验证 state (防止 CSRF)
  const cookieHeader = request.headers.get('cookie') || '';
  const oauthStateCookie = cookieHeader.split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('oauth_state='))
    ?.substring('oauth_state='.length);

  if (!state || state !== oauthStateCookie) {
    console.error('State mismatch:', { received: state, expected: oauthStateCookie });
    return Response.redirect(`${origin}/?auth_error=state_mismatch`);
  }

  // 如果用户拒绝授权
  if (error) {
    return Response.redirect(`${origin}/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return Response.redirect(`${origin}/?auth_error=no_code`);
  }

  // 从 Vercel 环境变量 或 本地 fallback 获取配置
  // 增加纠错逻辑：处理 1 vs l 的常见拼写错误
  let GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID?.replace(/[^a-zA-Z0-9]/g, '');
  if (GITHUB_CLIENT_ID === 'Ov231i1LWbTWxKhRMR38') {
    GITHUB_CLIENT_ID = 'Ov23li1LWbTWxKhRMR38';
  }
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET?.trim().replace(/^\uFEFF/, '');
  let REDIRECT_URI = process.env.GITHUB_REDIRECT_URI?.replace(/[\s\uFEFF\u200B-\u200D]/g, '');
  
  // 智能修正 Redirect URI
  if (REDIRECT_URI && !REDIRECT_URI.includes('/api/auth/callback')) {
    REDIRECT_URI = REDIRECT_URI.endsWith('/') 
      ? REDIRECT_URI + 'api/auth/callback' 
      : REDIRECT_URI + '/api/auth/callback';
  }

  // 如果环境变量未配置，返回错误
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return Response.redirect(`${origin}/?auth_error=oauth_not_configured`);
  }

  try {
    // 交换 access_token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        state,
        redirect_uri: REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      const err = tokenData.error || 'access_token_missing';
      return Response.redirect(`${origin}/?auth_error=${encodeURIComponent(err)}`);
    }

    const accessToken = tokenData.access_token;

    // 获取用户信息
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userRes.json();

    // 设置 HttpOnly cookie (7天过期) 并清除 oauth_state
    const isProd = process.env.NODE_ENV === 'production';
    const tokenCookie = `gh_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${isProd ? '; Secure' : ''}`;
    const clearStateCookie = `oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? '; Secure' : ''}`;
    
    // 解析 state 中的 return_to
    let returnPath = '/';
    if (state && state.includes('|')) {
      try {
        const base64Part = state.split('|')[1];
        returnPath = Buffer.from(base64Part, 'base64').toString();
      } catch (e) {
        console.warn('Failed to parse return_to from state');
      }
    }

    const headers = new Headers();
    headers.append('Set-Cookie', tokenCookie);
    headers.append('Set-Cookie', clearStateCookie);
    headers.append('Location', `${origin}${returnPath}${returnPath.includes('?') ? '&' : '?'}login_success=1`);

    return new Response(null, {
      status: 302,
      headers
    });

  } catch (e) {
    console.error('OAuth callback error:', e);
    return Response.redirect(`${origin}/?auth_error=server_error`);
  }
}
