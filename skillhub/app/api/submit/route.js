// Submit API - 处理 Skill 提交，创建 PR
// POST /api/submit

export async function POST(request) {
  try {
    const body = await request.json();
    const { skillName, skillDesc, skillContent, githubToken, submitterName, submitterEmail } = body;

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
          '3. 在 skills/ 目录下创建你的 Skill 目录',
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

    // 1. 获取仓库信息
    const repoRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { headers });
    if (!repoRes.ok) {
      return Response.json({ success: false, error: '无法访问仓库，请检查 Token 权限' }, { status: 401 });
    }
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch;

    // 2. 获取最新 commit SHA
    const refRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${defaultBranch}`, { headers });
    if (!refRes.ok) {
      return Response.json({ success: false, error: '无法获取仓库信息' }, { status: 500 });
    }
    const refData = await refRes.json();
    const latestSha = refData.object.sha;

    // 3. 创建新分支
    const branchRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${BRANCH_NAME}`,
        sha: latestSha
      })
    });
    if (!branchRes.ok) {
      return Response.json({ success: false, error: '无法创建分支' }, { status: 500 });
    }

    // 4. 创建 Skill 目录和文件
    const skillDir = `skills/${skillName}`;
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
      const errorData = await fileRes.json();
      return Response.json({ 
        success: false, 
        error: `无法创建文件: ${errorData.message}` 
      }, { status: 500 });
    }

    // 5. 创建 Pull Request
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
      const errorData = await prRes.json();
      return Response.json({ 
        success: false, 
        error: `无法创建 PR: ${errorData.message}` 
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
在 \`skills/${skillName}/\` 目录下创建 \`SKILL.md\`，内容如下：

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
