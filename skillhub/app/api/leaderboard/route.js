// Leaderboard API - 各渠道 Top 10 Skills 排行榜
// Vercel Serverless 兼容版本

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';

  try {
    const rankings = {
      clawhub: [],
      github: [],
      trending: []
    };

    // 1. ClawHub Top 10
    try {
      const categories = ['twitter', 'github', 'memory', 'search', 'browser', 'web', 'code', 'productivity'];
      
      for (const cat of categories) {
        try {
          const clawhubRes = await fetch(
            `https://registry.clawhub.com/api/search?q=${cat}&limit=5`,
            { 
              headers: { 'Accept': 'application/json' },
              next: { revalidate: 3600 }
            }
          );
          
          if (clawhubRes.ok) {
            const data = await clawhubRes.json();
            if (Array.isArray(data)) {
              data.slice(0, 3).forEach(skill => {
                if (!rankings.clawhub.find(s => s.name === (skill.name || skill.slug))) {
                  rankings.clawhub.push({
                    name: skill.name || skill.slug,
                    desc: skill.description || skill.name || skill.slug,
                    score: skill.score || skill.relevance || 0,
                    category: cat,
                    source: 'clawhub',
                    install: 'clawdhub'
                  });
                }
              });
            }
          }
        } catch (e) {
          // Continue with next category
        }
      }
      
      rankings.clawhub = rankings.clawhub
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (e) {
      console.warn('ClawHub leaderboard error:', e.message);
    }

    // 2. GitHub Top 10 (按 stars)
    try {
      const topics = ['openclaw-skill', 'openclaw-skills'];
      
      for (const topic of topics) {
        const ghRes = await fetch(
          `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=10`,
          { 
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            next: { revalidate: 3600 }
          }
        );
        
        if (ghRes.ok) {
          const data = await ghRes.json();
          (data.items || []).forEach(repo => {
            if (!rankings.github.find(s => s.name === repo.name)) {
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
      }
      
      rankings.github = rankings.github
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 10);
    } catch (e) {
      console.warn('GitHub leaderboard error:', e.message);
    }

    // 3. Trending - 合并多渠道
    const trendingMap = new Map();
    
    rankings.clawhub.forEach((skill, i) => {
      trendingMap.set(skill.name, { 
        ...skill, 
        rank: i + 1, 
        trendingScore: (10 - i) * 10 + (skill.score || 0) 
      });
    });
    
    rankings.github.forEach((skill, i) => {
      if (!trendingMap.has(skill.name)) {
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
