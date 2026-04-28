// Leaderboard API - 各渠道 Top 10 Skills 排行榜

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';

  try {
    const rankings = {
      clawhub: [],
      github: [],
      trending: []
    };

    // 1. ClawHub Top 10 (按 score/relevance)
    try {
      const categories = ['twitter', 'github', 'memory', 'search', 'browser', 'web', 'code', 'productivity'];
      const clawhubTop = [];
      
      for (const cat of categories) {
        try {
          const { execSync } = require('child_process');
          const output = execSync(`clawhub search "${cat}" --json 2>/dev/null || echo "[]"`, { 
            encoding: 'utf8',
            timeout: 8000 
          });
          const results = JSON.parse(output || '[]');
          results.slice(0, 3).forEach(skill => {
            if (!clawhubTop.find(s => s.name === skill.name)) {
              clawhubTop.push({
                name: skill.name,
                desc: skill.description || skill.name,
                score: skill.score || skill.relevance || 0,
                category: cat,
                source: 'clawhub',
                install: 'clawdhub'
              });
            }
          });
        } catch (e) {
          // Continue
        }
      }
      
      rankings.clawhub = clawhubTop
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (e) {
      console.error('ClawHub leaderboard error:', e.message);
    }

    // 2. GitHub Top 10 (按 stars)
    try {
      const topics = ['openclaw-skill', 'openclaw-skills', 'clawhub-skill'];
      const githubTop = [];
      
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
            if (!githubTop.find(s => s.name === repo.name)) {
              githubTop.push({
                name: repo.name.replace('-skill', '').replace('-skills', ''),
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
      
      rankings.github = githubTop
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 10);
    } catch (e) {
      console.error('GitHub leaderboard error:', e.message);
    }

    // 3. Trending - 合并多渠道高评分
    const trendingSet = new Map();
    
    rankings.clawhub.forEach((skill, i) => {
      trendingSet.set(skill.name, { ...skill, rank: i + 1, trendingScore: (10 - i) * 10 + (skill.score || 0) });
    });
    
    rankings.github.forEach((skill, i) => {
      if (!trendingSet.has(skill.name)) {
        trendingSet.set(skill.name, { ...skill, rank: i + 1, trendingScore: (10 - i) * 5 + Math.log10(skill.stars + 1) * 10 });
      }
    });
    
    rankings.trending = Array.from(trendingSet.values())
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);

    // Return requested source or all
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
