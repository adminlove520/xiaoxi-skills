// GitHub OAuth Status API
// 检查用户登录状态

export async function GET(request) {
  // 从 cookie 中读取 token
  const token = request.cookies.get('github_token')?.value;
  
  if (!token) {
    return Response.json({ success: false, user: null });
  }
  
  try {
    // 验证 token，获取用户信息
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!userRes.ok) {
      // token 无效或过期
      return Response.json({ success: false, user: null });
    }
    
    const userData = await userRes.json();
    
    return Response.json({
      success: true,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url
      }
    });
  } catch (e) {
    console.error('Auth status check error:', e);
    return Response.json({ success: false, user: null });
  }
}