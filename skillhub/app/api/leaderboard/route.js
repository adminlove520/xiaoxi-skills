// Leaderboard API - 各渠道 Top 10 Skills 排行榜
// 使用真实 ClawHub API + GitHub Topics + skill.sh

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';

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
    const rankings = {
      clawhub: [],
      github: [],
      skillssh: [],
      trending: []
    };

    // 1. ClawHub Top 10 - 使用真实 trending API
    try {
      const clawhubRes = await fetch(
        `https://clawhub.ai/api/v1/packages?sort=updated&limit=15`,
        { 
          headers: clawhubHeaders,
          next: { revalidate: 1800 }
        }
      );
      
      if (clawhubRes.ok) {
        const data = await clawhubRes.json();
        (data.items || []).slice(0, 10).forEach((skill, i) => {
          rankings.clawhub.push({
            name: skill.name,
            desc: skill.summary || skill.displayName || skill.name,
            displayName: skill.displayName,
            score: (10 - i) + 3.5, // 模拟相似度评分 (基于排名)
            category: 'trending',
            source: 'clawhub',
            install: 'clawdhub',
            updatedAt: skill.updatedAt
          });
        });
      }
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
        
        if (ghRes.status === 403) break;
        
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

    // 3. skill.sh Top 10 (GitHub 搜索 skill.sh 相关)
    try {
      const skillShKeywords = ['skill.sh', 'agent skill', 'openclaw skill', 'ai agent'];
      const ssSeen = new Set();
      
      for (const kw of skillShKeywords) {
        try {
          const ghRes = await fetch(
            `https://api.github.com/search/repositories?q=skill.sh+${encodeURIComponent(kw)}+in:readme&sort=stars&order=desc&per_page=10`,
            { 
              headers: ghHeaders,
              next: { revalidate: 3600 }
            }
          );
          
          if (ghRes.status === 403) break;
          
          if (ghRes.ok) {
            const data = await ghRes.json();
            (data.items || []).forEach(repo => {
              if (!ssSeen.has(repo.id)) {
                ssSeen.add(repo.id);
                rankings.skillssh.push({
                  name: repo.name.replace(/[-_](skill|skills)$/i, ''),
                  desc: `[skill.sh] ${repo.description || repo.name}`,
                  repo: repo.full_name,
                  stars: repo.stargazers_count,
                  forks: repo.forks_count,
                  source: 'skillssh',
                  install: 'git',
                  url: repo.html_url
                });
              }
            });
          }
        } catch (e) {
          console.warn(`skill.sh search failed for ${kw}:`, e.message);
        }
      }
      
      rankings.skillssh = rankings.skillssh
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 10);
    } catch (e) {
      console.warn('skill.sh API error:', e.message);
    }

    // 4. Trending - 综合排名 (合并三个来源)
    const trendingMap = new Map();
    
    rankings.clawhub.forEach((skill, i) => {
      trendingMap.set(`clawhub:${skill.name}`, {
        ...skill,
        rank: i + 1,
        trendingScore: (10 - i) * 10 + 3.5 * 15
      });
    });
    
    rankings.github.forEach((skill, i) => {
      const key = `clawhub:${skill.name}`;
      const existing = trendingMap.get(key);
      if (existing) {
        existing.trendingScore += (10 - i) * 3 + Math.log10((skill.stars || 0) + 1) * 5;
        existing.githubStars = skill.stars;
      } else {
        trendingMap.set(key, {
          ...skill,
          rank: i + 1,
          trendingScore: (10 - i) * 6 + Math.log10((skill.stars || 0) + 1) * 12
        });
      }
    });
    
    rankings.skillssh.forEach((skill, i) => {
      const key = `clawhub:${skill.name}`;
      const existing = trendingMap.get(key);
      if (existing) {
        existing.trendingScore += (10 - i) * 2 + Math.log10((skill.stars || 0) + 1) * 3;
      } else {
        trendingMap.set(key, {
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
        skillssh: rankings.skillssh.length,
        trending: rankings.trending.length
      },
      rankings
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
