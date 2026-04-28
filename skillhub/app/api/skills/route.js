// Skills API - 静态数据 + GitHub 增量
// Vercel Serverless 兼容：不需要 execSync

import STATIC_SKILLS from '../skills-data';

export async function GET() {
  try {
    // 优先使用静态数据（Vercel 兼容）
    let skills = [...STATIC_SKILLS];
    
    // 尝试从 GitHub 获取最新数据作为增量
    let ghUpdated = false;
    try {
      const ghRes = await fetch(
        'https://api.github.com/repos/adminlove520/xiaoxi-skills/contents?ref=main',
        { 
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          next: { revalidate: 3600 } // 1小时缓存
        }
      );
      
      if (ghRes.ok) {
        const contents = await ghRes.json();
        const ghSkills = contents
          .filter(item => item.type === 'dir' && !['docs', 'scripts', 'skillhub', 'node_modules', '.git', 'README.md', 'CHANGELOG.md'].includes(item.name))
          .map(item => ({
            name: item.name,
            source: 'repo',
            install: 'clawdhub',
            desc: item.name,
            url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/${item.name}`
          }));
        
        // 合并但不重复
        ghSkills.forEach(ghSkill => {
          if (!skills.find(s => s.name === ghSkill.name)) {
            skills.push(ghSkill);
            ghUpdated = true;
          }
        });
      }
    } catch (e) {
      console.warn('GitHub API not available, using static data:', e.message);
    }
    
    return Response.json({
      success: true,
      source: ghUpdated ? 'static+github' : 'static',
      total: skills.length,
      bySource: {
        workspace: skills.filter(s => s.source === 'workspace').length,
        openclaw: skills.filter(s => s.source === 'openclaw').length,
        clawhub: skills.filter(s => s.source === 'clawhub').length,
        repo: skills.filter(s => s.source === 'repo').length
      },
      skills
    });
  } catch (error) {
    console.error('Skills API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
