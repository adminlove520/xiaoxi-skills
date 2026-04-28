// Skills 数据 - 真实安装命令和来源
// 基于 xiaoxi-skills 仓库真实扫描 + OpenClaw 内置
// 更新: 2026-04-28

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const SKILLS_REPO_PATH = '/root/.openclaw/workspace/xiaoxi-skills';

// 扫描 xiaoxi-skills 中有 SKILL.md 的真实 skills
async function scanLocalSkills() {
  const skills = [];
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
              status: hasSkillMd ? 'ready' : 'missing-skill-md',
            });
          }
        } catch (e) {
          // skip
        }
      }
    }
  } catch (e) {
    console.error('Error scanning skills:', e);
  }
  return skills;
}

// 静态定义 - 基于扫描结果
// 只包含真实存在于 xiaoxi-skills 仓库且有 SKILL.md 的 skills
const LOCAL_SKILLS = [
  // 有 SKILL.md 的 skills (35个)
  { name: 'autocli', desc: '55+ 社交/内容网站 CLI', source: 'local' },
  { name: 'chrome-cdp', desc: 'Chrome CDP 控制', source: 'local' },
  { name: 'clawbot-market', desc: 'ClawBot 市场', source: 'local' },
  { name: 'clawhub', desc: 'ClawHub CLI', source: 'local' },
  { name: 'clawpi-redpacket-monitor', desc: '红包监控', source: 'local' },
  { name: 'coding-agent', desc: '编码 Agent', source: 'local' },
  { name: 'cognitive-memory', desc: '认知记忆系统', source: 'local' },
  { name: 'companion-lobster', desc: '陪伴型小龙虾', source: 'local' },
  { name: 'create-agent-skills', desc: '创建 Agent Skills', source: 'local' },
  { name: 'elite-longterm-memory', desc: '精英长期记忆', source: 'local' },
  { name: 'find-skills', desc: '技能发现', source: 'local' },
  { name: 'gateway-watchdog-xiaoxi', desc: '网关看门狗', source: 'local' },
  { name: 'gh-issues', desc: 'GitHub Issues 管理', source: 'local' },
  { name: 'github', desc: 'GitHub CLI', source: 'local' },
  { name: 'healthcheck', desc: '安全检查', source: 'local' },
  { name: 'lyric-sense', desc: '歌词音乐', source: 'local' },
  { name: 'memu', desc: '内存工具', source: 'local' },
  { name: 'multi-search-engine', desc: '多搜索引擎', source: 'local' },
  { name: 'myclaw-backup', desc: 'MyClaw 备份', source: 'local' },
  { name: 'newsnow', desc: '聚合新闻源', source: 'local' },
  { name: 'obsidian', desc: 'Obsidian 笔记', source: 'local' },
  { name: 'openclaw-auto-updater', desc: '自动更新', source: 'local' },
  { name: 'openclaw-pr-maintainer', desc: 'PR 维护', source: 'local' },
  { name: 'openclaw-tavily-search', desc: 'Tavily 搜索', source: 'local' },
  { name: 'planning-with-files', desc: '文件规划', source: 'local' },
  { name: 'powerpoint-pptx', desc: 'PPT 生成', source: 'local' },
  { name: 'proactive-solvr', desc: '主动解决者', source: 'local' },
  { name: 'self-improving', desc: '自我改进', source: 'local' },
  { name: 'self-reflection', desc: '自我反思', source: 'local' },
  { name: 'skill-creator', desc: '技能创建', source: 'local' },
  { name: 'stealth-browser', desc: '反检测浏览器', source: 'local' },
  { name: 'summarize', desc: '文本摘要', source: 'local' },
  { name: 'tavily', desc: 'AI 搜索', source: 'local' },
  { name: 'web-deploy-github', desc: 'GitHub Pages 部署', source: 'local' },
  { name: 'x-tweet-fetcher', desc: '推文获取', source: 'local' },
];

// 真实安装命令映射
const REAL_INSTALL_COMMANDS = {
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

// OpenClaw 内置 Skills
const BUILTIN_SKILLS = [
  { name: 'weather', desc: '天气查询', source: 'openclaw' },
  { name: 'blucli', desc: 'BluOS 播放器控制', source: 'openclaw' },
  { name: 'eightctl', desc: 'Eight Sleep 智能床垫', source: 'openclaw' },
  { name: 'mcporter', desc: 'MCP 工具集', source: 'openclaw' },
  { name: 'tmux', desc: 'tmux 会话控制', source: 'openclaw' },
  { name: 'fluxa-agent-wallet', desc: 'FluxA 钱包', source: 'openclaw' },
  { name: 'video-frames', desc: '视频帧提取', source: 'openclaw' },
  { name: 'session-logs', desc: '会话日志', source: 'openclaw' },
  { name: 'node-connect', desc: '节点连接', source: 'openclaw' },
];

// 待发布 Skills (在仓库中但没有 SKILL.md)
const PENDING_SKILLS = [
  { name: 'superpowers', desc: '超能力', source: 'pending' },
  { name: 'fabric', desc: 'Fabric 工具', source: 'pending' },
  { name: 'pentest-learning-skill', desc: '渗透学习', source: 'pending' },
  { name: 'dna-memory', desc: 'DNA 记忆系统', source: 'pending' },
  { name: 'holographic-memory', desc: '全息记忆', source: 'pending' },
  { name: 'hermes-agent', desc: 'Hermes Agent', source: 'pending' },
  { name: 'self-improving-agent', desc: '自我进化 Agent', source: 'pending' },
  { name: 'self-health-monitor', desc: '健康监控', source: 'pending' },
  { name: 'pr-review', desc: 'PR 审查', source: 'pending' },
  { name: 'taskflow', desc: '任务流编排', source: 'pending' },
  { name: 'taskflow-inbox-triage', desc: '收件箱分类', source: 'pending' },
  { name: 'minimax-docx', desc: 'DOCX 文档创建', source: 'pending' },
  { name: 'minimax-pdf', desc: 'PDF 生成', source: 'pending' },
  { name: 'minimax-xlsx', desc: 'Excel 表格', source: 'pending' },
  { name: 'movie-subtitle-viewer', desc: '电影字幕查看', source: 'pending' },
  { name: 'openclaw-evolution', desc: '进化指南', source: 'pending' },
  { name: 'coding-delegate-agent', desc: '编码委托 Agent', source: 'pending' },
  { name: 'memory-curator', desc: '记忆策展人', source: 'pending' },
  { name: 'clawteam', desc: '多 Agent 团队协调', source: 'pending' },
  { name: 'agent-reach', desc: '全平台接入', source: 'pending' },
  { name: 'auto-monitor', desc: '主动监控', source: 'pending' },
];

// 应用安装命令
function applyInstallCommands(skills) {
  return skills.map(skill => {
    // 有真实安装命令的
    if (REAL_INSTALL_COMMANDS[skill.name]) {
      return {
        ...skill,
        install: REAL_INSTALL_COMMANDS[skill.name].install,
        url: REAL_INSTALL_COMMANDS[skill.name].url,
      };
    }
    // OpenClaw 内置
    if (skill.source === 'openclaw') {
      return {
        ...skill,
        install: '内置技能',
        url: null,
      };
    }
    // 待发布
    if (skill.source === 'pending') {
      return {
        ...skill,
        install: '待发布',
        url: null,
        status: 'pending',
      };
    }
    // 本地 skills 的默认安装命令
    return {
      ...skill,
      install: `git clone https://github.com/adminlove520/xiaoxi-skills/${skill.name}.git ~/.openclaw/skills/`,
      url: `https://github.com/adminlove520/xiaoxi-skills/${skill.name}`,
    };
  });
}

// 合并所有 skills
const ALL_SKILLS = [
  ...applyInstallCommands(LOCAL_SKILLS),
  ...applyInstallCommands(BUILTIN_SKILLS),
  ...applyInstallCommands(PENDING_SKILLS),
];

// 统计
const READY_COUNT = LOCAL_SKILLS.length;
const PENDING_COUNT = PENDING_SKILLS.length;
const BUILTIN_COUNT = BUILTIN_SKILLS.length;

console.log(`Skills loaded: ${READY_COUNT} ready, ${PENDING_COUNT} pending, ${BUILTIN_COUNT} builtin`);

export { ALL_SKILLS, LOCAL_SKILLS, BUILTIN_SKILLS, PENDING_SKILLS, READY_COUNT, PENDING_COUNT, BUILTIN_COUNT };
export default ALL_SKILLS;
