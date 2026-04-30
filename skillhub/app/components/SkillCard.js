import { SOURCE_COLORS } from './constants';

export default function SkillCard({ skill, onDetail, onCopy }) {
  const sourceStyle = SOURCE_COLORS[skill.source] || SOURCE_COLORS.repo;
  
  const renderStars = (stars) => {
    if (!stars) return null;
    return (
      <span style={{ fontSize: '11px', color: '#f6c90e', display: 'flex', alignItems: 'center', gap: '3px' }}>
        ★ {stars}
      </span>
    );
  };

  const renderScore = (score) => {
    if (!score) return null;
    return (
      <span style={{ fontSize: '11px', color: '#ed8936', display: 'flex', alignItems: 'center', gap: '3px' }}>
        🔥 {score.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="skill-card" style={{ 
      background: '#161625', 
      border: '1px solid #2d2d4a', 
      borderRadius: '12px', 
      padding: '20px',
      transition: 'transform 0.2s, border-color 0.2s',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => onDetail(skill)}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#667eea', textDecoration: 'none' }}>
                {skill.name}
              </span>
              <span style={{ fontSize: '12px', color: '#667eea', marginLeft: '4px' }}>↗</span>
            </button>
          </div>
          <span style={{ 
            fontSize: '10px', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            background: sourceStyle.bg, 
            color: sourceStyle.color 
          }}>
            {sourceStyle.label}
          </span>
        </div>
        <p style={{ 
          margin: '0 0 12px', 
          fontSize: '13px', 
          color: '#aaa', 
          lineHeight: '1.5', 
          minHeight: '40px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {skill.desc || skill.name}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {skill.install ? (
          <button 
            onClick={() => onCopy(skill.install)} 
            style={{ 
              fontSize: '11px', 
              padding: '6px 12px', 
              borderRadius: '4px', 
              background: '#667eea', 
              color: '#fff', 
              border: 'none', 
              cursor: 'pointer' 
            }}
            title={skill.install}
          >
            📋 复制命令
          </button>
        ) : (
          <span style={{ 
            fontSize: '11px', 
            color: '#666', 
            padding: '6px 12px', 
            background: '#2d2d4a', 
            borderRadius: '4px' 
          }}>
            内置技能
          </span>
        )}
        {renderStars(skill.stars)}
        {renderScore(skill.score)}
      </div>
    </div>
  );
}
