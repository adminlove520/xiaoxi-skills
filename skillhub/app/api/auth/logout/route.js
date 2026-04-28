// GitHub OAuth Logout API
// 清除登录状态

import { cookies } from 'next/headers';

export async function POST(request) {
  const cookieStore = await cookies();
  
  // 删除 token cookie
  cookieStore.delete('github_token');
  
  return Response.json({ success: true, message: '已退出登录' });
}