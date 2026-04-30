import { useI18n } from '../i18n/I18nContext';

export default function SkillDetailModal({ skill, onClose, onCopy }) {
  const { t } = useI18n();
  if (!skill) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#161625',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '16px',
        border: '1px solid #2d2d4a',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: '24px', margin: '0 0 16px', color: '#fff' }}>{skill.name}</h2>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '4px', background: '#667eea20', color: '#667eea' }}>
            {skill.source}
          </span>
          {skill.version && (
            <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '4px', background: '#2d2d4a', color: '#aaa' }}>
              v{skill.version}
            </span>
          )}
        </div>

        <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '32px', fontSize: '15px' }}>
          {skill.desc || t.skill_card.no_desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {skill.install && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '8px' }}>{t.skill_card.install_cmd}</label>
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                background: '#0a0a0f', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #2d2d4a'
              }}>
                <code style={{ flex: 1, color: '#48bb78', fontSize: '13px', wordBreak: 'break-all' }}>
                  {skill.install}
                </code>
                <button 
                  onClick={() => onCopy(skill.install)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  title={t.skill_card.copy_btn}
                >
                  📋
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {skill.url && (
              <a 
                href={skill.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#667eea',
                  color: '#fff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {t.skill_card.view_code}
              </a>
            )}
            {skill.repo && (
              <a 
                href={`https://github.com/${skill.repo}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#24292e',
                  color: '#fff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                GitHub Repo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
