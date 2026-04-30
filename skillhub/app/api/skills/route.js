// Skills API - 获取 Skills 列表
// 更新: 2026-04-30 - 重构版, 分 WORKSPACE/OPENCLAW/AGENTS 三类

import { WORKSPACE_SKILLS, OPENCLAW_SKILLS, AGENTS_SKILLS, STATS } from '../skills-data.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';
  const filter = searchParams.get('filter') || '';

  let skills = [];
  
  // 根据 source 过滤
  if (source === 'all' || source === 'workspace') {
    skills = skills.concat(WORKSPACE_SKILLS.map(s => ({
      ...s,
      source: 'workspace',
      install: `cp -r ~/.openclaw/xiaoxi-skills/workspace/${s.name} ~/.openclaw/skills/`,
      url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/workspace/${s.name}`
    })));
  }
  
  if (source === 'all' || source === 'openclaw') {
    skills = skills.concat(OPENCLAW_SKILLS.map(s => ({
      ...s,
      source: 'openclaw',
      install: `cp -r ~/.openclaw/xiaoxi-skills/openclaw/${s.name} ~/.openclaw/skills/`,
      url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/openclaw/${s.name}`
    })));
  }

  if (source === 'all' || source === 'agents') {
    skills = skills.concat(AGENTS_SKILLS.map(s => ({
      ...s,
      source: 'agents',
      install: `cp -r ~/.openclaw/xiaoxi-skills/agents/${s.name} ~/.openclaw/skills/`,
      url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/agents/${s.name}`
    })));
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
    stats: STATS,
    skills
  });
}