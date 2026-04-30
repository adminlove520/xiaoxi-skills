// Skills 数据 - xiaoxi-skills 动态生成版
// 核心逻辑已迁移至 utils.js 的 getLocalSkills

import { getLocalSkills } from './utils.js';

const localData = getLocalSkills();

export const WORKSPACE_SKILLS = localData.workspace;
export const OPENCLAW_SKILLS = localData.openclaw;
export const AGENTS_SKILLS = localData.agents;
export const ALL_SKILLS = [...localData.workspace, ...localData.openclaw, ...localData.agents];
export const STATS = {
  workspace: localData.workspace.length,
  openclaw: localData.openclaw.length,
  agents: localData.agents.length,
  total: localData.total
};

export const API_BASE = '/api';

export default ALL_SKILLS;
