// GitHub OAuth Callback API
// 处理 GitHub OAuth 回调，交换 access_token

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

    // 返回 JSON 而不是直接重定向
    // 前端会处理这个响应
    return Response.json({
      success: true,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url
      },
      // 注意：实际应该通过 HttpOnly cookie 返回 token
      // 这里为了简化，返回给前端自行处理
      message: 'OAuth 登录成功'
    });

  } catch (e) {
    console.error('OAuth callback error:', e);
    return Response.redirect('/?auth_error=server_error');
  }
}
