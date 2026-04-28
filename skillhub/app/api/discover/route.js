// Discover API - 多渠道搜索 Skills
// 支持: clawhub (CLI), github, skill.sh

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'all';

  if (!query.trim()) {
    return Response.json({ success: true, query: '', results: [], total: 0 });
  }

  // Vercel 环境变量
  const GH_TOKEN = process.env.GITHUB_TOKEN;
  const ghHeaders = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GH_TOKEN && { 'Authorization': `Bearer ${GH_TOKEN}` })
  };

  try {
    const results = [];

    // 1. ClawHub 搜索 - 使用 clawhub search 命令输出
    // Vercel Serverless 无法执行外部命令，改用 clawhub.com API
    if (source === 'all' || source === 'clawhub') {
      try {
        // 尝试 clawhub.com 公开 API
        const clawhubRes = await fetch(
          `https://clawhub.com/api/v1/search?q=${encodeURIComponent(query)}&limit=15`,
          { 
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 1800 }
          }
        );
        
        if (clawhubRes.ok) {
          const data = await clawhubRes.json();
          if (Array.isArray(data)) {
            data.forEach(skill => {
              results.push({
                name: skill.name || skill.slug || skill.title,
                desc: skill.description || skill.name || skill.slug || skill.title,
                score: skill.score || skill.relevance || 0,
                source: 'clawhub',
                install: 'clawdhub',
                version: skill.version
              });
            });
          } else if (data.results && Array.isArray(data.results)) {
            data.results.forEach(skill => {
              results.push({
                name: skill.name || skill.slug,
                desc: skill.description || skill.name,
                score: skill.score || 0,
                source: 'clawhub',
                install: 'clawdhub'
              });
            });
          }
        }
      } catch (e) {
        console.warn('ClawHub API not available:', e.message);
      }
      
      // 如果 ClawHub API 失败，使用 GitHub 作为回退
      if (results.length === 0 && (source === 'all' || source === 'clawhub')) {
        console.warn('ClawHub unavailable, falling back to GitHub');
      }
    }

    // 2. GitHub 搜索 SKILL.md 文件
    if (source === 'all' || source === 'github') {
      try {
        const ghRes = await fetch(
          `https://api.github.com/search/code?q=filename:SKILL.md+${encodeURIComponent(query)}&per_page=15&sort=stars&order=desc`,
          { 
            headers: ghHeaders,
            next: { revalidate: 3600 }
          }
        );
        
        if (ghRes.status === 403) {
          console.warn('GitHub API rate limited');
        } else if (ghRes.ok) {
          const data = await ghRes.json();
          (data.items || []).forEach(item => {
            results.push({
              name: item.repository.full_name.split('/')[1]?.replace(/[-_](skill|skills)$/i, '') || item.repository.name,
              desc: item.repository.description || item.repository.full_name,
              repo: item.repository.full_name,
              stars: item.repository.stargazers_count,
              source: 'github',
              install: 'git',
              url: item.html_url
            });
          });
        }
      } catch (e) {
        console.warn('GitHub API not available:', e.message);
      }
    }

    // 3. skill.sh 搜索 - GitHub 搜索 skill.sh 相关
    if (source === 'all' || source === 'skillssh') {
      try {
        const ghRes = await fetch(
          `https://api.github.com/search/repositories?q=skill.sh+${encodeURIComponent(query)}+in:readme&sort=stars&order=desc&per_page=10`,
          { 
            headers: ghHeaders,
            next: { revalidate: 3600 }
          }
        );
        
        if (ghRes.ok) {
          const data = await ghRes.json();
          (data.items || []).forEach(repo => {
            results.push({
              name: repo.name.replace(/[-_](skill|skills)$/i, ''),
              desc: `[skill.sh] ${repo.description || repo.name}`,
              repo: repo.full_name,
              stars: repo.stargazers_count,
              source: 'skillssh',
              install: 'git',
              url: repo.html_url
            });
          });
        }
      } catch (e) {
        console.warn('skill.sh search failed:', e.message);
      }
    }

    // 按相关性排序 (stars 优先)
    results.sort((a, b) => {
      const scoreA = a.score || a.stars || 0;
      const scoreB = b.score || b.stars || 0;
      return scoreB - scoreA;
    });

    // 去重 (同 name 只保留一个)
    const seen = new Set();
    const deduped = results.filter(r => {
      if (seen.has(r.name)) return false;
      seen.add(r.name);
      return true;
    });

    return Response.json({
      success: true,
      query,
      source,
      total: deduped.length,
      results: deduped.slice(0, 30)
    });
  } catch (error) {
    console.error('Discover API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
