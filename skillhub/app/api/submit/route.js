// Submit API - 处理 Skill 提交，创建 PR
// POST /api/submit

export async function POST(request) {
  try {
    const body = await request.json();
    let { skillName, skillDesc, skillContent, githubToken, submitterName, submitterEmail } = body;

    // 如果 body 中没有 token，尝试从 cookie 中读取
    if (!githubToken) {
      githubToken = request.cookies.get('gh_token')?.value;
    }

    // 验证必需字段
    if (!skillName?.trim()) {
      return Response.json({ success: false, error: 'Skill 名称不能为空' }, { status: 400 });
    }
    if (!skillDesc?.trim()) {
      return Response.json({ success: false, error: 'Skill 描述不能为空' }, { status: 400 });
    }
    if (!skillContent?.trim()) {
      return Response.json({ success: false, error: 'SKILL.md 内容不能为空' }, { status: 400 });
    }

    // 验证 SKILL.md 格式
    if (!skillContent.includes('name') && !skillContent.includes('## name')) {
      return Response.json({ success: false, error: 'SKILL.md 必须包含 name 字段' }, { status: 400 });
    }
    if (!skillContent.includes('description') && !skillContent.includes('## description')) {
      return Response.json({ success: false, error: 'SKILL.md 必须包含 description 字段' }, { status: 400 });
    }

    // 如果没有 GitHub Token，返回手动提交流程
    if (!githubToken?.trim()) {
      // 生成 markdown 格式的提交指南
      const manualGuide = generateManualGuide({ skillName, skillDesc, skillContent, submitterName, submitterEmail });
      return Response.json({
        success: true,
        manual: true,
        guide: manualGuide,
        message: '请手动提交 PR',
        steps: [
          '1. Fork xiaoxi-skills 仓库',
          '2. 创建新分支',
          '3. 在 skillhub/data/workspace/ 目录下创建你的 Skill 目录',
          '4. 添加 SKILL.md',
          '5. 提交 PR'
        ]
      });
    }

    // 使用 GitHub API 创建 PR
    const REPO_OWNER = 'adminlove520';
    const REPO_NAME = 'xiaoxi-skills';
    const BRANCH_NAME = `feat/add-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    // 1. 检查 Skill 是否已存在
    const checkRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/skillhub/data/workspace/${skillName}`, { headers });
    if (checkRes.ok) {
      return Response.json({ 
        success: false, 
        error: `Skill "${skillName}" 已存在。请尝试使用不同的名称，或直接在 GitHub 上提交 PR 进行修改。` 
      }, { status: 400 });
    }

    // 2. 获取仓库信息 (获取默认分支)
    const repoRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { headers });
    if (!repoRes.ok) {
      const errorData = await repoRes.json().catch(() => ({}));
      return Response.json({ 
        success: false, 
        error: `无法访问 GitHub 仓库: ${errorData.message || repoRes.statusText}。请检查 Token 是否有效且具有 repo 权限。` 
      }, { status: repoRes.status });
    }
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch;

    // 3. 获取最新 commit SHA
    const refRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${defaultBranch}`, { headers });
    if (!refRes.ok) {
      const errorData = await refRes.json().catch(() => ({}));
      return Response.json({ 
        success: false, 
        error: `获取主分支信息失败: ${errorData.message || refRes.statusText}` 
      }, { status: 500 });
    }
    const refData = await refRes.json();
    const latestSha = refData.object.sha;

    // 4. 创建新分支
    const branchRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${BRANCH_NAME}`,
        sha: latestSha
      })
    });
    if (!branchRes.ok) {
      const errorData = await branchRes.json().catch(() => ({}));
      return Response.json({ 
        success: false, 
        error: `创建分支失败: ${errorData.message || branchRes.statusText}` 
      }, { status: 500 });
    }

    // 5. 创建 Skill 目录和文件
    const skillDir = `skillhub/data/workspace/${skillName}`;
    const fileContent = Buffer.from(skillContent).toString('base64');

    const fileRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${skillDir}/SKILL.md`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `feat: add ${skillName} skill\n\nSubmitted by ${submitterName || 'anonymous'}`,
        content: fileContent,
        branch: BRANCH_NAME
      })
    });

    if (!fileRes.ok) {
      const errorData = await fileRes.json().catch(() => ({}));
      return Response.json({ 
        success: false, 
        error: `无法创建文件: ${errorData.message || fileRes.statusText}` 
      }, { status: 500 });
    }

    // 6. 创建 Pull Request
    const prRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: `feat: add ${skillName} skill`,
        body: generatePRBody({ skillName, skillDesc, submitterName, submitterEmail }),
        head: BRANCH_NAME,
        base: defaultBranch
      })
    });

    if (!prRes.ok) {
      const errorData = await prRes.json().catch(() => ({}));
      return Response.json({ 
        success: false, 
        error: `无法创建 PR: ${errorData.message || prRes.statusText}` 
      }, { status: 500 });
    }

    const prData = await prRes.json();

    return Response.json({
      success: true,
      prUrl: prData.html_url,
      prNumber: prData.number,
      message: 'PR 创建成功！'
    });

  } catch (e) {
    console.error('Submit API error:', e);
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

function generatePRBody({ skillName, skillDesc, submitterName, submitterEmail }) {
  return `
## 📦 Skill: ${skillName}

### 描述
${skillDesc}

### 提交者
${submitterName ? `@${submitterName}` : 'anonymous'}${submitterEmail ? `\nEmail: ${submitterEmail}` : ''}

---

_此 PR 通过 xiaoxi-skills Hub 提交_
  `.trim();
}

function generateManualGuide({ skillName, skillDesc, skillContent, submitterName, submitterEmail }) {
  return `
# 📦 Skill 提交指南: ${skillName}

## 描述
${skillDesc}

## 提交步骤

### 1. Fork 仓库
访问 https://github.com/adminlove520/xiaoxi-skills，点击 Fork 按钮

### 2. 创建分支
\`\`\`bash
git checkout -b feat/add-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}
\`\`\`

### 3. 添加文件
在 \`skillhub/data/workspace/${skillName}/\` 目录下创建 \`SKILL.md\`，内容如下：

\`\`\`markdown
${skillContent}
\`\`\`

### 4. 提交并推送
\`\`\`bash
git add .
git commit -m "feat: add ${skillName} skill"
git push origin feat/add-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}
\`\`\`

### 5. 创建 PR
在 GitHub 上提交 Pull Request

---

提交者: ${submitterName || 'anonymous'}
${submitterEmail ? `邮箱: ${submitterEmail}` : ''}
  `.trim();
}
