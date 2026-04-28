// Leaderboard API - 各渠道 Top 10 Skills 排行榜
// 使用真实 ClawHub API + GitHub Topics

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';

  // Vercel 环境变量
  const GH_TOKEN = process.env.GITHUB_TOKEN;
  const CLAWHUB_TOKEN = process.env.CLAWHUB_TOKEN || process.env.CLAWHUB_TOKEN || 'clh_8ZsZYX4obpZZykBv6QCh11zxCgp1eE2ywMmohmoMUkE';

  const ghHeaders = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GH_TOKEN && { 'Authorization': `Bearer ${GH_TOKEN}` })
  };

  const clawhubHeaders = {
    'Accept': 'application/json',
    ...(CLAWHUB_TOKEN && { 'Authorization': `Bearer ${CLAWHUB_TOKEN}` })
  };

  try {
    const rankings = {
      clawhub: [],
      github: [],
      trending: []
    };

    // 1. ClawHub Top 10 - 使用真实 API
    try {
      const categories = ['twitter', 'github', 'memory', 'search', 'browser', 'web', 'code', 'productivity', 'video', 'social'];
      const seen = new Set();
      
      for (const cat of categories) {
        try {
          const clawhubRes = await fetch(
            `https://clawhub.ai/api/v1/search?q=${encodeURIComponent(cat)}&limit=5`,
            { 
              headers: clawhubHeaders,
              next: { revalidate: 1800 } // 30分钟缓存
            }
          );
          
          if (clawhubRes.ok) {
            const data = await clawhubRes.json();
            (data.results || []).forEach(skill => {
              if (!seen.has(skill.slug)) {
                seen.add(skill.slug);
                rankings.clawhub.push({
                  name: skill.slug,
                  desc: skill.summary || skill.displayName || skill.slug,
                  score: skill.score || 0,
                  displayName: skill.displayName,
                  category: cat,
                  source: 'clawhub',
                  install: 'clawdhub'
                });
              }
            });
          }
        } catch (e) {
          console.warn(`ClawHub search failed for ${cat}:`, e.message);
        }
      }
      
      rankings.clawhub = rankings.clawhub
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (e) {
      console.warn('ClawHub API error:', e.message);
    }

    // 2. GitHub Top 10 (按 stars)
    const topics = ['openclaw-skill', 'openclaw-skills', 'clawhub-skill', 'ai-agent-skill'];
    const ghSeen = new Set();
    
    for (const topic of topics) {
      try {
        const ghRes = await fetch(
          `https://api.github.com/search/repositories?q=topic:${topic}+is:public&sort=stars&order=desc&per_page=15`,
          { 
            headers: ghHeaders,
            next: { revalidate: 3600 }
          }
        );
        
        if (ghRes.status === 403) {
          console.warn('GitHub API rate limited');
          break;
        }
        
        if (ghRes.ok) {
          const data = await ghRes.json();
          (data.items || []).forEach(repo => {
            if (!ghSeen.has(repo.id)) {
              ghSeen.add(repo.id);
              rankings.github.push({
                name: repo.name.replace(/[-_](skill|skills)$/i, ''),
                desc: repo.description || repo.name,
                repo: repo.full_name,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                source: 'github',
                install: 'git',
                url: repo.html_url
              });
            }
          });
        }
      } catch (e) {
        console.warn(`GitHub search failed for topic ${topic}:`, e.message);
      }
    }
    
    rankings.github = rankings.github
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    // 3. Trending - 综合排名
    const trendingMap = new Map();
    
    rankings.clawhub.forEach((skill, i) => {
      trendingMap.set(skill.name, {
        ...skill,
        rank: i + 1,
        trendingScore: (10 - i) * 8 + (skill.score || 0) * 10
      });
    });
    
    rankings.github.forEach((skill, i) => {
      const existing = trendingMap.get(skill.name);
      if (existing) {
        existing.trendingScore += (10 - i) * 2 + Math.log10((skill.stars || 0) + 1) * 3;
        existing.githubStars = skill.stars;
      } else {
        trendingMap.set(skill.name, {
          ...skill,
          rank: i + 1,
          trendingScore: (10 - i) * 5 + Math.log10((skill.stars || 0) + 1) * 10
        });
      }
    });
    
    rankings.trending = Array.from(trendingMap.values())
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);

    if (source !== 'all') {
      return Response.json({
        success: true,
        source,
        rankings: rankings[source] || []
      });
    }

    return Response.json({
      success: true,
      total: {
        clawhub: rankings.clawhub.length,
        github: rankings.github.length,
        trending: rankings.trending.length
      },
      rankings
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
