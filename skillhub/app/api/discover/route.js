// Discover API - 从多个渠道搜索 Skills
// 支持: clawhub, github, local

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const source = searchParams.get('source') || 'all';

  try {
    const results = {
      clawhub: [],
      github: [],
      local: []
    };

    // 1. ClawHub 搜索
    if (source === 'all' || source === 'clawhub') {
      try {
        const { execSync } = require('child_process');
        const output = execSync(`clawhub search "${query}" --json 2>/dev/null || echo "[]"`, { 
          encoding: 'utf8',
          timeout: 10000 
        });
        const clawhubResults = JSON.parse(output || '[]');
        results.clawhub = clawhubResults.slice(0, 20).map(skill => ({
          name: skill.name,
          desc: skill.description || skill.name,
          score: skill.score || skill.relevance || 0,
          source: 'clawhub',
          install: 'clawdhub',
          version: skill.version
        }));
      } catch (e) {
        console.error('ClawHub search error:', e.message);
      }
    }

    // 2. GitHub 搜索
    if (source === 'all' || source === 'github') {
      try {
        const ghRes = await fetch(
          `https://api.github.com/search/code?q=filename:SKILL.md+${encodeURIComponent(query)}&per_page=20&sort=stars&order=desc`,
          { 
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            next: { revalidate: 3600 } // Cache 1 hour
          }
        );
        if (ghRes.ok) {
          const data = await ghRes.json();
          results.github = (data.items || []).map(item => ({
            name: item.repository.full_name.split('/')[1]?.replace('-skill', '').replace('-skills', '') || item.repository.full_name,
            desc: item.repository.description || item.repository.full_name,
            repo: item.repository.full_name,
            stars: item.repository.stargazers_count,
            source: 'github',
            install: 'git',
            url: item.html_url
          }));
        }
      } catch (e) {
        console.error('GitHub search error:', e.message);
      }
    }

    // 3. 本地 Skills 搜索
    if (source === 'all' || source === 'local') {
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
          
          const matched = dirs
            .filter(name => name.toLowerCase().includes(query.toLowerCase()))
            .map(name => ({
              name,
              desc: name,
              source: basePath.includes('workspace') ? 'local-workspace' : 'local-openclaw',
              install: 'cp'
            }));
          
          results.local.push(...matched);
        } catch (e) {
          // 目录可能不存在
        }
      }
    }

    const allResults = [
      ...results.clawhub,
      ...results.github,
      ...results.local
    ].sort((a, b) => (b.score || b.stars || 0) - (a.score || a.stars || 0));

    return Response.json({
      success: true,
      query,
      source,
      total: allResults.length,
      bySource: {
        clawhub: results.clawhub.length,
        github: results.github.length,
        local: results.local.length
      },
      results: allResults.slice(0, 50)
    });
  } catch (error) {
    console.error('Discover API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
