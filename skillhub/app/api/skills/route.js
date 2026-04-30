// Skills API - 获取 Skills 列表
// 优化: 动态从目录读取，消除手动维护成本

import { getLocalSkills } from '../utils.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';
  const filter = searchParams.get('filter') || '';

  const localData = getLocalSkills();
  let skills = [];
  
  if (source === 'all') {
    skills = [...localData.workspace, ...localData.openclaw, ...localData.agents];
  } else if (localData[source]) {
    skills = localData[source];
  }
  
  // 关键词过滤
  if (filter) {
    const q = filter.toLowerCase();
    skills = skills.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.desc.toLowerCase().includes(q)
    );
  }

  return Response.json({
    success: true,
    total: skills.length,
    stats: {
      workspace: localData.workspace.length,
      openclaw: localData.openclaw.length,
      agents: localData.agents.length,
      total: localData.total
    },
    skills
  });
}
