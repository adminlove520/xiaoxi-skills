'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = '/api';

// 分类颜色映射
const SOURCE_COLORS = {
  workspace: { bg: '#48bb7820', color: '#48bb78', label: 'Workspace' },
  openclaw: { bg: '#ed893620', color: '#ed8936', label: 'OpenClaw' },
  clawhub: { bg: '#667eea20', color: '#667eea', label: 'ClawHub' },
  repo: { bg: '#38b2ac20', color: '#38b2ac', label: 'Repo' },
  github: { bg: '#48bb7820', color: '#48bb78', label: 'GitHub' },
  skillssh: { bg: '#f6c90e20', color: '#f6c90e', label: 'skill.sh' }
};

// Leaderboard 子Tab配置
const LEADERBOARD_TABS = [
  { key: 'trending', label: '🔥 综合趋势', color: '#667eea' },
  { key: 'github', label: '★ GitHub Top10', color: '#48bb78' },
  { key: 'clawhub', label: '⚡ ClawHub 推荐', color: '#ed8936' },
  { key: 'skillssh', label: '🔧 skill.sh 精选', color: '#f6c90e' }
];

export default function Home() {
  const [tab, setTab] = useState('browse');
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Discover state
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [discoverSource, setDiscoverSource] = useState('all');
  const [discoverResults, setDiscoverResults] = useState([]);
  const [discovering, setDiscovering] = useState(false);
  const [discoverError, setDiscoverError] = useState(null);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState({
    trending: [],
    github: [],
    clawhub: [],
    skillssh: []
  });
  const [leaderboardTab, setLeaderboardTab] = useState('trending');
  const [leaderboardLoading, setLeaderboardLoading] = useState({
    trending: false,
    github: false,
    clawhub: false,
    skillssh: false
  });
  const [leaderboardError, setLeaderboardError] = useState({
    trending: null,
    github: null,
    clawhub: null,
    skillssh: null
  });
  const [boardNote, setBoardNote] = useState(null);

  // 使用 ref 跟踪已加载的数据源，避免闭包问题
  const loadedSources = useRef(new Set());

  // Fetch skills
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/skills`, { 
        signal: AbortSignal.timeout(10000)
      });
      const data = await res.json();
      if (data.success) {
        setSkills(data.skills);
        setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      } else {
        setError(data.error || '加载失败');
      }
    } catch (e) {
      setError(e.name === 'TimeoutError' ? '请求超时，请检查网络连接' : e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = async (e) => {
    e?.preventDefault();
    if (!discoverQuery.trim()) return;
    
    setDiscovering(true);
    setDiscoverError(null);
    setDiscoverResults([]);
    try {
      const res = await fetch(
        `${API_BASE}/discover?q=${encodeURIComponent(discoverQuery)}&source=${discoverSource}`,
        { signal: AbortSignal.timeout(15000) }
      );
      const data = await res.json();
      if (data.success) {
        setDiscoverResults(data.results);
        if (data.results.length === 0) {
          setDiscoverError('没有找到相关 Skills，试试其他关键词');
        }
      } else {
        setDiscoverError(data.error || '搜索失败');
      }
    } catch (e) {
      setDiscoverError(e.name === 'TimeoutError' ? '请求超时' : e.message);
    } finally {
      setDiscovering(false);
    }
  };

  // 按需加载单个 leaderboard 数据源 - 不依赖外部状态
  const fetchLeaderboardSource = useCallback(async (source) => {
    // 使用 ref 检查是否已加载，避免闭包问题
    if (loadedSources.current.has(source) && leaderboard[source]?.length > 0) {
      return;
    }

    setLeaderboardLoading(prev => ({ ...prev, [source]: true }));
    setLeaderboardError(prev => ({ ...prev, [source]: null }));

    try {
      const res = await fetch(`${API_BASE}/leaderboard?source=${source}`, { 
        signal: AbortSignal.timeout(15000) 
      });
      const data = await res.json();
      
      if (data.success) {
        setLeaderboard(prev => {
          const newData = data.rankings || [];
          // 更新 ref
          if (newData.length > 0) {
            loadedSources.current.add(source);
          }
          return {
            ...prev,
            [source]: newData
          };
        });
        if (data.note) setBoardNote(data.note);
      } else {
        setLeaderboardError(prev => ({ ...prev, [source]: data.error || '加载失败' }));
      }
    } catch (e) {
      const errorMsg = e.name === 'TimeoutError' ? '请求超时' : e.message;
      setLeaderboardError(prev => ({ ...prev, [source]: errorMsg }));
    } finally {
      setLeaderboardLoading(prev => ({ ...prev, [source]: false }));
    }
  }, []); // 空依赖数组，不依赖外部状态

  // 当 Tab 切换到 leaderboard 时，加载当前选中的数据源
  useEffect(() => {
    if (tab === 'leaderboard') {
      fetchLeaderboardSource(leaderboardTab);
    }
  }, [tab, leaderboardTab, fetchLeaderboardSource]);

  const getInstallCmd = (skill) => {
    if (skill.source === 'workspace') {
      return `cp -r ~/.openclaw/workspace/skills/${skill.name} ~/.openclaw/skills/`;
    }
    if (skill.source === 'openclaw') {
      return `cp -r ~/.openclaw/skills/${skill.name} ~/.openclaw/skills/`;
    }
    if (skill.source === 'clawhub') {
      return `clawdhub install ${skill.name}`;
    }
    if (skill.source === 'skillssh') {
      if (skill.repo) {
        return `npx skills@install ${skill.repo.split('/')[0]}/${skill.repo.split('/')[1]}/${skill.name}`;
      }
      return `npx skills@install ${skill.name}`;
    }
    if (skill.source === 'github' || skill.url) {
      if (skill.url) {
        const baseUrl = skill.url.replace('/blob/main', '').replace('github.com', 'github.com/');
        return `git clone ${baseUrl}`;
      }
      if (skill.repo) {
        return `git clone https://github.com/${skill.repo}`;
      }
      return `clawdhub install ${skill.name}`;
    }
    return `clawdhub install ${skill.name}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const filteredSkills = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                       (s.desc && s.desc.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || s.source === filter;
    return matchSearch && matchFilter;
  });

  const getSourceStyle = (source) => {
    const style = SOURCE_COLORS[source] || SOURCE_COLORS.repo;
    return { background: style.bg, color: style.color };
  };

  const getSourceLabel = (source) => {
    return SOURCE_COLORS[source]?.label || source;
  };

  const renderStars = (count) => {
    if (!count) return null;
    return <span style={{ color: '#f6c90e' }}>★ {count.toLocaleString()}</span>;
  };

  const renderScore = (score) => {
    if (!score) return null;
    return <span style={{ color: '#667eea' }}>⚡ {typeof score === 'number' ? score.toFixed(2) : score}</span>;
  };

  const stats = [
    { key: 'all', label: '全部', color: '#667eea', count: skills.length },
    { key: 'workspace', label: 'Workspace', color: '#48bb78', count: skills.filter(s => s.source === 'workspace').length },
    { key: 'openclaw', label: 'OpenClaw', color: '#ed8936', count: skills.filter(s => s.source === 'openclaw').length },
    { key: 'clawhub', label: 'ClawHub', color: '#667eea', count: skills.filter(s => s.source === 'clawhub').length }
  ];

  // 重试函数
  const retryLeaderboard = (source) => {
    loadedSources.current.delete(source);
    fetchLeaderboardSource(source);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a2e', padding: '24px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🦞 xiaoxi-skills Hub
        </h1>
        <p style={{ color: '#888', marginTop: '8px' }}>
          OpenClaw Skills 收藏库
          {loading ? ' · 加载中...' : ` · ${skills.length} 个 Skills`}
          {lastUpdated && <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>· 更新于 {lastUpdated}</span>}
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '24px' }}>
        {[
          { key: 'browse', label: '📦 浏览' },
          { key: 'discover', label: '🔍 发现' },
          { key: 'leaderboard', label: '🏆 排行榜' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '12px 24px',
              background: tab === t.key ? '#667eea' : 'transparent',
              border: tab === t.key ? 'none' : '1px solid #2d2d4a',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: tab === t.key ? 'bold' : 'normal'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ==================== BROWSE TAB ==================== */}
      {tab === 'browse' && (
        <>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 搜索 skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '12px 16px', background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '12px 16px', background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
              <option value="all">全部来源</option>
              <option value="workspace">Workspace ({skills.filter(s => s.source === 'workspace').length})</option>
              <option value="openclaw">OpenClaw ({skills.filter(s => s.source === 'openclaw').length})</option>
              <option value="clawhub">ClawHub ({skills.filter(s => s.source === 'clawhub').length})</option>
            </select>
          </div>

          {/* Stats Bar */}
          {!loading && !error && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '0 24px 24px', flexWrap: 'wrap' }}>
              {stats.map(s => (
                <button
                  key={s.key}
                  onClick={() => setFilter(s.key)}
                  style={{
                    background: filter === s.key ? s.color + '30' : '#1a1a2e',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: filter === s.key ? `1px solid ${s.color}` : '1px solid #2d2d4a',
                    cursor: 'pointer',
                    textAlign: 'center',
                    minWidth: '100px'
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{s.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦞</div>
              <div style={{ color: '#888' }}>加载中...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ color: '#e53', marginBottom: '16px' }}>❌ {error}</div>
              <button onClick={fetchSkills} style={{ padding: '12px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                🔄 重试
              </button>
            </div>
          )}

          {/* Skills Grid */}
          {!loading && !error && (
            <>
              {filteredSkills.length > 0 ? (
                <>
                  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {filteredSkills.map((skill) => (
                      <div key={skill.name} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '1px solid #2d2d4a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', ...getSourceStyle(skill.source) }}>
                            {getSourceLabel(skill.source)}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5', minHeight: '40px' }}>{skill.desc || skill.name}</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button 
                            onClick={() => copyToClipboard(getInstallCmd(skill))} 
                            style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer' }}
                          >
                            📋 安装
                          </button>
                          <span style={{ fontSize: '10px', color: '#666' }}>
                            {skill.source === 'workspace' ? 'cp -r' : skill.source === 'openclaw' ? 'cp -r' : skill.source === 'clawhub' ? 'clawdhub' : 'git clone'}
                          </span>
                          {renderStars(skill.stars)}
                          {renderScore(skill.score)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* More from source */}
                  <div style={{ textAlign: 'center', padding: '24px 0 48px' }}>
                    <button
                      onClick={() => {
                        const urls = {
                          workspace: 'https://github.com/adminlove520/xiaoxi-skills',
                          openclaw: 'https://github.com/openclaw/openclaw',
                          clawhub: 'https://clawhub.com/explore',
                          all: 'https://skills.sh'
                        };
                        window.open(urls[filter] || 'https://skills.sh', '_blank');
                      }}
                      style={{
                        padding: '12px 32px',
                        background: 'transparent',
                        border: '1px solid #667eea',
                        borderRadius: '8px',
                        color: '#667eea',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      More from {filter === 'all' ? 'All Sources' : filter === 'workspace' ? 'Workspace' : filter === 'openclaw' ? 'OpenClaw' : filter === 'clawhub' ? 'ClawHub' : 'Browse'} →
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '64px 24px', color: '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <div>没有找到匹配的 Skills</div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ==================== DISCOVER TAB ==================== */}
      {tab === 'discover' && (
        <>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 24px' }}>
            <form onSubmit={handleDiscover} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 输入关键词搜索 Skills..."
                value={discoverQuery}
                onChange={(e) => setDiscoverQuery(e.target.value)}
                style={{ flex: 1, minWidth: '200px', padding: '12px 16px', background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
              <select value={discoverSource} onChange={(e) => setDiscoverSource(e.target.value)} style={{ padding: '12px 16px', background: '#1a1a2e', border: '1px solid #2d2d4a', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
                <option value="all">全部渠道</option>
                <option value="clawhub">⚡ ClawHub</option>
                <option value="github">★ GitHub</option>
                <option value="skillssh">🔧 skill.sh</option>
              </select>
              <button 
                type="submit" 
                disabled={discovering || !discoverQuery.trim()}
                style={{ padding: '12px 24px', background: discovering ? '#555' : '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: discovering ? 'not-allowed' : 'pointer', fontSize: '14px' }}
              >
                {discovering ? '⏳ 搜索中...' : '🔍 搜索'}
              </button>
            </form>
          </div>

          {discovering && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ color: '#888' }}>搜索中...</div>
            </div>
          )}
          
          {discoverError && !discovering && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#e53' }}>
              ⚠️ {discoverError}
            </div>
          )}
          
          {!discovering && discoverResults.length > 0 && (
            <>
              <div style={{ textAlign: 'center', padding: '0 24px 16px', color: '#888', fontSize: '13px' }}>
                找到 {discoverResults.length} 个结果
              </div>
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {discoverResults.map((skill, i) => (
                  <div key={`${skill.source}-${skill.name}-${i}`} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '1px solid #2d2d4a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', ...getSourceStyle(skill.source) }}>
                        {getSourceLabel(skill.source)}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>{skill.desc || skill.name}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button 
                        onClick={() => copyToClipboard(getInstallCmd(skill))} 
                        style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer' }}
                      >
                        📋 安装
                      </button>
                      <span style={{ fontSize: '10px', color: '#666' }}>
                        {skill.source === 'clawhub' ? 'clawdhub' : skill.source === 'github' ? 'git clone' : skill.source === 'skillssh' ? 'npx skills' : 'clawdhub'}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {renderStars(skill.stars)}
                        {renderScore(skill.score)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!discovering && discoverResults.length === 0 && !discoverError && !discoverQuery && (
            <div style={{ textAlign: 'center', padding: '64px 24px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div>输入关键词搜索 ClawHub、GitHub、skill.sh 上的 Skills</div>
            </div>
          )}
        </>
      )}

      {/* ==================== LEADERBOARD TAB ==================== */}
      {tab === 'leaderboard' && (
        <>
          {/* Leaderboard Sub-Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '0 24px 24px' }}>
            {LEADERBOARD_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setLeaderboardTab(t.key)}
                style={{
                  padding: '10px 20px',
                  background: leaderboardTab === t.key ? t.color : 'transparent',
                  border: leaderboardTab === t.key ? 'none' : '1px solid #2d2d4a',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {boardNote && (
            <div style={{ textAlign: 'center', padding: '0 24px 16px', color: '#888', fontSize: '12px' }}>
              ℹ️ {boardNote}
            </div>
          )}

          {/* Loading State */}
          {leaderboardLoading[leaderboardTab] && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
              <div style={{ color: '#888' }}>加载{LEADERBOARD_TABS.find(t => t.key === leaderboardTab)?.label}...</div>
            </div>
          )}

          {/* Error State */}
          {leaderboardError[leaderboardTab] && !leaderboardLoading[leaderboardTab] && (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ color: '#e53', marginBottom: '16px' }}>❌ {leaderboardError[leaderboardTab]}</div>
              <button onClick={() => retryLeaderboard(leaderboardTab)} style={{ padding: '12px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                🔄 重试
              </button>
            </div>
          )}

          {/* Data Display */}
          {!leaderboardLoading[leaderboardTab] && !leaderboardError[leaderboardTab] && leaderboard[leaderboardTab]?.length > 0 && (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 48px' }}>
              {leaderboard[leaderboardTab].map((skill, i) => (
                <div 
                  key={`${skill.name}-${i}`} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    background: '#1a1a2e', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    marginBottom: '12px', 
                    border: i < 3 ? `1px solid ${['#f6c90e', '#c0c0c0', '#cd7f32'][i]}50` : '1px solid #2d2d4a'
                  }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: i < 3 ? ['#f6c90e', '#c0c0c0', '#cd7f32'][i] : '#2d2d4a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: i < 3 ? '#000' : '#888' 
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#aaa' }}>{skill.desc || skill.name}</p>
                    {skill.category && (
                      <span style={{ fontSize: '10px', color: '#667eea', background: '#667eea20', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
                        {skill.category}
                      </span>
                    )}
                    {skill.installs && (
                      <span style={{ fontSize: '10px', color: '#48bb78', marginLeft: '8px' }}>
                        ↑ {skill.installs.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    {renderStars(skill.stars)}
                    {renderScore(skill.score)}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(getInstallCmd(skill))} 
                    style={{ padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                  >
                    📋
                  </button>
                </div>
              ))}
              
              {/* More from source button */}
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <button
                  onClick={() => {
                    const urls = {
                      trending: 'https://clawhub.com/explore',
                      clawhub: 'https://clawhub.com/explore',
                      github: 'https://github.com/search?q=openclaw+skill&type=repositories',
                      skillssh: 'https://skills.sh'
                    };
                    window.open(urls[leaderboardTab] || 'https://skills.sh', '_blank');
                  }}
                  style={{
                    padding: '12px 32px',
                    background: 'transparent',
                    border: '1px solid #667eea',
                    borderRadius: '8px',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  More from {LEADERBOARD_TABS.find(t => t.key === leaderboardTab)?.label.replace(/[^a-zA-Z]/g, '') || 'source'} →
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!leaderboardLoading[leaderboardTab] && !leaderboardError[leaderboardTab] && leaderboard[leaderboardTab]?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
              <div>暂无数据</div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #1a1a2e', color: '#666', fontSize: '12px' }}>
        <p>
          🦞 Made with ❤️ by xiaoxi · 
          <a href="https://github.com/adminlove520/xiaoxi-skills" style={{ color: '#667eea', textDecoration: 'none', marginLeft: '8px' }}>GitHub</a> ·
          <a href="https://clawhub.com" style={{ color: '#667eea', textDecoration: 'none', marginLeft: '8px' }}>ClawHub</a>
        </p>
      </footer>
    </div>
  );
}
