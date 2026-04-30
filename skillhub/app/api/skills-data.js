// Skills 数据 - xiaoxi-skills 重构版
// 更新: 2026-04-30
// 分类: WORKSPACE | OPENCLAW
// 安装方式: cp 命令 (skill-lock.json 的 skill 指向仓库)

const API_BASE = '/api';

// ============ WORKSPACE Skills ============
// 路径: /root/.openclaw/workspace/skills/
const WORKSPACE_SKILLS = [
  { name: 'agent-reach', desc: '全平台接入 - Twitter/X, Reddit, YouTube, GitHub, Bilibili, 小红书, 抖音等17+平台' },
  { name: 'avatar-helper', desc: '头像助手 - 帮助生成和管理头像' },
  { name: 'chrome-cdp', desc: 'Chrome CDP 控制 - 访问已登录的 Chrome 标签页' },
  { name: 'clawbridge', desc: '连接 Clawo 生态系统的桥接技能' },
  { name: 'clawfeed', desc: 'ClawFeed 资讯聚合技能' },
  { name: 'clawteam', desc: '多 Agent 团队协调 - 创建 agent 团队, 并行任务, 依赖管理' },
  { name: 'coding-delegate-agent', desc: '编码委托 Agent - 委托 Codex/Claude Code/Pi agents 执行编码任务' },
  { name: 'cognitive-memory', desc: '人类式认知记忆系统 - 编码/巩固/衰退/检索, 多层架构' },
  { name: 'companion-lobster', desc: '陪伴型小龙虾 - 陪你刷抖音、看电影、听音乐、聊天分享' },
  { name: 'create-agent-skills', desc: '创建有效 Skills 指南 - 创建/编辑/改进 SKILL.md 文件' },
  { name: 'elite-longterm-memory', desc: '终极 AI Agent 记忆系统 - WAL协议+向量搜索+git笔记' },
  { name: 'epro-memory', desc: 'Epro Memory 系统' },
  { name: 'fabric', desc: 'Fabric - 200+ 精心设计的 AI Prompt 模板' },
  { name: 'files', desc: '文件管理工具' },
  { name: 'github', desc: 'GitHub CLI - gh issue/pr/run/api 操作' },
  { name: 'memory-curator', desc: '记忆策展人 - 日志记录/会话保存/知识提取' },
  { name: 'memu', desc: '内存工具 - 内存管理和优化' },
  { name: 'minimax-docx', desc: 'DOCX 文档创建 - 使用 OpenXML SDK (.NET) 创建/编辑 Word 文档' },
  { name: 'minimax-pdf', desc: 'PDF 生成 - 专业 PDF 创建和格式化' },
  { name: 'minimax-xlsx', desc: 'Excel 表格 - .xlsx/.xlsm/.csv 文件处理' },
  { name: 'multi-search-engine', desc: '多搜索引擎集成 - 17个引擎(8中文+9英文)+高级搜索' },
  { name: 'myclaw-backup', desc: 'MyClaw 备份恢复 - 配置/记忆/skills/workspace 快照' },
  { name: 'newsnow', desc: '聚合新闻源 - 66个来源44平台趋势新闻' },
  { name: 'obsidian', desc: 'Obsidian 笔记 - 自动化笔记管理' },
  { name: 'openclaw-auto-updater', desc: 'OpenClaw 自动更新 - 定时升级和更新报告' },
  { name: 'openclaw-evolution', desc: 'OpenClaw 进化指南 - 新用户设置和成长路径' },
  { name: 'openclaw-plugin-sdk-migration', desc: 'OpenClaw 插件 SDK 迁移工具' },
  { name: 'openclaw-qa', desc: 'OpenClaw 问答技能' },
  { name: 'openclaw-tavily-search', desc: 'Tavily 搜索 - AI 优化的 web 研究搜索' },
  { name: 'pentest-learning-skill', desc: '渗透测试学习技能' },
  { name: 'planning-with-files', desc: '文件规划 - Manus 风格任务/发现/进度文件' },
  { name: 'powerpoint-pptx', desc: 'PPT 生成 - python-pptx 创建编辑演示文稿' },
  { name: 'pptx-generator', desc: 'PPT 生成器 - PptxGenJS 创建演示文稿' },
  { name: 'pr-review', desc: 'PR 审查 - 审查/合并 OpenClaw PRs/issues' },
  { name: 'proactive-solvr', desc: '主动解决者 - 灵魂持久化+Solvr集体知识+自愈心跳' },
  { name: 'self-driven', desc: '自我驱动型 Agent' },
  { name: 'self-improving-agent', desc: '自我进化 Agent - 从错误中学习持续改进' },
  { name: 'self-improving', desc: '自我改进 - 自反思+自批评+从纠正中学习' },
  { name: 'self-reflection', desc: '自我反思 - 通过结构化反思持续改进' },
  { name: 'skill-creator', desc: '技能创建 - 创建/编辑/改进/整理 SKILL.md 文件' },
  { name: 'stealth-browser', desc: '反检测浏览器 - Cloudflare bypass/CAPTCHA/持久会话' },
  { name: 'superpowers', desc: 'Superpowers - OpenClaw 超级能力集合' },
  { name: 'web-deploy-github', desc: 'GitHub Pages 部署 - 单页静态网站自动部署' },
  { name: 'x-tweet-fetcher', desc: '推文获取 - 无需登录获取推文/长推/引用文章' },
];

// ============ OPENCLAW Skills ============
// 路径: /root/.openclaw/skills/
const OPENCLAW_SKILLS = [
  { name: 'agent-reach', desc: '全平台接入 - Twitter/X, Reddit, YouTube, GitHub, Bilibili 等17+平台' },
  { name: 'auto-monitor', desc: '主动监控 - 定期检查服务器健康, 主动汇报' },
  { name: 'autocli', desc: '55+ 社交/内容网站 CLI (HackerNews, Reddit, Twitter/X, Bilibili等)' },
  { name: 'building-agentskills', desc: '构建 Agent Skills 指南' },
  { name: 'clawhub', desc: 'ClawHub CLI - 搜索安装更新同步发布 skills' },
  { name: 'coding-agent', desc: '委托编码任务给 Codex/Claude Code/OpenCode/Pi agents' },
  { name: 'dna-memory', desc: 'DNA 记忆系统 - 三层架构(工作/短期/长期)+主动遗忘' },
  { name: 'find-skills', desc: '技能发现 - 搜索和安装 agent skills' },
  { name: 'gh-issues', desc: 'GitHub Issues 管理 - 获取/委托修复/打开 PR/审查' },
  { name: 'github', desc: 'GitHub CLI - gh issue/pr/run/api 操作' },
  { name: 'healthcheck', desc: '安全检查 - SSH/防火墙/更新/暴露/cron/风险态势' },
  { name: 'hermes-agent', desc: 'Hermes Agent - OpenClaw 生态代理' },
  { name: 'holographic-memory', desc: '全息记忆 - SQLite持久化+信任评分+HRR向量相似度' },
  { name: 'lyric-sense', desc: '歌词音乐 - 歌词查看和分析' },
  { name: 'movie-subtitle-viewer', desc: '电影字幕查看器' },
  { name: 'openclaw-evolution', desc: 'OpenClaw 进化指南 - 新用户设置和成长路径' },
  { name: 'openclaw-pr-maintainer', desc: 'PR 维护 - 审查/分类/关闭/评论/合并 PRs' },
  { name: 'scrapling-official', desc: '网页抓取 - Scrapling 反爬虫 bypass + Cloudflare Turnstile' },
  { name: 'self-health-monitor', desc: '健康监控 - PCEC执行/memory使用/子Agent活跃度' },
  { name: 'self-improving-agent', desc: '自我进化 Agent - 从错误中学习持续改进' },
  { name: 'skill-creator', desc: '技能创建 - 创建/编辑/改进/整理 SKILL.md 文件' },
  { name: 'summarize', desc: '文本摘要 - 总结/转录 URLs/YouTube/播客/文章/PDF' },
  { name: 'taskflow-inbox-triage', desc: '任务流收件箱分类 - 意图路由+等待回复+汇总' },
  { name: 'taskflow', desc: '任务流编排 - 多步骤 detached 任务协调' },
];

// ============ 安装命令 ============
const SKILL_SOURCES = {
  // WORKSPACE skills - 源路径
  workspace: '/root/.openclaw/workspace/skills',
  // OPENCLAW skills - 源路径
  openclaw: '/root/.openclaw/skills',
};

// 生成带安装命令的完整列表
function buildSkillList(source, skills) {
  return skills.map(s => ({
    ...s,
    source,
    install: `cp -r ${SKILL_SOURCES[source]}/${s.name} ~/.openclaw/skills/`,
    url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/${s.name}`
  }));
}

const ALL_SKILLS = [
  ...buildSkillList('workspace', WORKSPACE_SKILLS),
  ...buildSkillList('openclaw', OPENCLAW_SKILLS),
];

const STATS = {
  workspace: WORKSPACE_SKILLS.length,
  openclaw: OPENCLAW_SKILLS.length,
  total: ALL_SKILLS.length
};

export { WORKSPACE_SKILLS, OPENCLAW_SKILLS, ALL_SKILLS, STATS, API_BASE };
export default ALL_SKILLS;