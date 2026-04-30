import fs from 'fs';
import path from 'path';

/**
 * 动态获取仓库中的 Skills 列表
 * 按 workspace, openclaw, agents 分类
 */
export function getLocalSkills() {
  const rootDir = path.join(process.cwd(), 'data'); 
  const categories = ['workspace', 'openclaw', 'agents'];
  
  // Try to determine if we are in a Vercel-like environment where process.cwd() might be different
  // or if the directories are missing
  const results = {
    workspace: [],
    openclaw: [],
    agents: [],
    total: 0
  };

  try {
    categories.forEach(cat => {
      const catPath = path.join(rootDir, cat);
      if (fs.existsSync(catPath) && fs.statSync(catPath).isDirectory()) {
        const skills = fs.readdirSync(catPath);
        skills.forEach(skillName => {
          const skillPath = path.join(catPath, skillName);
          if (fs.statSync(skillPath).isDirectory()) {
            const skillMdPath = path.join(skillPath, 'SKILL.md');
            let desc = `[${cat}] ${skillName}`;
            
            if (fs.existsSync(skillMdPath)) {
              try {
                const content = fs.readFileSync(skillMdPath, 'utf8');
                const descMatch = content.match(/## description\s*\n\s*([^\n]+)/i) || 
                                  content.match(/description:\s*([^\n]+)/i);
                if (descMatch) desc = descMatch[1].trim();
              } catch (e) {
                console.warn(`Failed to read SKILL.md for ${skillName}:`, e.message);
              }
            }
            
            results[cat].push({
              name: skillName,
              desc: desc,
              source: cat,
              install: `git clone https://github.com/adminlove520/xiaoxi-skills && cp -r xiaoxi-skills/${cat}/${skillName} ~/.openclaw/skills/`,
              url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/${cat}/${skillName}`
            });
          }
        });
      }
    });
  } catch (err) {
    console.error('Error scanning local skills:', err);
  }

  results.total = results.workspace.length + results.openclaw.length + results.agents.length;
  return results;
}
