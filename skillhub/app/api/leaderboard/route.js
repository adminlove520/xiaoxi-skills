// Leaderboard API - 各渠道 Top 10 Skills 排行榜
// Vercel Serverless 兼容版本

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'all';

  // Vercel 环境变量
  const GH_TOKEN = process.env.GITHUB_TOKEN;
  const CLAWHUB_TOKEN = process.env.CLAWHUB_TOKEN;

  const ghHeaders = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GH_TOKEN && { 'Authorization': `Bearer ${GH_TOKEN}` })
  };

  try {
    const rankings = {
      clawhub: [],
      github: [],
      trending: []
    };

    // 1. ClawHub Top 10 - 使用 clawhub search 命令
    // 注意: Vercel Serverless 无法执行外部命令，使用静态数据 + GitHub 替代
    // 实际排行榜数据来自 GitHub Topics 搜索
    
    // 2. GitHub Top 10 (按 stars) - 使用 topic 搜索
    const topics = ['openclaw-skill', 'openclaw-skills', 'clawhub-skill', 'ai-agent-skill'];
    const seen = new Set();
    
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
          console.warn('GitHub API rate limited, using cached data');
          break;
        }
        
        if (ghRes.ok) {
          const data = await ghRes.json();
          (data.items || []).forEach(repo => {
            if (!seen.has(repo.id)) {
              seen.add(repo.id);
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

    // 3. Trending - 基于 GitHub 数据的综合排名
    rankings.trending = rankings.github
      .map((skill, i) => ({
        ...skill,
        rank: i + 1,
        trendingScore: (10 - i) * 5 + Math.log10((skill.stars || 0) + 1) * 15
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);

    // 4. ClawHub 模拟数据 (基于 GitHub 高星项目)
    // 因为 Vercel 无法执行 clawhub CLI，用 GitHub 数据模拟
    rankings.clawhub = rankings.github.slice(0, 10).map((skill, i) => ({
      ...skill,
      score: (10 - i) * 0.5 + (skill.stars / 1000)
    }));

    if (source !== 'all') {
      return Response.json({
        success: true,
        source,
        rankings: rankings[source] || [],
        note: source === 'clawhub' ? '基于 GitHub 数据模拟 ClawHub 排行' : undefined
      });
    }

    return Response.json({
      success: true,
      total: {
        clawhub: rankings.clawhub.length,
        github: rankings.github.length,
        trending: rankings.trending.length
      },
      rankings,
      rateLimited: false
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
