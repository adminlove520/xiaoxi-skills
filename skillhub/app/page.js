'use client';
import { useState, useEffect } from 'react';
import SkillCard from './components/SkillCard';
import Leaderboard from './components/Leaderboard';
import DiscoverSection from './components/DiscoverSection';
import SkillDetailModal from './components/SkillDetailModal';
import { SOURCE_COLORS } from './components/constants';
import { useI18n } from './i18n/I18nContext';

const API_BASE = '/api';

export default function Home() {
  const { t, lang, changeLanguage } = useI18n();
  const [tab, setTab] = useState('browse');
  const [skills, setSkills] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [detailSkill, setDetailSkill] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchSkills();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/status`);
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error('Check login status failed:', e);
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
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

  const handleLogout = async () => {
    await fetch(`${API_BASE}/auth/logout`);
    setUser(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(t.skill_card.copied);
  };

  const filteredSkills = skills.filter(s => {
    const matchFilter = filter === 'all' || s.source === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                       s.desc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 40px', 
        background: '#161625', 
        borderBottom: '1px solid #2d2d4a',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#667eea', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>X</div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>{t.title}</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '24px' }}>
            {['browse', 'discover', 'leaderboard'].map(tKey => (
              <button 
                key={tKey}
                onClick={() => setTab(tKey)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: tab === tKey ? '#667eea' : '#888', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {t.tabs[tKey]}
              </button>
            ))}
            <a href="/submit" style={{ color: '#888', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>{t.tabs.submit}</a>
          </nav>
          
          <div style={{ width: '1px', height: '20px', background: '#2d2d4a' }}></div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={() => changeLanguage(lang === 'zh' ? 'en' : 'zh')}
              style={{ background: '#2d2d4a', border: 'none', color: '#e0e0e0', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              {lang === 'zh' ? 'EN' : '中'}
            </button>
          </div>

          <div style={{ width: '1px', height: '20px', background: '#2d2d4a' }}></div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={user.avatar_url} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt={user.login} />
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer' }}>{t.auth.logout}</button>
            </div>
          ) : (
            <a href="/api/auth/login" style={{ background: '#667eea', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>{t.auth.login}</a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #161625 0%, #0a0a0f 100%)' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 16px', color: '#fff' }}>{t.subtitle}</h2>
        <p style={{ fontSize: '18px', color: '#888', maxWidth: '600px', margin: '0 auto 32px' }}>
          {t.hero_desc}
        </p>
        
        {tab === 'browse' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.search_placeholder} 
              style={{ width: '100%', padding: '16px 24px', background: '#161625', border: '1px solid #2d2d4a', borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none' }}
            />
          </div>
        )}
      </section>

      {/* Main Content */}
      <main style={{ padding: '0 40px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        {tab === 'browse' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {['all', 'workspace', 'openclaw', 'agents'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{ 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    background: filter === f ? '#667eea' : '#161625', 
                    color: filter === f ? '#fff' : '#888',
                    border: '1px solid #2d2d4a',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}
                >
                  {f === 'all' ? t.common.all : (f === 'workspace' ? t.common.local : (f === 'openclaw' ? t.common.openclaw : t.common.agents))}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px' }}>{t.auth.loading}</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {filteredSkills.map(skill => (
                  <SkillCard 
                    key={`${skill.source}-${skill.name}`} 
                    skill={skill} 
                    onDetail={(s) => { setDetailSkill(s); setShowDetail(true); }}
                    onCopy={copyToClipboard}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'discover' && (
          <DiscoverSection 
            onDetail={(s) => { setDetailSkill(s); setShowDetail(true); }}
            onCopy={copyToClipboard}
          />
        )}

        {tab === 'leaderboard' && (
          <Leaderboard 
            onDetail={(s) => { setDetailSkill(s); setShowDetail(true); }}
            onCopy={copyToClipboard}
          />
        )}
      </main>

      {/* Detail Modal */}
      {showDetail && (
        <SkillDetailModal 
          skill={detailSkill} 
          onClose={() => setShowDetail(false)} 
          onCopy={copyToClipboard}
        />
      )}

      {/* Footer */}
      <footer style={{ padding: '60px 40px', background: '#0a0a0f', borderTop: '1px solid #2d2d4a', textAlign: 'center' }}>
        <p style={{ color: '#555', fontSize: '14px' }}>© 2026 Xiaoxi Skills. Built for the OpenClaw Ecosystem.</p>
      </footer>
    </div>
  );
}
