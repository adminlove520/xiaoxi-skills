'use client';
import { useState } from 'react';

const skills = [
  { name: 'agent-reach', desc: '全平台接入 (Twitter/Reddit/YouTube/B站等)', source: 'workspace', install: 'cp' },
  { name: 'auto-monitor', desc: '主动监控系统状态', source: 'openclaw', install: 'cp' },
  { name: 'autocli', desc: '55+ 社交/内容网站 CLI', source: 'openclaw', install: 'cp' },
  { name: 'avatar-helper', desc: '头像助手', source: 'repo', install: 'clawdhub' },
  { name: 'building-agentskills', desc: '构建 Agent Skills', source: 'openclaw', install: 'cp' },
  { name: 'chrome-cdp', desc: 'Chrome CDP 协议控制', source: 'repo', install: 'clawdhub' },
  { name: 'clawbot-market', desc: 'ClawBot 市场', source: 'repo', install: 'clawdhub' },
  { name: 'clawbridge', desc: 'Bridge 工具', source: 'repo', install: 'clawdhub' },
  { name: 'clawfeed', desc: 'Feed 聚合', source: 'repo', install: 'clawdhub' },
  { name: 'clawhub', desc: 'ClawHub CLI - 搜索/安装/发布 skills', source: 'openclaw', install: 'cp' },
  { name: 'clawpi-redpacket-monitor', desc: '红包监控', source: 'repo', install: 'clawdhub' },
  { name: 'clawteam', desc: '多 Agent 团队协调', source: 'workspace', install: 'cp' },
  { name: 'coding-agent', desc: '编码 Agent - 委托代码任务', source: 'openclaw', install: 'cp' },
  { name: 'coding-delegate-agent', desc: '编码委托 Agent', source: 'workspace', install: 'cp' },
  { name: 'cognitive-memory', desc: '认知记忆系统', source: 'repo', install: 'clawdhub' },
  { name: 'companion-lobster', desc: '陪伴型小龙虾', source: 'repo', install: 'clawdhub' },
  { name: 'create-agent-skills', desc: '创建 Agent Skills', source: 'repo', install: 'clawdhub' },
  { name: 'cross-bot-communication', desc: '跨 Bot 通信', source: 'repo', install: 'clawdhub' },
  { name: 'dna-memory', desc: 'DNA 记忆系统', source: 'openclaw', install: 'cp' },
  { name: 'elite-longterm-memory', desc: '精英长期记忆', source: 'repo', install: 'clawdhub' },
  { name: 'epro-memory', desc: 'EPRO 记忆', source: 'repo', install: 'clawdhub' },
  { name: 'fabric', desc: 'Fabric 工具 - AI 增强 CLI', source: 'repo', install: 'clawdhub' },
  { name: 'files', desc: '文件管理', source: 'repo', install: 'clawdhub' },
  { name: 'find-skills', desc: '技能发现', source: 'openclaw', install: 'cp' },
  { name: 'gateway-watchdog-xiaoxi', desc: '网关看门狗', source: 'repo', install: 'clawdhub' },
  { name: 'gh-issues', desc: 'GitHub Issues 管理', source: 'openclaw', install: 'cp' },
  { name: 'github', desc: 'GitHub CLI', source: 'repo', install: 'clawdhub' },
  { name: 'gogcli', desc: 'Google 服务 CLI', source: 'repo', install: 'clawdhub' },
  { name: 'healthcheck', desc: '安全检查', source: 'openclaw', install: 'cp' },
  { name: 'hermes-agent', desc: 'Hermes Agent', source: 'openclaw', install: 'cp' },
  { name: 'holographic-memory', desc: '全息记忆', source: 'openclaw', install: 'cp' },
  { name: 'lobster-cultivation', desc: '小龙虾养殖', source: 'repo', install: 'clawdhub' },
  { name: 'lyric-sense', desc: '歌词音乐', source: 'openclaw', install: 'cp' },
  { name: 'memory-curator', desc: '记忆策展人', source: 'workspace', install: 'cp' },
  { name: 'memu', desc: '内存工具', source: 'repo', install: 'clawdhub' },
  { name: 'minimax-docx', desc: 'DOCX 文档创建', source: 'workspace', install: 'cp' },
  { name: 'minimax-pdf', desc: 'PDF 生成', source: 'workspace', install: 'cp' },
  { name: 'minimax-xlsx', desc: 'Excel 表格', source: 'workspace', install: 'cp' },
  { name: 'movie-subtitle-viewer', desc: '电影字幕查看', source: 'repo', install: 'clawdhub' },
  { name: 'multi-search-engine', desc: '多搜索引擎', source: 'repo', install: 'clawdhub' },
  { name: 'myclaw-backup', desc: 'MyClaw 备份', source: 'repo', install: 'clawdhub' },
  { name: 'newsnow', desc: '聚合新闻源', source: 'repo', install: 'clawdhub' },
  { name: 'obsidian', desc: 'Obsidian 笔记', source: 'repo', install: 'clawdhub' },
  { name: 'openclaw-auto-updater', desc: '自动更新', source: 'repo', install: 'clawdhub' },
  { name: 'openclaw-evolution', desc: '进化指南', source: 'workspace', install: 'cp' },
  { name: 'openclaw-plugin-sdk-migration', desc: '插件 SDK 迁移', source: 'workspace', install: 'cp' },
  { name: 'openclaw-pr-maintainer', desc: 'PR 维护', source: 'openclaw', install: 'cp' },
  { name: 'openclaw-qa', desc: '问答系统', source: 'repo', install: 'clawdhub' },
  { name: 'openclaw-tavily-search', desc: 'Tavily 搜索', source: 'repo', install: 'clawdhub' },
  { name: 'pentest-learning-skill', desc: '渗透学习', source: 'repo', install: 'clawdhub' },
  { name: 'pinchtab-helper', desc: '浏览器自动化', source: 'repo', install: 'clawdhub' },
  { name: 'planning-with-files', desc: '文件规划', source: 'repo', install: 'clawdhub' },
  { name: 'powerpoint-pptx', desc: 'PPT 生成', source: 'repo', install: 'clawdhub' },
  { name: 'pptx-generator', desc: 'PPT 生成器', source: 'workspace', install: 'cp' },
  { name: 'pr-review', desc: 'PR 审查', source: 'workspace', install: 'cp' },
  { name: 'proactive-solvr', desc: '主动解决者', source: 'repo', install: 'clawdhub' },
  { name: 'scrapling-official', desc: '智能爬虫', source: 'openclaw', install: 'cp' },
  { name: 'self-driven', desc: '自驱动', source: 'repo', install: 'clawdhub' },
  { name: 'self-health-monitor', desc: '健康监控', source: 'openclaw', install: 'cp' },
  { name: 'self-improving', desc: '自我改进', source: 'repo', install: 'clawdhub' },
  { name: 'self-improving-agent', desc: '自我进化 Agent', source: 'repo', install: 'clawdhub' },
  { name: 'self-reflection', desc: '自我反思', source: 'repo', install: 'clawdhub' },
  { name: 'skill-creator', desc: '技能创建', source: 'repo', install: 'clawdhub' },
  { name: 'stealth-browser', desc: '反检测浏览器', source: 'repo', install: 'clawdhub' },
  { name: 'summarize', desc: '文本摘要', source: 'openclaw', install: 'cp' },
  { name: 'superpowers', desc: '超能力', source: 'repo', install: 'clawdhub' },
  { name: 'taskflow', desc: '任务流编排', source: 'openclaw', install: 'cp' },
  { name: 'taskflow-inbox-triage', desc: '收件箱分类', source: 'openclaw', install: 'cp' },
  { name: 'tavily', desc: 'AI 搜索', source: 'repo', install: 'clawdhub' },
  { name: 'web-deploy-github', desc: 'GitHub Pages 部署', source: 'repo', install: 'clawdhub' },
  { name: 'x-tweet-fetcher', desc: '推文获取', source: 'repo', install: 'clawdhub' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.source === filter;
    return matchSearch && matchFilter;
  });

  const copyInstall = (skill) => {
    const cmd = skill.install === 'cp' 
      ? `cp -r ~/.openclaw/workspace/skills/${skill.name} ~/.openclaw/skills/`
      : `clawdhub install ${skill.name}`;
    navigator.clipboard.writeText(cmd);
    alert(`已复制: ${cmd}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a2e', padding: '24px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🦞 xiaoxi-skills Hub
        </h1>
        <p style={{ color: '#888', marginTop: '8px' }}>
          OpenClaw Skills 收藏库 · {skills.length} 个 Skills
        </p>
      </header>

      {/* Search & Filter */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 搜索 skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '12px 16px', background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '12px 16px', background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
          <option value="all">全部来源</option>
          <option value="workspace">Workspace</option>
          <option value="openclaw">OpenClaw</option>
          <option value="repo">Repo</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '0 24px 24px', flexWrap: 'wrap' }}>
        <div style={{ background: '#1a1a2e', padding: '12px 24px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>{filtered.length}</span>
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>结果</span>
        </div>
        <div style={{ background: '#1a1a2e', padding: '12px 24px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#48bb78' }}>{skills.filter(s => s.source === 'workspace').length}</span>
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>Workspace</span>
        </div>
        <div style={{ background: '#1a1a2e', padding: '12px 24px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ed8936' }}>{skills.filter(s => s.source === 'openclaw').length}</span>
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>OpenClaw</span>
        </div>
        <div style={{ background: '#1a1a2e', padding: '12px 24px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#38b2ac' }}>{skills.filter(s => s.source === 'repo').length}</span>
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>Repo</span>
        </div>
      </div>

      {/* Quick Install */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>⚡ 一键安装</h3>
          <pre style={{ background: '#0a0a0f', padding: '12px', borderRadius: '8px', overflow: 'auto', fontSize: '13px', margin: 0 }}>
{`git clone https://github.com/adminlove520/xiaoxi-skills.git
cd xiaoxi-skills
bash scripts/install.sh`}
          </pre>
        </div>
      </div>

      {/* Skills Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map((skill) => (
          <div key={skill.name} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '1px solid #2d2d4a', cursor: 'pointer', transition: 'border-color 0.2s' }} onClick={() => setSelectedSkill(skill)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: skill.source === 'workspace' ? '#48bb7820' : skill.source === 'openclaw' ? '#ed893620' : '#38b2ac20', color: skill.source === 'workspace' ? '#48bb78' : skill.source === 'openclaw' ? '#ed8936' : '#38b2ac' }}>
                {skill.source}
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>{skill.desc}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={(e) => { e.stopPropagation(); copyInstall(skill); }} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer' }}>
                📋 安装命令
              </button>
              <code style={{ fontSize: '11px', background: '#0a0a0f', padding: '4px 8px', borderRadius: '4px', color: '#888' }}>
                {skill.install === 'cp' ? 'cp -r' : 'clawdhub'}
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSkill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedSkill(null)}>
          <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 12px', color: '#667eea' }}>{selectedSkill.name}</h2>
            <p style={{ color: '#aaa', margin: '0 0 16px' }}>{selectedSkill.desc}</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '4px', background: '#667eea20', color: '#667eea' }}>{selectedSkill.source}</span>
              <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '4px', background: '#38b2ac20', color: '#38b2ac' }}>{selectedSkill.install}</span>
            </div>
            <pre style={{ background: '#0a0a0f', padding: '12px', borderRadius: '8px', overflow: 'auto', fontSize: '12px', marginBottom: '16px' }}>
{selectedSkill.install === 'cp'
  ? `cp -r ~/.openclaw/workspace/skills/${selectedSkill.name} ~/.openclaw/skills/`
  : `clawdhub install ${selectedSkill.name}`}
            </pre>
            <button onClick={() => setSelectedSkill(null)} style={{ width: '100%', padding: '12px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #1a1a2e', color: '#666', fontSize: '12px' }}>
        <p>🦞 Made with ❤️ by xiaoxi · <a href="https://github.com/adminlove520/xiaoxi-skills" style={{ color: '#667eea', textDecoration: 'none' }}>GitHub</a></p>
      </footer>
    </div>
  );
}
