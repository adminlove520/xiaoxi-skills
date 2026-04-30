import { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import { LEADERBOARD_TABS } from './constants';

export default function Leaderboard({ onDetail, onCopy }) {
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
    if (data[tab].length > 0) return; // Cache

    setLoading(prev => ({ ...prev, [tab]: true }));
    setError(prev => ({ ...prev, [tab]: null }));
    try {
      const res = await fetch(`/api/leaderboard?source=${tab}`);
      const result = await res.json();
      if (result.success) {
        setData(prev => ({ ...prev, [tab]: result.rankings || [] }));
      } else {
        setError(prev => ({ ...prev, [tab]: result.error }));
      }
    } catch (e) {
      setError(prev => ({ ...prev, [tab]: e.message }));
    } finally {
      setLoading(prev => ({ ...prev, [tab]: false }));
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const currentData = data[activeTab] || [];
  const currentLoading = loading[activeTab];
  const currentError = error[activeTab];

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px', 
        overflowX: 'auto', 
        paddingBottom: '8px' 
      }}>
        {LEADERBOARD_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.key ? tab.color : '#161625',
              color: activeTab === tab.key ? '#fff' : '#888',
              border: `1px solid ${activeTab === tab.key ? tab.color : '#2d2d4a'}`,
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div className="spinner"></div>
          正在获取最新排行...
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
          ❌ 加载失败: {currentError}
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
              暂无排行数据
            </div>
          )}
        </div>
      )}
    </div>
  );
}
