// Discover API - 多渠道搜索 Skills
// Vercel Serverless 兼容版本

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'all';

  if (!query.trim()) {
    return Response.json({ success: true, query: '', results: [], total: 0 });
  }

  try {
    const results = [];

    // 1. ClawHub 搜索 (通过 API)
    if (source === 'all' || source === 'clawhub') {
      try {
        const clawhubRes = await fetch(
          `https://registry.clawhub.com/api/search?q=${encodeURIComponent(query)}&limit=10`,
          { 
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 1800 } // 30分钟缓存
          }
        );
        
        if (clawhubRes.ok) {
          const data = await clawhubRes.json();
          if (Array.isArray(data)) {
            data.slice(0, 10).forEach(skill => {
              results.push({
                name: skill.name || skill.slug,
                desc: skill.description || skill.name || skill.slug,
                score: skill.score || skill.relevance || 0,
                source: 'clawhub',
                install: 'clawdhub',
                version: skill.version
              });
            });
          }
        }
      } catch (e) {
        console.warn('ClawHub API not available:', e.message);
      }
    }

    // 2. GitHub 搜索 SKILL.md 文件
    if (source === 'all' || source === 'github') {
      try {
        const ghRes = await fetch(
          `https://api.github.com/search/code?q=filename:SKILL.md+${encodeURIComponent(query)}&per_page=10&sort=stars&order=desc`,
          { 
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            next: { revalidate: 3600 }
          }
        );
        
        if (ghRes.ok) {
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

    // 3. 本地 Skills (静态数据中搜索)
    if (source === 'all' || source === 'local') {
      // 静态数据已在上方合并，无需额外处理
    }

    // 按相关性排序
    results.sort((a, b) => {
      const scoreA = a.score || a.stars || 0;
      const scoreB = b.score || b.stars || 0;
      return scoreB - scoreA;
    });

    return Response.json({
      success: true,
      query,
      source,
      total: results.length,
      results: results.slice(0, 30)
    });
  } catch (error) {
    console.error('Discover API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
