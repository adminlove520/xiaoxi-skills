// GitHub OAuth Callback API
// 处理 GitHub OAuth 回调，交换 access_token 并设置 cookie

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 获取 origin
  const origin = request.headers.get('origin') || 'https://skillhub-eight.vercel.app';

  // 如果用户拒绝授权
  if (error) {
    return Response.redirect(`${origin}/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return Response.redirect(`${origin}/?auth_error=no_code`);
  }

  // 从 Vercel 环境变量 或 本地 fallback 获取配置
  let GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  let GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  // Fallback: 如果是空值或 placeholder，用本地测试值
  if (!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID === 'GitHub OAuth App client ID' || GITHUB_CLIENT_ID === 'PLACEHOLDER_fill_me') {
    GITHUB_CLIENT_ID = 'Ov231i1LWbTWxKhRMR38';
  }
  if (!GITHUB_CLIENT_SECRET || GITHUB_CLIENT_SECRET === 'GitHub OAuth App client secret' || GITHUB_CLIENT_SECRET === 'PLACEHOLDER_fill_me') {
    GITHUB_CLIENT_SECRET = '23b5438bd92266ac9a98689fca9d6845c25cfea3';
  }

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
        state
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

    // 设置 HttpOnly cookie (7天过期)
    const cookieHeader = `gh_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
    
    const headers = new Headers();
    headers.append('Set-Cookie', cookieHeader);
    headers.append('Location', `${origin}/?login_success=1`);

    return new Response(null, {
      status: 302,
      headers
    });

  } catch (e) {
    console.error('OAuth callback error:', e);
    return Response.redirect(`${origin}/?auth_error=server_error`);
  }
}