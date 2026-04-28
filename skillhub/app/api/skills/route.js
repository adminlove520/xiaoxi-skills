// 获取所有 Skills 列表
// 从多个来源获取并合并

export async function GET() {
  try {
    const results = {
      workspace: [],
      openclaw: [],
      repo: []
    };

    // 1. 从 GitHub API 获取 xiaoxi-skills 的 Skills 列表
    try {
      const ghRes = await fetch(
        'https://api.github.com/repos/adminlove520/xiaoxi-skills/contents',
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      );
      if (ghRes.ok) {
        const contents = await ghRes.json();
        const skills = contents
          .filter(item => item.type === 'dir' && !['docs', 'scripts', 'skillhub', 'node_modules', '.git'].includes(item.name))
          .map(item => ({
            name: item.name,
            source: 'repo',
            install: 'clawdhub',
            desc: item.name, // 实际应该从 README 或 SKILL.md 获取
            url: item.html_url
          }));
        results.repo = skills;
      }
    } catch (e) {
      console.error('GitHub API error:', e);
    }

    // 2. 从 clawhub 获取已安装的 skills
    try {
      const { execSync } = require('child_process');
      const output = execSync('clawhub list --json 2>/dev/null || echo "[]"', { encoding: 'utf8' });
      const clawhubSkills = JSON.parse(output || '[]');
      clawhubSkills.forEach(skill => {
        if (!results.repo.find(s => s.name === skill.name)) {
          results.repo.push({
            name: skill.name,
            source: 'clawhub',
            install: 'clawdhub',
            desc: skill.description || skill.name,
            version: skill.version
          });
        }
      });
    } catch (e) {
      // clawhub 可能没有安装或没有 skills
    }

    // 3. 扫描本地 workspace skills
    const localPaths = [
      '/root/.openclaw/workspace/skills',
      '/root/.openclaw/skills',
      '/root/.agents/skills'
    ];

    for (const basePath of localPaths) {
      try {
        const { execSync } = require('child_process');
        const dirs = execSync(`ls -d ${basePath}/*/ 2>/dev/null | xargs -n1 basename`, { encoding: 'utf8' })
          .split('\n')
          .filter(Boolean);
        
        dirs.forEach(name => {
          const source = basePath.includes('workspace') ? 'workspace' : 'openclaw';
          if (!results[source].find(s => s.name === name)) {
            results[source].push({
              name,
              source,
              install: 'cp',
              desc: name
            });
          }
        });
      } catch (e) {
        // 目录可能不存在
      }
    }

    const all = [...results.workspace, ...results.openclaw, ...results.repo];
    
    return Response.json({
      success: true,
      total: all.length,
      bySource: {
        workspace: results.workspace.length,
        openclaw: results.openclaw.length,
        repo: results.repo.length
      },
      skills: all
    });
  } catch (error) {
    console.error('Skills API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
