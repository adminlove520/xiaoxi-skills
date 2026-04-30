import { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import { LEADERBOARD_TABS } from './constants';
import { useI18n } from '../i18n/I18nContext';

export default function Leaderboard({ onDetail, onCopy }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('trending');
  const [data, setData] = useState({
    trending: [],
    github: [],
    clawhub: [],
    skillssh: []
  });
  const [loading, setLoading] = useState({
    trending: false,
    github: false,
    clawhub: false,
    skillssh: false
  });
  const [error, setError] = useState({
    trending: null,
    github: null,
    clawhub: null,
    skillssh: null
  });

  const fetchLeaderboard = async (tab) => {
    if (data && data[tab] && data[tab].length > 0) return; 

    setLoading(prev => ({ ...prev, [tab]: true }));
    setError(prev => ({ ...prev, [tab]: null }));
    try {
      const res = await fetch(`/api/leaderboard?source=${tab}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      if (result.success) {
        setData(prev => ({ ...prev, [tab]: result.rankings || [] }));
      } else {
        setError(prev => ({ ...prev, [tab]: result.error || t.leaderboard.error }));
      }
    } catch (e) {
      console.error('Fetch leaderboard failed:', e);
      setError(prev => ({ ...prev, [tab]: e.message }));
    } finally {
      setLoading(prev => ({ ...prev, [tab]: false }));
    }
  };

  useEffect(() => {
    if (activeTab) {
      fetchLeaderboard(activeTab);
    }
  }, [activeTab]);

  const currentData = (data && data[activeTab]) ? data[activeTab] : [];
  const currentLoading = loading ? loading[activeTab] : false;
  const currentError = error ? error[activeTab] : null;

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px', 
        overflowX: 'auto', 
        paddingBottom: '8px' 
      }}>
        {LEADERBOARD_TABS.map(tabItem => (
          <button
            key={tabItem.key}
            onClick={() => setActiveTab(tabItem.key)}
            style={{
              padding: '8px 16px',
              background: activeTab === tabItem.key ? tabItem.color : '#161625',
              color: activeTab === tabItem.key ? '#fff' : '#888',
              border: `1px solid ${activeTab === tabItem.key ? tabItem.color : '#2d2d4a'}`,
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {t.leaderboard.tabs[tabItem.key]}
          </button>
        ))}
      </div>

      {currentLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div className="spinner"></div>
          {t.leaderboard.loading}
        </div>
      ) : currentError ? (
        <div style={{ 
          padding: '20px', 
          background: '#e53e3e10', 
          border: '1px solid #e53e3e', 
          borderRadius: '8px', 
          color: '#feb2b2',
          fontSize: '14px'
        }}>
          ❌ {t.leaderboard.error}: {currentError}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {currentData.map((skill, index) => (
            <div key={`${skill.source}-${skill.name}`} style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '-10px', 
                left: '10px', 
                background: index < 3 ? '#ed8936' : '#2d2d4a', 
                color: '#fff', 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                zIndex: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {index + 1}
              </div>
              <SkillCard skill={skill} onDetail={onDetail} onCopy={onCopy} />
            </div>
          ))}
          {currentData.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
              {t.leaderboard.no_data}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
