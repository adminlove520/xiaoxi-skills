'use client';
import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api';

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
  const [leaderboard, setLeaderboard] = useState({ clawhub: [], github: [], trending: [] });
  const [leaderboardTab, setLeaderboardTab] = useState('trending');
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [boardError, setBoardError] = useState(null);

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/skills`, { 
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      const data = await res.json();
      if (data.success) {
        setSkills(data.skills);
        setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      } else {
        setError(data.error || '加载失败');
      }
    } catch (e) {
      if (e.name === 'TimeoutError') {
        setError('请求超时，请检查网络连接');
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

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

  const fetchLeaderboard = useCallback(async () => {
    setLoadingBoard(true);
    setBoardError(null);
    try {
      const res = await fetch(`${API_BASE}/leaderboard`, { 
        signal: AbortSignal.timeout(15000) 
      });
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.rankings);
      } else {
        setBoardError(data.error || '加载失败');
      }
    } catch (e) {
      setBoardError(e.name === 'TimeoutError' ? '请求超时' : e.message);
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'leaderboard' && leaderboard.trending.length === 0) {
      fetchLeaderboard();
    }
  }, [tab, leaderboard.trending.length, fetchLeaderboard]);

  const getInstallCmd = (skill) => {
    if (skill.install === 'cp') {
      return `cp -r ~/.openclaw/workspace/skills/${skill.name} ~/.openclaw/skills/`;
    }
    if (skill.install === 'clawdhub') {
      return `clawdhub install ${skill.name}`;
    }
    if (skill.install === 'git' || skill.url) {
      const baseUrl = skill.url?.replace('/blob/main', '').replace('github.com', 'github.com/') || `https://github.com/adminlove520/${skill.name}`;
      return `git clone ${baseUrl}`;
    }
    return `clawdhub install ${skill.name}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Silent success
    }).catch(() => {
      alert('复制失败: ' + text);
    });
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
    return <span style={{ color: '#f6c90e', marginLeft: '8px' }}>★ {count.toLocaleString()}</span>;
  };

  const renderScore = (score) => {
    if (!score) return null;
    return <span style={{ color: '#667eea', marginLeft: '8px' }}>⚡ {typeof score === 'number' ? score.toFixed(2) : score}</span>;
  };

  // Tab button style helper
  const tabBtn = (key, label) => (
    <button
      key={key}
      onClick={() => setTab(key)}
      style={{
        padding: '12px 24px',
        background: tab === key ? '#667eea' : 'transparent',
        border: tab === key ? 'none' : '1px solid #2d2d4a',
        borderRadius: '8px',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: tab === key ? 'bold' : 'normal',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );

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
        ].map(t => tabBtn(t.key, t.label))}
      </div>

      {/* ==================== BROWSE TAB ==================== */}
      {tab === 'browse' && (
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
              <option value="clawhub">ClawHub</option>
              <option value="repo">Repo</option>
            </select>
          </div>

          {/* Stats */}
          {!loading && !error && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '0 24px 24px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: '结果', color: '#667eea', count: filteredSkills.length },
                { key: 'workspace', label: 'Workspace', color: '#48bb78', count: skills.filter(s => s.source === 'workspace').length },
                { key: 'openclaw', label: 'OpenClaw', color: '#ed8936', count: skills.filter(s => s.source === 'openclaw').length },
                { key: 'clawhub', label: 'ClawHub', color: '#38b2ac', count: skills.filter(s => s.source === 'clawhub' || s.source === 'repo').length }
              ].map(s => (
                <div key={s.key} style={{ background: '#1a1a2e', padding: '12px 24px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>{s.label}</span>
                </div>
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
              <button 
                onClick={fetchSkills}
                style={{ padding: '12px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
              >
                🔄 重试
              </button>
            </div>
          )}

          {/* Skills Grid */}
          {!loading && !error && (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
                <div key={skill.name} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '16px', border: '1px solid #2d2d4a', transition: 'border-color 0.2s, transform 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#667eea' }}>{skill.name}</h3>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: skill.source === 'workspace' ? '#48bb7820' : skill.source === 'openclaw' ? '#ed893620' : '#38b2ac20', color: skill.source === 'workspace' ? '#48bb78' : skill.source === 'openclaw' ? '#ed8936' : '#38b2ac' }}>
                      {skill.source}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5', minHeight: '40px' }}>{skill.desc || skill.name}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={() => copyToClipboard(getInstallCmd(skill))} 
                      style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      📋 安装
                    </button>
                    <code style={{ fontSize: '10px', background: '#0a0a0f', padding: '4px 8px', borderRadius: '4px', color: '#666' }}>
                      {skill.install || 'clawdhub'}
                    </code>
                    {renderStars(skill.stars)}
                    {renderScore(skill.score)}
                  </div>
                </div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#666' }}>
                  没有找到匹配的 Skills
                </div>
              )}
            </div>
          )}
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

          {/* Discover Results */}
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
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: skill.source === 'clawhub' ? '#667eea20' : '#48bb7820', color: skill.source === 'clawhub' ? '#667eea' : '#48bb78' }}>
                        {skill.source}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>{skill.desc || skill.name}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button 
                        onClick={() => copyToClipboard(getInstallCmd(skill))} 
                        style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '4px', background: '#667eea', color: '#fff', border: 'none', cursor: 'pointer' }}
                      >
                        📋 安装
                      </button>
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
              <div>输入关键词开始搜索 ClawHub 和 GitHub 上的 Skills</div>
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
                  background: leaderboardTab === t.key ? '#667eea' : 'transparent',
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

          {loadingBoard && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
              <div style={{ color: '#888' }}>加载排行榜...</div>
            </div>
          )}

          {boardError && !loadingBoard && (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ color: '#e53', marginBottom: '16px' }}>❌ {boardError}</div>
              <button 
                onClick={fetchLeaderboard}
                style={{ padding: '12px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
              >
                🔄 重试
              </button>
            </div>
          )}

          {!loadingBoard && !boardError && leaderboard[leaderboardTab]?.length > 0 && (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 48px' }}>
              {leaderboard[leaderboardTab].map((skill, i) => (
                <div 
                  key={skill.name} 
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
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    {renderStars(skill.stars)}
                    {renderScore(skill.score)}
                    {skill.trendingScore && (
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>评分: {typeof skill.trendingScore === 'number' ? skill.trendingScore.toFixed(1) : skill.trendingScore}</div>
                    )}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(getInstallCmd(skill))} 
                    style={{ padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                  >
                    📋
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loadingBoard && !boardError && leaderboard[leaderboardTab]?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
              暂无数据
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
