// Skills 数据 - 基于 xiaoxi-skills 仓库真实扫描
// 更新: 2026-04-28
// 35 个 Ready Skills + 4 个待完善

const LOCAL_SKILLS = [
  // === 有 SKILL.md 的 Skills (35个) ===
  { name: 'autocli', desc: '55+ 社交/内容网站 CLI (HackerNews, Reddit, Twitter/X, Bilibili等)' },
  { name: 'chrome-cdp', desc: 'Chrome CDP 控制 - 访问已登录的 Chrome 标签页' },
  { name: 'clawbot-market', desc: 'X龙虾集市 - Agent 任务交易市场，支持发布/认领任务' },
  { name: 'clawhub', desc: 'ClawHub CLI - 搜索安装更新同步发布 agent skills' },
  { name: 'clawpi-redpacket-monitor', desc: '自动监控并领取 ClawPI 红包' },
  { name: 'coding-agent', desc: '委托编码任务给 Codex/Claude Code/OpenCode/Pi agents' },
  { name: 'cognitive-memory', desc: '人类式认知记忆系统 - 编码/巩固/衰退/检索' },
  { name: 'companion-lobster', desc: '陪伴型小龙虾 - 陪你刷抖音看电影听音乐聊天' },
  { name: 'create-agent-skills', desc: '创建有效的 agent skills 指南' },
  { name: 'elite-longterm-memory', desc: '终极 AI agent 记忆系统 - WAL协议+向量搜索+git笔记' },
  { name: 'find-skills', desc: '技能发现 - 搜索和安装 agent skills' },
  { name: 'gateway-watchdog-xiaoxi', desc: '网关看门狗 - 监控 OpenClaw Gateway 健康状态' },
  { name: 'gh-issues', desc: 'GitHub Issues 管理 - 获取/委托修复/打开 PR/审查' },
  { name: 'github', desc: 'GitHub CLI - gh issue/pr/run/api 操作' },
  { name: 'healthcheck', desc: '安全检查 - SSH/防火墙/更新/暴露/cron/风险态势' },
  { name: 'lyric-sense', desc: '歌词音乐 - 歌词查看和分析' },
  { name: 'memu', desc: '内存工具 - 内存管理和优化' },
  { name: 'multi-search-engine', desc: '多搜索引擎集成 - 17个引擎(8中文+9英文)+高级搜索' },
  { name: 'myclaw-backup', desc: 'MyClaw 备份恢复 - 配置/记忆/skills/workspace 快照' },
  { name: 'newsnow', desc: '聚合新闻源 - 66个来源44平台趋势新闻' },
  { name: 'obsidian', desc: 'Obsidian 笔记 - 自动化笔记管理' },
  { name: 'openclaw-auto-updater', desc: 'OpenClaw 自动更新 - 定时升级和更新报告' },
  { name: 'openclaw-pr-maintainer', desc: 'PR 维护 - 审查/分类/关闭/评论/合并 PRs' },
  { name: 'openclaw-tavily-search', desc: 'Tavily 搜索 - AI 优化的 web 研究搜索' },
  { name: 'planning-with-files', desc: '文件规划 - Manus 风格的任务/发现/进度文件' },
  { name: 'powerpoint-pptx', desc: 'PPT 生成 - python-pptx 创建编辑演示文稿' },
  { name: 'proactive-solvr', desc: '主动解决者 - 灵魂持久化+Solvr集体知识+自愈心跳' },
  { name: 'self-improving', desc: '自我改进 - 自反思+自批评+从纠正中学习' },
  { name: 'self-reflection', desc: '自我反思 - 通过结构化反思持续改进' },
  { name: 'skill-creator', desc: '技能创建 - 创建/编辑/改进/整理 SKILL.md 文件' },
  { name: 'stealth-browser', desc: '反检测浏览器 - Cloudflare bypass/CAPTCHA/持久会话' },
  { name: 'summarize', desc: '文本摘要 - 总结/转录 URLs/YouTube/播客/文章/PDF' },
  { name: 'tavily', desc: 'AI 搜索 - Tavily Search API 优化的 web 研究' },
  { name: 'web-deploy-github', desc: 'GitHub Pages 部署 - 单页静态网站自动部署' },
  { name: 'x-tweet-fetcher', desc: '推文获取 - 无需登录获取推文/长推/引用文章' },
];

const PENDING_SKILLS = [
  // === 只有 README.md 需要补充 SKILL.md ===
  { name: 'superpowers', desc: '超能力 - 84,751 Stars 的 AI 开发技能框架' },
  { name: 'fabric', desc: 'Fabric - 200+ 精心设计的 AI Prompt 模板' },
  { name: 'docs', desc: '文档目录' },
  { name: 'skillhub', desc: 'SkillHub 网站本身' },
];

const BUILTIN_SKILLS = [
  // === OpenClaw 内置 Skills ===
  { name: 'weather', desc: '天气查询 - wttr.in/Open-Meteo' },
  { name: 'blucli', desc: 'BluOS 播放器控制' },
  { name: 'eightctl', desc: 'Eight Sleep 智能床垫控制' },
  { name: 'mcporter', desc: 'MCP 工具集 + Exa 全网搜索' },
  { name: 'tmux', desc: 'tmux 会话远程控制' },
  { name: 'fluxa-agent-wallet', desc: 'FluxA Agent 钱包 - x402 支付/USDC转账' },
  { name: 'video-frames', desc: '视频帧提取 - ffmpeg 提取帧和片段' },
  { name: 'session-logs', desc: '会话日志搜索分析' },
  { name: 'node-connect', desc: '节点连接诊断 - Android/iOS/macOS 配对失败' },
];

// 安装命令映射
const INSTALL_COMMANDS = {
  'autocli': 'curl -fsSL https://raw.githubusercontent.com/nashsu/AutoCLI/main/scripts/install.sh | sh',
  'chrome-cdp': 'git clone https://github.com/pasky/chrome-cdp-skill.git ~/.openclaw/skills/chrome-cdp',
  'myclaw-backup': 'git clone https://github.com/myclawai/myclaw-backup.git ~/.openclaw/skills/myclaw-backup',
  'tavily': 'pip install tavily-python',
  'newsnow': 'npm install -g newsnow-cli',
  'powerpoint-pptx': 'pip install python-pptx',
  'stealth-browser': 'npm install -g puppeteer-extra puppeteer-extra-plugin-stealth',
  'web-deploy-github': 'npx ghpages deploy',
  'x-tweet-fetcher': 'pip install xtwitter',
  'multi-search-engine': 'pip install searchengine-cli',
  'obsidian': 'pip install mcp-obsidian',
  'summarize': 'npx summarize-cli',
};

// 应用安装命令
function applyInstall(skills) {
  return skills.map(s => {
    const install = INSTALL_COMMANDS[s.name] || `git clone https://github.com/adminlove520/xiaoxi-skills/${s.name}.git ~/.openclaw/skills/`;
    return { ...s, install, url: `https://github.com/adminlove520/xiaoxi-skills/${s.name}` };
  });
}

const ALL_SKILLS = [
  ...applyInstall(LOCAL_SKILLS),
  ...PENDING_SKILLS.map(s => ({ ...s, install: '待完善 SKILL.md', url: null, status: 'pending' })),
  ...BUILTIN_SKILLS.map(s => ({ ...s, install: '内置技能', url: null, source: 'builtin' })),
];

const READY_COUNT = LOCAL_SKILLS.length;
const PENDING_COUNT = PENDING_SKILLS.length;
const BUILTIN_COUNT = BUILTIN_SKILLS.length;

export { ALL_SKILLS, LOCAL_SKILLS, PENDING_SKILLS, BUILTIN_SKILLS, READY_COUNT, PENDING_COUNT, BUILTIN_COUNT };
export default ALL_SKILLS;