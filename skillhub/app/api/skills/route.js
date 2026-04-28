// Skills API - 获取 Skills 列表
// 支持: local, openclaw, pending, repo

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const SKILLS_REPO_PATH = '/root/.openclaw/workspace/xiaoxi-skills';

export async function GET(request) {
  try {
    // 扫描本地 skills
    const localSkills = await scanLocalSkills();
    
    // 构建完整列表
    const allSkills = [
      ...localSkills.map(s => ({
        name: s.name,
        desc: s.desc,
        source: 'local',
        status: s.hasSkillMd ? 'ready' : 'missing-skill-md',
        install: getInstallCmd(s.name, 'local'),
        url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/${s.name}`
      })),
      ...BUILTIN_SKILLS.map(s => ({
        name: s.name,
        desc: s.desc,
        source: 'openclaw',
        status: 'builtin',
        install: '内置技能',
        url: null
      })),
      ...PENDING_SKILLS.map(s => ({
        name: s.name,
        desc: s.desc,
        source: 'pending',
        status: 'pending',
        install: '待发布',
        url: null
      }))
    ];

    const bySource = {
      local: localSkills.length,
      openclaw: BUILTIN_SKILLS.length,
      pending: PENDING_SKILLS.length
    };

    return Response.json({
      success: true,
      source: 'static+github',
      total: allSkills.length,
      bySource,
      skills: allSkills
    });
  } catch (error) {
    console.error('Skills API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function scanLocalSkills() {
  const skills = [];
  const REAL_SKILL_DESCS = {
    'autocli': '55+ 社交/内容网站 CLI',
    'chrome-cdp': 'Chrome CDP 控制',
    'clawbot-market': 'ClawBot 市场',
    'clawhub': 'ClawHub CLI',
    'clawpi-redpacket-monitor': '红包监控',
    'coding-agent': '编码 Agent',
    'cognitive-memory': '认知记忆系统',
    'companion-lobster': '陪伴型小龙虾',
    'create-agent-skills': '创建 Agent Skills',
    'elite-longterm-memory': '精英长期记忆',
    'find-skills': '技能发现',
    'gateway-watchdog-xiaoxi': '网关看门狗',
    'gh-issues': 'GitHub Issues 管理',
    'github': 'GitHub CLI',
    'healthcheck': '安全检查',
    'lyric-sense': '歌词音乐',
    'memu': '内存工具',
    'multi-search-engine': '多搜索引擎',
    'myclaw-backup': 'MyClaw 备份',
    'newsnow': '聚合新闻源',
    'obsidian': 'Obsidian 笔记',
    'openclaw-auto-updater': '自动更新',
    'openclaw-pr-maintainer': 'PR 维护',
    'openclaw-tavily-search': 'Tavily 搜索',
    'planning-with-files': '文件规划',
    'powerpoint-pptx': 'PPT 生成',
    'proactive-solvr': '主动解决者',
    'self-improving': '自我改进',
    'self-reflection': '自我反思',
    'skill-creator': '技能创建',
    'stealth-browser': '反检测浏览器',
    'summarize': '文本摘要',
    'tavily': 'AI 搜索',
    'web-deploy-github': 'GitHub Pages 部署',
    'x-tweet-fetcher': '推文获取'
  };

  try {
    const entries = await readdir(SKILLS_REPO_PATH, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = join(SKILLS_REPO_PATH, entry.name);
        try {
          const files = await readdir(skillPath);
          const hasSkillMd = files.includes('SKILL.md');
          const hasReadme = files.includes('README.md');
          
          if (hasSkillMd || hasReadme) {
            skills.push({
              name: entry.name,
              hasSkillMd,
              hasReadme,
              desc: REAL_SKILL_DESCS[entry.name] || entry.name
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {
    console.error('Error scanning skills:', e);
  }
  return skills;
}

function getInstallCmd(name, source) {
  const REAL_COMMANDS = {
    'autocli': { install: 'curl -fsSL https://raw.githubusercontent.com/nashsu/AutoCLI/main/scripts/install.sh | sh', url: 'https://github.com/nashsu/AutoCLI' },
    'chrome-cdp': { install: 'git clone https://github.com/pasky/chrome-cdp-skill.git', url: 'https://github.com/pasky/chrome-cdp-skill' },
    'clawbot-market': { install: 'git clone https://github.com/adminlove520/clawbot-market.git', url: 'https://github.com/adminlove520/clawbot-market' },
    'coding-agent': { install: 'npm install -g @mariozechner/pi-coding-agent', url: 'https://www.npmjs.com/package/@mariozechner/pi-coding-agent' },
    'companion-lobster': { install: 'git clone https://github.com/adminlove520/companion-lobster.git', url: 'https://github.com/adminlove520/companion-lobster' },
    'find-skills': { install: 'npx skills add <package>', url: 'https://skills.sh/' },
    'healthcheck': { install: 'git clone https://github.com/adminlove520/healthcheck-skill.git', url: 'https://github.com/adminlove520/healthcheck-skill' },
    'lyric-sense': { install: 'git clone https://github.com/adminlove520/lyric-sense.git', url: 'https://github.com/adminlove520/lyric-sense' },
    'memu': { install: 'clawdhub install memu', url: 'https://clawhub.com/skills/memu' },
    'multi-search-engine': { install: 'pip install searchengine-cli', url: 'https://pypi.org/project/searchengine-cli/' },
    'newsnow': { install: 'npm install -g newsnow-cli', url: 'https://www.npmjs.com/package/newsnow-cli' },
    'obsidian': { install: 'pip install mcp-obsidian', url: 'https://github.com/28mm/obsidian-mcp' },
    'powerpoint-pptx': { install: 'pip install python-pptx', url: 'https://github.com/scanny/python-pptx' },
    'stealth-browser': { install: 'npm install -g puppeteer-extra puppeteer-extra-plugin-stealth', url: 'https://github.com/berstard/puppeteer-extra' },
    'tavily': { install: 'pip install tavily-python', url: 'https://github.com/tavily/tavily-python' },
    'web-deploy-github': { install: 'npx ghpages deploy', url: 'https://github.com/gitname/react-gh-pages' },
    'x-tweet-fetcher': { install: 'pip install xtwitter', url: 'https://pypi.org/project/xtwitter/' },
    'gh-issues': { install: 'gh extension install https://github.com/cli/gh-ext', url: 'https://github.com/cli/gh-ext' },
  };
  
  if (REAL_COMMANDS[name]) {
    return REAL_COMMANDS[name];
  }
  
  return {
    install: `git clone https://github.com/adminlove520/xiaoxi-skills/${name}.git ~/.openclaw/skills/`,
    url: `https://github.com/adminlove520/xiaoxi-skills/tree/main/${name}`
  };
}

const BUILTIN_SKILLS = [
  { name: 'weather', desc: '天气查询' },
  { name: 'blucli', desc: 'BluOS 播放器控制' },
  { name: 'eightctl', desc: 'Eight Sleep 智能床垫' },
  { name: 'mcporter', desc: 'MCP 工具集' },
  { name: 'tmux', desc: 'tmux 会话控制' },
  { name: 'fluxa-agent-wallet', desc: 'FluxA 钱包' },
  { name: 'video-frames', desc: '视频帧提取' },
  { name: 'session-logs', desc: '会话日志' },
  { name: 'node-connect', desc: '节点连接' },
];

const PENDING_SKILLS = [
  // 在仓库中只有 README.md，需要补充 SKILL.md
  { name: 'superpowers', desc: '超能力 - 84,751 Stars 的 AI 开发技能框架' },
  { name: 'fabric', desc: 'Fabric - 200+ 精心设计的 AI Prompt 模板' },
];
