'use client';
import { useState, useEffect } from 'react';

const API_BASE = '/api';

export default function Home() {
  const [tab, setTab] = useState('browse'); // browse, discover, leaderboard
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Discover state
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [discoverSource, setDiscoverSource] = useState('all');
  const [discoverResults, setDiscoverResults] = useState([]);
  const [discovering, setDiscovering] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState({ clawhub: [], github: [], trending: [] });
  const [leaderboardTab, setLeaderboardTab] = useState('trending');
  const [loadingBoard, setLoadingBoard] = useState(false);

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/skills`);
      const data = await res.json();
      if (data.success) {
        setSkills(data.skills);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = async (e) => {
    e?.preventDefault();
    if (!discoverQuery.trim()) return;
    
    setDiscovering(true);
    setDiscoverResults([]);
    try {
      const res = await fetch(`${API_BASE}/discover?q=${encodeURIComponent(discoverQuery)}&source=${discoverSource}`);
      const data = await res.json();
      if (data.success) {
        setDiscoverResults(data.results);
      }
    } catch (e) {
      console.error('Discover error:', e);
    } finally {
      setDiscovering(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLoadingBoard(true);
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.rankings);
      }
    } catch (e) {
      console.error('Leaderboard error:', e);
    } finally {
      setLoadingBoard(false);
    }
  };

  useEffect(() => {
    if (tab === 'leaderboard' && leaderboard.trending.length === 0) {
      fetchLeaderboard();
    }
  }, [tab]);

  const getInstallCmd = (skill) => {
    if (skill.install === 'cp') {
      return `cp -r ~/.openclaw/skills/${skill.name} ~/.openclaw/skills/`;
    }
    if (skill.install === 'clawdhub') {
      return `clawdhub install ${skill.name}`;
    }
    if (skill.install === 'git' || skill.url) {
      return `git clone ${skill.url?.replace('/blob/main', '').replace('github.com', 'github.com/')} ${skill.name}`;
    }
    return `clawdhub install ${skill.name}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('已复制: ' + text);
  };

  // Filter skills for browse tab
  const filteredSkills = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                       (s.desc && s.desc.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || s.source === filter || s.install === filter;
    return matchSearch && matchFilter;
  });

  const renderStars = (count) => {
    if (!count) return null;
    return <span style={{ color: '#f6c90e' }}>★ {count}</span>;
  };

  const renderScore = (score) => {
    if (!score) return null;
    return <span style={{ color: '#667eea' }}>⚡ {score.toFixed(2)}</span>;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a2e', padding: '24px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🦞 xiaoxi-skills Hub
        </h1>
        <p style={{ color: '#888', marginTop: '8px' }}>
          OpenClaw Skills 收藏库 · {loading ? '...' : skills.length} 个 Skills
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '24px' }}>
        {[
          { key: 'browse', label: '📦 浏览', icon: '📦' },
          { key: 'discover', label: '🔍 发现', icon: '🔍' },
          { key: 'leaderboard', label: '🏆 排行榜', icon: '🏆' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '12px 24px',
              background: tab === t.key ? '#667eea' : '#1a1a2e',
              border: 'none',
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

      {/* Loading/Error */}
      {loading && tab === 'browse' && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>加载中...</div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: '24px', color: '#e53' }}>
          错误: {error}
          <button onClick={fetchSkills} style={{ marginLeft: '12px', padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            重试
          </button>
        </div>
      )}

      {/* ==================== BROWSE TAB ==================== */}
      {tab === 'browse' && !loading && (
        <>
          {/* Search & Filter */}
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
              <option value="workspace">Workspace</option>
              <option value="openclaw">OpenClaw</option>
              <option value="repo">Repo</option>
              <option value="clawhub">ClawHub</option>
            </select>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '0 24px 24px', flexWrap: 'wrap' }}>
            <div style={{ background: '#1a1a2e', padding: '12px 24px', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>{filteredSkills.length}</span>
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
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#38b2ac' }}>{skills.filter(s => s.source === 'repo' || s.source === 'clawhub').length}</span>
              <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>Repo/Hub</span>
            </div>
          </div>

          {/* Skills Grid */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredSkills.map((skill) => (
              <div key={skill.name} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '1px solid #2d2d4a', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: skill.source === 'workspace' ? '#48bb7820' : skill.source === 'openclaw' ? '#ed893620' : '#38b2ac20', color: skill.source === 'workspace' ? '#48bb78' : skill.source === 'openclaw' ? '#ed8936' : '#38b2ac' }}>
                    {skill.source}
                  </span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>{skill.desc || skill.name}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={() => copyToClipboard(getInstallCmd(skill))} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    📋 安装
                  </button>
                  <code style={{ fontSize: '11px', background: '#0a0a0f', padding: '4px 8px', borderRadius: '4px', color: '#888' }}>
                    {skill.install || 'clawdhub'}
                  </code>
                  {renderStars(skill.stars)}
                  {renderScore(skill.score)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ==================== DISCOVER TAB ==================== */}
      {tab === 'discover' && (
        <>
          {/* Search Form */}
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
                <option value="clawhub">ClawHub</option>
                <option value="github">GitHub</option>
                <option value="local">本地</option>
              </select>
              <button type="submit" disabled={discovering} style={{ padding: '12px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                {discovering ? '搜索中...' : '🔍 搜索'}
              </button>
            </form>
          </div>

          {/* Source Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '0 24px 16px' }}>
            <span style={{ color: '#888', fontSize: '12px', padding: '8px 0' }}>
              {discoverResults.length > 0 ? `找到 ${discoverResults.length} 个结果` : '输入关键词开始搜索'}
            </span>
          </div>

          {/* Discover Results */}
          {discovering && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>搜索中...</div>
          )}
          
          {!discovering && discoverResults.length > 0 && (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {discoverResults.map((skill, i) => (
                <div key={`${skill.source}-${skill.name}`} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '1px solid #2d2d4a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: skill.source === 'clawhub' ? '#667eea20' : skill.source === 'github' ? '#48bb7820' : '#ed893620', color: skill.source === 'clawhub' ? '#667eea' : skill.source === 'github' ? '#48bb78' : '#ed8936' }}>
                      {skill.source}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>{skill.desc || skill.name}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => copyToClipboard(getInstallCmd(skill))} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      📋 安装
                    </button>
                    <code style={{ fontSize: '11px', background: '#0a0a0f', padding: '4px 8px', borderRadius: '4px', color: '#888' }}>
                      {skill.install || 'clawdhub'}
                    </code>
                    {renderStars(skill.stars)}
                    {renderScore(skill.score)}
                    {skill.rank && <span style={{ color: '#f6c90e', fontSize: '11px' }}>#{skill.rank}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!discovering && discoverResults.length === 0 && discoverQuery && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
              没有找到相关 Skills，试试其他关键词
            </div>
          )}
        </>
      )}

      {/* ==================== LEADERBOARD TAB ==================== */}
      {tab === 'leaderboard' && (
        <>
          {/* Leaderboard Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '0 24px 24px' }}>
            {[
              { key: 'trending', label: '🔥 综合趋势' },
              { key: 'clawhub', label: '⚡ ClawHub' },
              { key: 'github', label: '★ GitHub' }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setLeaderboardTab(t.key)}
                style={{
                  padding: '10px 20px',
                  background: leaderboardTab === t.key ? '#667eea' : '#1a1a2e',
                  border: 'none',
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

          {loadingBoard && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>加载排行榜...</div>
          )}

          {!loadingBoard && leaderboard[leaderboardTab]?.length > 0 && (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 48px' }}>
              {leaderboard[leaderboardTab].map((skill, i) => (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#1a1a2e', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: i < 3 ? `1px solid ${['#f6c90e', '#c0c0c0', '#cd7f32'][i]}40` : '1px solid #2d2d4a' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: i < 3 ? ['#f6c90e', '#c0c0c0', '#cd7f32'][i] : '#2d2d4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: i < 3 ? '#000' : '#888' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#aaa' }}>{skill.desc || skill.name}</p>
                    {skill.category && <span style={{ fontSize: '10px', color: '#667eea' }}>{skill.category}</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {renderStars(skill.stars)}
                    {renderScore(skill.score)}
                    {skill.trendingScore && <div style={{ fontSize: '11px', color: '#888' }}>评分: {skill.trendingScore.toFixed(1)}</div>}
                  </div>
                  <button onClick={() => copyToClipboard(getInstallCmd(skill))} style={{ padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                    📋
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loadingBoard && leaderboard[leaderboardTab]?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
              加载失败，请稍后重试
              <button onClick={fetchLeaderboard} style={{ marginLeft: '12px', padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                重试
              </button>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #1a1a2e', color: '#666', fontSize: '12px' }}>
        <p>🦞 Made with ❤️ by xiaoxi · <a href="https://github.com/adminlove520/xiaoxi-skills" style={{ color: '#667eea', textDecoration: 'none' }}>GitHub</a></p>
      </footer>
    </div>
  );
}
