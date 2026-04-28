// Import API - 从 GitHub URL 导入 SKILL.md
// 支持: github.com/user/repo, raw content 等

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url?.trim()) {
    return Response.json({ success: false, error: '请提供 GitHub URL' }, { status: 400 });
  }

  try {
    // 解析 GitHub URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      return Response.json({ success: false, error: '无效的 GitHub URL' }, { status: 400 });
    }

    // 尝试多个可能的 SKILL.md 路径
    const paths = [
      'SKILL.md',
      'skill.md', 
      'skills/SKILL.md',
      'skills/skill.md',
      'SKILLS.md',
    ];

    let skillContent = null;
    let foundPath = null;

    for (const path of paths) {
      const rawUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/main/${path}`;
      const res = await fetch(rawUrl, { 
        headers: { 'Accept': 'text/plain' },
        signal: AbortSignal.timeout(8000)
      });
      
      if (res.ok) {
        const content = await res.text();
        if (content.includes('name') && content.includes('description')) {
          skillContent = content;
          foundPath = path;
          break;
        }
      }
      
      // Try master branch too
      const masterUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/master/${path}`;
      const masterRes = await fetch(masterUrl, { 
        headers: { 'Accept': 'text/plain' },
        signal: AbortSignal.timeout(8000)
      });
      
      if (masterRes.ok) {
        const content = await masterRes.text();
        if (content.includes('name') && content.includes('description')) {
          skillContent = content;
          foundPath = path;
          break;
        }
      }
    }

    if (!skillContent) {
      return Response.json({ 
        success: false, 
        error: `未找到 SKILL.md (尝试了: ${paths.join(', ')})` 
      }, { status: 404 });
    }

    // 解析 SKILL.md 内容
    const parsedData = parseSkillMd(skillContent);

    return Response.json({
      success: true,
      name: parsedData.name,
      desc: parsedData.description,
      content: skillContent,
      source: `${parsed.owner}/${parsed.repo}`,
      path: foundPath
    });

  } catch (e) {
    console.error('Import API error:', e);
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

function parseGitHubUrl(url) {
  // 匹配: github.com/user/repo, user/repo, https://github.com/user/repo
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /^([^\/]+)\/([^\/]+)$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
  }
  return null;
}

function parseSkillMd(content) {
  const result = {
    name: '',
    description: ''
  };

  // 提取 name
  const nameMatch = content.match(/^#\s*name\s*$/mi) || content.match(/^name:\s*(.+)$/mi);
  if (nameMatch) {
    result.name = nameMatch[1]?.trim() || '';
  }

  // 提取 description
  const descMatch = content.match(/^#\s*description\s*$/mi) || content.match(/^description:\s*(.+)$/mi);
  if (descMatch) {
    result.description = descMatch[1]?.trim() || '';
  }

  return result;
}