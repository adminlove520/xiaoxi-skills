'use client';
import { useState } from 'react';

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

  const validateSkillMd = (content) => {
    if (!content.includes('name:') && !content.includes('## name')) {
      return 'SKILL.md 应包含 skill name';
    }
    if (!content.includes('description:') && !content.includes('## description')) {
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
          githubToken: githubToken.trim(),
          submitterName: submitterName.trim(),
          submitterEmail: submitterEmail.trim()
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data);
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', margin: 0, background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📦 提交 Skill
          </h1>
          <p style={{ color: '#888', marginTop: '8px' }}>
            上传你的 SKILL.md，为 xiaoxi-skills 贡献力量
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: '#e53', padding: '16px', borderRadius: '12px', marginBottom: '24px', color: '#fff' }}>
            ❌ {error}
          </div>
        )}

        {/* Success Result */}
        {result?.success && (
          <div style={{ background: '#48bb7820', border: '1px solid #48bb78', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px', color: '#48bb78' }}>✅ 提交成功！</h3>
            <p style={{ margin: '0 0 12px', color: '#aaa' }}>你的 Skill 已成功提交 PR</p>
            {result.prUrl && (
              <a 
                href={result.prUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none' }}
              >
                ↗ 查看 Pull Request
              </a>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Skill Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              Skill 名称 <span style={{ color: '#e53' }}>*</span>
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="例如: my-awesome-skill"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1a1a2e',
                border: '1px solid #2d2d4a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Skill Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              Skill 描述 <span style={{ color: '#e53' }}>*</span>
            </label>
            <input
              type="text"
              value={skillDesc}
              onChange={(e) => setSkillDesc(e.target.value)}
              placeholder="简要描述这个 Skill 的功能"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1a1a2e',
                border: '1px solid #2d2d4a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* SKILL.md Content */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              SKILL.md 内容 <span style={{ color: '#e53' }}>*</span>
            </label>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
              必须包含 name 和 description 字段
            </p>
            <textarea
              value={skillContent}
              onChange={(e) => setSkillContent(e.target.value)}
              placeholder={`# SKILL.md 模板\n\n## name\nyour-skill-name\n\n## description\n这个 Skill 做了什么...\n\n## triggers\n- 关键词触发\n\n## actions\n- 具体功能`}
              rows={16}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1a1a2e',
                border: '1px solid #2d2d4a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #2d2d4a', paddingTop: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#888' }}>提交者信息</h3>
          </div>

          {/* Submitter Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              你的 GitHub 用户名
            </label>
            <input
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="例如: johndoe"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1a1a2e',
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
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              GitHub Personal Access Token <span style={{ color: '#f6c90e' }}>(需要 repo 权限)</span>
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1a1a2e',
                border: '1px solid #2d2d4a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
              用于自动创建 PR。如果不提供，将生成手动提交流程。
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '16px 32px',
              background: submitting ? '#555' : '#48bb78',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '12px'
            }}
          >
            {submitting ? '⏳ 提交中...' : '📤 提交 Skill'}
          </button>
        </form>

        {/* Tips */}
        <div style={{ marginTop: '40px', padding: '20px', background: '#1a1a2e', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 12px', color: '#667eea' }}>💡 提交提示</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#888', fontSize: '13px', lineHeight: '1.8' }}>
            <li>SKILL.md 必须包含 <code style={{ color: '#667eea' }}>name</code> 和 <code style={{ color: '#667eea' }}>description</code> 字段</li>
            <li>建议包含 <code style={{ color: '#667eea' }}>triggers</code> 说明何时触发此 Skill</li>
            <li>建议包含 <code style={{ color: '#667eea' }}>actions</code> 说明具体功能</li>
            <li>GitHub Token 需要 <code style={{ color: '#f6c90e' }}>repo</code> 权限才能自动创建 PR</li>
          </ul>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
