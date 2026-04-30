'use client';
import { useState, useEffect } from 'react';

const API_BASE = '/api';

export default function SubmitPage() {
  const [skillName, setSkillName] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillContent, setSkillContent] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 检查登录状态
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_BASE}/auth/status`);
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setSubmitterName(data.user.login);
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      } finally {
        setLoadingUser(false);
      }
    }
    checkAuth();
  }, []);

  const validateSkillMd = (content) => {
    if (!content.includes('name') && !content.includes('## name')) {
      return 'SKILL.md 应包含 skill name';
    }
    if (!content.includes('description') && !content.includes('## description')) {
      return 'SKILL.md 应包含 description';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // 验证
    if (!skillName.trim()) {
      setError('请输入 Skill 名称');
      return;
    }
    if (!skillDesc.trim()) {
      setError('请输入 Skill 描述');
      return;
    }
    if (!skillContent.trim()) {
      setError('请输入 SKILL.md 内容');
      return;
    }
    
    const validationError = validateSkillMd(skillContent);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: skillName.trim(),
          skillDesc: skillDesc.trim(),
          skillContent: skillContent.trim(),
          githubToken: githubToken.trim(), // 如果为空，后端会尝试从 cookie 读取
          submitterName: submitterName.trim(),
          submitterEmail: submitterEmail.trim()
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data);
        if (!data.manual) {
           // 提交成功且不是手动流程，可以清空表单
           setSkillName('');
           setSkillDesc('');
           setSkillContent('');
        }
      } else {
        setError(data.error || '提交失败');
      }
    } catch (e) {
      setError('网络错误: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', margin: 0, background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
              📦 提交 Skill
            </h1>
            <p style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}>
              上传你的 SKILL.md，为 xiaoxi-skills 贡献力量
            </p>
          </div>
          
          {/* User Profile */}
          {!loadingUser && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a2e', padding: '8px 16px', borderRadius: '50px', border: '1px solid #2d2d4a' }}>
              <img src={user.avatar_url} alt={user.login} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{user.name || user.login}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>已登录</div>
              </div>
            </div>
          )}
          {!loadingUser && !user && (
            <a href="/api/auth/login" style={{ fontSize: '13px', color: '#48bb78', textDecoration: 'none', border: '1px solid #48bb78', padding: '6px 16px', borderRadius: '20px' }}>
              GitHub 登录
            </a>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: '#e53e3e15', border: '1px solid #e53e3e', padding: '16px', borderRadius: '12px', marginBottom: '24px', color: '#feb2b2', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Success Result */}
        {result?.success && (
          <div style={{ background: '#2d3748', border: '1px solid #48bb78', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px', color: '#48bb78', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {result.manual ? '📝 请按照以下步骤手动完成提交' : '✅ 提交成功！'}
            </h3>
            
            {result.manual ? (
              <div style={{ color: '#ccc' }}>
                <pre style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', border: '1px solid #2d2d4a' }}>
                  {result.guide}
                </pre>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 16px', color: '#aaa' }}>你的 Skill 已成功提交 PR，等待管理员审核。</p>
                {result.prUrl && (
                  <a 
                    href={result.prUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-block',
                      background: '#48bb78',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    ↗ 在 GitHub 上查看 PR
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Form Container */}
        <div style={{ background: '#161625', padding: '32px', borderRadius: '16px', border: '1px solid #2d2d4a', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Skill Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: '500' }}>
                  Skill 标识符 <span style={{ color: '#e53e3e' }}>*</span>
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="例如: weather-check"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0f',
                    border: '1px solid #2d2d4a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Skill Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: '500' }}>
                  简短描述 <span style={{ color: '#e53e3e' }}>*</span>
                </label>
                <input
                  type="text"
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  placeholder="这个 Skill 的用途..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0f',
                    border: '1px solid #2d2d4a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* SKILL.md Content */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: '500' }}>
                <span>SKILL.md 内容 <span style={{ color: '#e53e3e' }}>*</span></span>
                <span style={{ fontSize: '11px', color: '#666' }}>必须包含 name 和 description</span>
              </label>
              <textarea
                value={skillContent}
                onChange={(e) => setSkillContent(e.target.value)}
                placeholder={`# SKILL.md 模板\n\n## name\nyour-skill-id\n\n## description\n这个 Skill 的详细功能描述...`}
                rows={12}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#0a0a0f',
                  border: '1px solid #2d2d4a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: '"Fira Code", monospace',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.6',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ height: '1px', background: '#2d2d4a', margin: '8px 0' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               {/* Submitter Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: '500' }}>
                  GitHub 用户名
                </label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="例如: username"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0f',
                    border: '1px solid #2d2d4a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* GitHub Token */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '8px', fontWeight: '500' }}>
                  Personal Access Token {user && <span style={{ color: '#48bb78' }}>(已自动使用会话)</span>}
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder={user ? "已登录，此处可选填" : "ghp_xxxxxxxxxxxx"}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0a0a0f',
                    border: '1px solid #2d2d4a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {!user && (
                  <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
                    不填写将进入手动提交流程
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '16px',
                background: submitting ? '#2d3748' : 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginTop: '12px',
                transition: 'transform 0.1s, opacity 0.2s',
                boxShadow: '0 4px 12px rgba(72, 187, 120, 0.2)'
              }}
              onMouseDown={(e) => !submitting && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !submitting && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {submitting ? '⏳ 正在处理中...' : '📤 提交 Skill'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#888', 
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#888'}
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
