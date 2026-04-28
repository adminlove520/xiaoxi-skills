// Skills 数据 - 真实安装命令和来源
// 包含 workspace(44) + openclaw(14) + clawhub(20) = 78 个 Skills

// 真实安装命令映射 (只针对有外部来源的)
const REAL_INSTALL_COMMANDS = {
  'agent-reach': { install: 'pip install https://github.com/Panniantong/agent-reach/archive/main.zip', url: 'https://github.com/Panniantong/agent-reach' },
  'autocli': { install: 'curl -fsSL https://raw.githubusercontent.com/nashsu/AutoCLI/main/scripts/install.sh | sh', url: 'https://github.com/nashsu/AutoCLI' },
  'chrome-cdp': { install: 'git clone https://github.com/pasky/chrome-cdp-skill.git', url: 'https://github.com/pasky/chrome-cdp-skill' },
  'clawbot-market': { install: 'git clone https://github.com/adminlove520/clawbot-market.git', url: 'https://github.com/adminlove520/clawbot-market' },
  'clawbridge': { install: 'curl -sL https://clawbridge.app/install.sh | bash', url: 'https://github.com/dreamwing/clawbridge' },
  'coding-agent': { install: 'npm install -g @mariozechner/pi-coding-agent', url: 'https://www.npmjs.com/package/@mariozechner/pi-coding-agent' },
  'coding-delegate-agent': { install: 'npm install -g @mariozechner/pi-coding-agent', url: 'https://www.npmjs.com/package/@mariozechner/pi-coding-agent' },
  'companion-lobster': { install: 'git clone https://github.com/adminlove520/companion-lobster.git', url: 'https://github.com/adminlove520/companion-lobster' },
  'find-skills': { install: 'npx skills add <package>', url: 'https://skills.sh/' },
  'holographic-memory': { install: 'git clone https://github.com/adminlove520/holographic-memory', url: 'https://github.com/adminlove520/holographic-memory' },
  'lobster-cultivation': { install: 'git clone https://github.com/adminlove520/lobster-cultivation', url: 'https://github.com/adminlove520/lobster-cultivation' },
  'lyric-sense': { install: 'git clone https://github.com/adminlove520/lyric-sense', url: 'https://github.com/adminlove520/lyric-sense' },
  'self-improving-agent': { install: 'git clone https://github.com/peterskoett/self-improving-agent.git ~/.openclaw/skills/', url: 'https://github.com/peterskoett/self-improving-agent' },
  'tavily': { install: 'pip install tavily-python', url: 'https://github.com/tavily/tavily-python' },
  'powerpoint-pptx': { install: 'pip install python-pptx', url: 'https://github.com/scanny/python-pptx' },
  'stealth-browser': { install: 'npm install -g puppeteer-extra puppeteer-extra-plugin-stealth', url: 'https://github.com/berstard/puppeteer-extra' },
  'newsnow': { install: 'npm install -g newsnow-cli', url: 'https://www.npmjs.com/package/newsnow-cli' },
  'mcporter': { install: 'npm install -g @modelcontextprotocol/portable', url: 'https://www.npmjs.com/package/@modelcontextprotocol/portable' },
  'fluxa-agent-wallet': { install: 'npx fluxa wallet', url: 'https://fluxa.ai/' },
  'blucli': { install: 'npm install -g blucli', url: 'https://www.npmjs.com/package/blucli' },
  'eightctl': { install: 'pip install eightctl', url: 'https://pypi.org/project/eightctl/' },
  'minimax-docx': { install: 'pip install python-docx', url: 'https://pypi.org/project/python-docx/' },
  'minimax-pdf': { install: 'pip install reportlab', url: 'https://pypi.org/project/reportlab/' },
  'minimax-xlsx': { install: 'pip install openpyxl', url: 'https://pypi.org/project/openpyxl/' },
  'healthcheck': { install: 'git clone https://github.com/adminlove520/healthcheck-skill.git', url: 'https://github.com/adminlove520/healthcheck-skill' },
  'gh-issues': { install: 'gh extension install https://github.com/cli/gh-ext', url: 'https://github.com/cli/gh-ext' },
  'x-tweet-fetcher': { install: 'pip install xtwitter', url: 'https://pypi.org/project/xtwitter/' },
  'scrapling-official': { install: 'pip install scrapling', url: 'https://github.com/D4Vinci/Scrapling' },
  'clipboard-manager': { install: 'npm install -g clipboard-manager', url: 'https://www.npmjs.com/package/clipboard-manager' },
  'memory-curator': { install: 'git clone https://github.com/adminlove520/memory-curator.git', url: 'https://github.com/adminlove520/memory-curator' },
  'taskflow': { install: 'npm install -g @taskflow/cli', url: 'https://www.npmjs.com/package/@taskflow/cli' },
  'web-deploy-github': { install: 'npx ghpages deploy', url: 'https://github.com/gitname/react-gh-pages' },
  'pptx-generator': { install: 'npm install -g pptxgenjs', url: 'https://www.npmjs.com/package/pptxgenjs' },
  'obsidian': { install: 'pip install mcp-obsidian', url: 'https://github.com/28mm/obsidian-mcp' },
  'multi-search-engine': { install: 'pip install searchengine-cli', url: 'https://pypi.org/project/searchengine-cli/' },
};

// 内置技能（无外部安装命令，显示为内置）
const BUILTIN_SKILLS = new Set([
  'dna-memory', 'cognitive-memory', 'self-reflection', 'self-improving',
  'gateway-watchdog-xiaoxi', 'openclaw-evolution', 'openclaw-auto-updater',
  'openclaw-pr-maintainer', 'openclaw-tavily-search', 'create-agent-skills',
  'myclaw-backup', 'clawhub', 'self-health-monitor', 'summarize',
  'planning-with-files', 'taskflow-inbox-triage', 'pr-review', 'avatar-helper',
  'memory', 'config', 'archive', 'clawpi-redpacket-monitor',
  'ai-mentor-xiaoxi', 'MetaClaw', 'Claude-Code-Universe', 'ClawTeam-OpenClaw',
  'cyber-tomb', 'babyCare', 'hermes-agent-self-evolution', 'nutri-baby',
]);

const STATIC_SKILLS = [
  // ==================== WORKSPACE Skills (44个) ====================
  { name: 'agent-reach', desc: '全平台接入 (Twitter/Reddit/YouTube/B站等)', source: 'workspace', install: null, url: null },
  { name: 'auto-monitor', desc: '主动监控系统状态', source: 'workspace', install: null, url: null },
  { name: 'autocli', desc: '55+ 社交/内容网站 CLI', source: 'workspace', install: null, url: null },
  { name: 'clawteam', desc: '多 Agent 团队协调', source: 'workspace', install: null, url: null },
  { name: 'coding-delegate-agent', desc: '编码委托 Agent', source: 'workspace', install: null, url: null },
  { name: 'memory-curator', desc: '记忆策展人', source: 'workspace', install: null, url: null },
  { name: 'minimax-docx', desc: 'DOCX 文档创建', source: 'workspace', install: null, url: null },
  { name: 'minimax-pdf', desc: 'PDF 生成', source: 'workspace', install: null, url: null },
  { name: 'minimax-xlsx', desc: 'Excel 表格', source: 'workspace', install: null, url: null },
  { name: 'movie-subtitle-viewer', desc: '电影字幕查看', source: 'workspace', install: null, url: null },
  { name: 'openclaw-evolution', desc: '进化指南', source: 'workspace', install: null, url: null },
  { name: 'openclaw-plugin-sdk-migration', desc: '插件 SDK 迁移', source: 'workspace', install: null, url: null },
  { name: 'pptx-generator', desc: 'PPT 生成器', source: 'workspace', install: null, url: null },
  { name: 'pr-review', desc: 'PR 审查', source: 'workspace', install: null, url: null },
  { name: 'taskflow', desc: '任务流编排', source: 'workspace', install: null, url: null },
  { name: 'taskflow-inbox-triage', desc: '收件箱分类', source: 'workspace', install: null, url: null },
  { name: 'web-deploy-github', desc: 'GitHub Pages 部署', source: 'workspace', install: null, url: null },
  { name: 'x-tweet-fetcher', desc: '推文获取', source: 'workspace', install: null, url: null },
  { name: 'find-skills', desc: '技能发现', source: 'workspace', install: null, url: null },
  { name: 'dna-memory', desc: 'DNA 记忆系统', source: 'workspace', install: null, url: null },
  { name: 'holographic-memory', desc: '全息记忆', source: 'workspace', install: null, url: null },
  { name: 'lyric-sense', desc: '歌词音乐', source: 'workspace', install: null, url: null },
  { name: 'gh-issues', desc: 'GitHub Issues 管理', source: 'workspace', install: null, url: null },
  { name: 'healthcheck', desc: '安全检查', source: 'workspace', install: null, url: null },
  { name: 'self-health-monitor', desc: '健康监控', source: 'workspace', install: null, url: null },
  { name: 'self-improving', desc: '自我改进', source: 'workspace', install: null, url: null },
  { name: 'summarize', desc: '文本摘要', source: 'workspace', install: null, url: null },
  { name: 'planning-with-files', desc: '文件规划', source: 'workspace', install: null, url: null },
  { name: 'openclaw-pr-maintainer', desc: 'PR 维护', source: 'workspace', install: null, url: null },
  { name: 'obsidian', desc: 'Obsidian 笔记', source: 'workspace', install: null, url: null },
  { name: 'github', desc: 'GitHub CLI', source: 'workspace', install: null, url: null },
  { name: 'scrapling-official', desc: '智能爬虫', source: 'workspace', install: null, url: null },
  { name: 'openclaw-auto-updater', desc: '自动更新', source: 'workspace', install: null, url: null },
  { name: 'myclaw-backup', desc: 'MyClaw 备份', source: 'workspace', install: null, url: null },
  { name: 'clawhub', desc: 'ClawHub CLI', source: 'workspace', install: null, url: null },
  { name: 'create-agent-skills', desc: '创建 Agent Skills', source: 'workspace', install: null, url: null },
  { name: 'openclaw-tavily-search', desc: 'Tavily 搜索', source: 'workspace', install: null, url: null },
  { name: 'clawpi-redpacket-monitor', desc: '红包监控', source: 'workspace', install: null, url: null },
  { name: 'gateway-watchdog-xiaoxi', desc: '网关看门狗', source: 'workspace', install: null, url: null },
  { name: 'cognitive-memory', desc: '认知记忆系统', source: 'workspace', install: null, url: null },
  { name: 'coding-agent', desc: '编码 Agent', source: 'workspace', install: null, url: null },
  { name: 'self-improving-agent', desc: '自我进化 Agent', source: 'workspace', install: null, url: null },
  { name: 'self-reflection', desc: '自我反思', source: 'workspace', install: null, url: null },
  { name: 'avatar-helper', desc: '头像助手', source: 'workspace', install: null, url: null },

  // ==================== OPENCLAW 内置 Skills (14个) ====================
  { name: 'weather', desc: '天气查询', source: 'openclaw', install: null, url: null },
  { name: 'blucli', desc: 'BluOS 播放器控制', source: 'openclaw', install: null, url: null },
  { name: 'eightctl', desc: 'Eight Sleep 智能床垫', source: 'openclaw', install: null, url: null },
  { name: 'mcporter', desc: 'MCP 工具集', source: 'openclaw', install: null, url: null },
  { name: 'newsnow', desc: '聚合新闻源', source: 'openclaw', install: null, url: null },
  { name: 'tmux', desc: 'tmux 会话控制', source: 'openclaw', install: null, url: null },
  { name: 'tavily', desc: 'AI 搜索', source: 'openclaw', install: null, url: null },
  { name: 'multi-search-engine', desc: '多搜索引擎', source: 'openclaw', install: null, url: null },
  { name: 'fluxa-agent-wallet', desc: 'FluxA 钱包', source: 'openclaw', install: null, url: null },
  { name: 'stealth-browser', desc: '反检测浏览器', source: 'openclaw', install: null, url: null },
  { name: 'video-frames', desc: '视频帧提取', source: 'openclaw', install: null, url: null },
  { name: 'skill-creator', desc: '技能创建', source: 'openclaw', install: null, url: null },
  { name: 'session-logs', desc: '会话日志', source: 'openclaw', install: null, url: null },
  { name: 'node-connect', desc: '节点连接', source: 'openclaw', install: null, url: null },

  // ==================== CLAWHUB/REPO Skills (20个) ====================
  { name: 'bird', desc: 'Twitter 发推', source: 'clawhub', install: 'clawdhub install bird', url: null },
  { name: 'powerpoint-pptx', desc: 'PPT 生成', source: 'clawhub', install: null, url: null },
  { name: 'chrome-cdp', desc: 'Chrome CDP 控制', source: 'clawhub', install: null, url: null },
  { name: 'clawbot-market', desc: 'ClawBot 市场', source: 'clawhub', install: null, url: null },
  { name: 'companion-lobster', desc: '陪伴型小龙虾', source: 'clawhub', install: null, url: null },
  { name: 'cross-bot-communication', desc: '跨 Bot 通信', source: 'clawhub', install: 'clawdhub install cross-bot-communication', url: null },
  { name: 'elite-longterm-memory', desc: '精英长期记忆', source: 'clawhub', install: null, url: null },
  { name: 'lobster-cultivation', desc: '小龙虾养殖', source: 'clawhub', install: null, url: null },
  { name: 'memu', desc: '内存工具', source: 'clawhub', install: 'clawdhub install memu', url: null },
  { name: 'pinchtab-helper', desc: '浏览器自动化', source: 'clawhub', install: null, url: null },
  { name: 'proactive-solvr', desc: '主动解决者', source: 'clawhub', install: null, url: null },
  { name: 'self-driven', desc: '自驱动', source: 'clawhub', install: null, url: null },
  { name: 'superpowers', desc: '超能力', source: 'clawhub', install: 'clawdhub install superpowers', url: null },
  { name: 'pentest-learning-skill', desc: '渗透学习', source: 'clawhub', install: null, url: null },
  { name: 'fabric', desc: 'Fabric 工具', source: 'clawhub', install: null, url: null },
  { name: 'files', desc: '文件管理', source: 'clawhub', install: null, url: null },
  { name: 'gogcli', desc: 'Google 服务 CLI', source: 'clawhub', install: null, url: null },
  { name: 'epro-memory', desc: 'EPRO 记忆', source: 'clawhub', install: null, url: null },
  { name: 'hermes-agent', desc: 'Hermes Agent', source: 'clawhub', install: null, url: null },
  { name: 'openclaw-qa', desc: '问答系统', source: 'clawhub', install: null, url: null },
];

// 应用真实安装命令
function applyRealInstallCommands(skills) {
  return skills.map(skill => {
    if (REAL_INSTALL_COMMANDS[skill.name]) {
      return {
        ...skill,
        install: REAL_INSTALL_COMMANDS[skill.name].install,
        url: REAL_INSTALL_COMMANDS[skill.name].url,
      };
    }
    // 内置技能
    if (BUILTIN_SKILLS.has(skill.name)) {
      return {
        ...skill,
        install: '内置技能 (复制到 ~/.openclaw/skills/)',
        url: null,
      };
    }
    // clawhub 默认
    if (skill.source === 'clawhub' && !skill.install) {
      return {
        ...skill,
        install: `clawdhub install ${skill.name}`,
        url: `https://clawhub.com/skills/${skill.name}`,
      };
    }
    return skill;
  });
}

const ENHANCED_SKILLS = applyRealInstallCommands(STATIC_SKILLS);

export default ENHANCED_SKILLS;
