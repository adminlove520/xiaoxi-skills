// Discover API - 多渠道搜索 Skills
// 支持: clawhub, github, skill.sh
// 优化: 并行请求加速

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'all';

  if (!query.trim()) {
    return Response.json({ success: true, query: '', results: [], total: 0 });
  }

  // Vercel 环境变量
  const GH_TOKEN = process.env.GITHUB_TOKEN;
  const CLAWHUB_TOKEN = process.env.CLAWHUB_TOKEN || 'clh_8ZsZYX4obpZZykBv6QCh11zxCgp1eE2ywMmohmoMUkE';

  const ghHeaders = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GH_TOKEN && { 'Authorization': `Bearer ${GH_TOKEN}` })
  };

  const clawhubHeaders = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${CLAWHUB_TOKEN}`
  };

  try {
    const results = [];

    // Parallelize search from different sources
    const searchTasks = [];

    // 1. ClawHub 搜索
    if (source === 'all' || source === 'clawhub') {
      searchTasks.push((async () => {
        try {
          const res = await fetch(`https://clawhub.ai/api/v1/search?q=${encodeURIComponent(query)}&limit=15`, { 
            headers: clawhubHeaders,
            next: { revalidate: 1800 }
          });
          if (res.ok) {
            const data = await res.json();
            return (data.results || []).map(skill => ({
              name: skill.slug,
              desc: skill.summary || skill.displayName || skill.slug,
              displayName: skill.displayName,
              score: skill.score || 0,
              source: 'clawhub',
              install: 'clawdhub',
              version: skill.version
            }));
          }
        } catch (e) { console.warn('ClawHub search error:', e.message); }
        return [];
      })());
    }

    // 2. GitHub 搜索
    if (source === 'all' || source === 'github') {
      searchTasks.push((async () => {
        try {
          const res = await fetch(`https://api.github.com/search/code?q=filename:SKILL.md+${encodeURIComponent(query)}&per_page=15&sort=stars&order=desc`, { 
            headers: ghHeaders,
            next: { revalidate: 3600 }
          });
          if (res.ok) {
            const data = await res.json();
            return (data.items || []).map(item => ({
              name: item.repository.full_name.split('/')[1]?.replace(/[-_](skill|skills)$/i, '') || item.repository.name,
              desc: item.repository.description || item.repository.full_name,
              repo: item.repository.full_name,
              stars: item.repository.stargazers_count,
              source: 'github',
              install: 'git',
              url: item.html_url
            }));
          }
        } catch (e) { console.warn('GitHub search error:', e.message); }
        return [];
      })());
    }

    // 3. skill.sh 搜索
    if (source === 'all' || source === 'skillssh') {
      searchTasks.push((async () => {
        try {
          const res = await fetch(`https://api.github.com/search/repositories?q=skill.sh+${encodeURIComponent(query)}+in:readme&sort=stars&order=desc&per_page=10`, { 
            headers: ghHeaders,
            next: { revalidate: 3600 }
          });
          if (res.ok) {
            const data = await res.json();
            return (data.items || []).map(repo => ({
              name: repo.name.replace(/[-_](skill|skills)$/i, ''),
              desc: `[skill.sh] ${repo.description || repo.name}`,
              repo: repo.full_name,
              stars: repo.stargazers_count,
              source: 'skillssh',
              install: 'git',
              url: repo.html_url
            }));
          }
        } catch (e) { console.warn('skill.sh search error:', e.message); }
        return [];
      })());
    }

    const taskResults = await Promise.all(searchTasks);
    taskResults.forEach(r => results.push(...r));

    // 按相关性排序
    results.sort((a, b) => {
      const scoreA = a.score || a.stars || 0;
      const scoreB = b.score || b.stars || 0;
      return scoreB - scoreA;
    });

    // 去重
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
