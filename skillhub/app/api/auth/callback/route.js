// GitHub OAuth Callback API
// 处理 GitHub OAuth 回调，交换 access_token 并设置 cookie

import { cookies } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 如果用户拒绝授权
  if (error) {
    return Response.redirect(`/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return Response.redirect('/?auth_error=no_code');
  }

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return Response.redirect('/?auth_error=oauth_not_configured');
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

    if (tokenData.error) {
      return Response.redirect(`/?auth_error=${encodeURIComponent(tokenData.error)}`);
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

    // 设置 HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 天
    });

    // 返回首页（带上用户信息给前端）
    return Response.redirect('/?login=success');

  } catch (e) {
    console.error('OAuth callback error:', e);
    return Response.redirect('/?auth_error=server_error');
  }
}