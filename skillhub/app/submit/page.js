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

  // GitHub Import States
  const [showImport, setShowImport] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoFiles, setRepoFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Check Auth Status
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

  // Fetch Repos
  const fetchRepos = async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch(`${API_BASE}/github/repos`);
      const data = await res.json();
      if (data.success) {
        setRepos(data.repos);
      } else {
        setError('无法加载仓库: ' + data.error);
      }
    } catch (e) {
      setError('网络错误: ' + e.message);
    } finally {
      setLoadingRepos(false);
    }
  };

  // Fetch Files
  const fetchFiles = async (repoFullName, path = '') => {
    setLoadingFiles(true);
    setSelectedRepo(repoFullName);
    setCurrentPath(path);
    try {
      const res = await fetch(`${API_BASE}/github/files?repo=${repoFullName}&path=${path}`);
      const data = await res.json();
      if (data.success) {
        if (data.type === 'dir') {
          setRepoFiles(data.files);
        } else if (data.type === 'file') {
          // It's a file, load it
          loadFileData(data.file);
        }
      } else {
        setError('无法加载文件: ' + data.error);
      }
    } catch (e) {
      setError('网络错误: ' + e.message);
    } finally {
      setLoadingFiles(false);
    }
  };

  const loadFileData = (file) => {
    try {
      // Decode base64 UTF-8
      const content = decodeURIComponent(escape(atob(file.content.replace(/\s/g, ''))));
      setSkillContent(content);
      
      // Auto-extract name and desc if possible
      const nameMatch = content.match(/## name\s*\n\s*([^\n]+)/i) || content.match(/name:\s*([^\n]+)/i);
      const descMatch = content.match(/## description\s*\n\s*([^\n]+)/i) || content.match(/description:\s*([^\n]+)/i);
      
      if (nameMatch) setSkillName(nameMatch[1].trim());
      if (descMatch) setSkillDesc(descMatch[1].trim());
      
      setShowImport(false);
    } catch (e) {
      setError('解码文件内容失败: ' + e.message);
    }
  };

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

    if (!skillName.trim()) { setError('请输入 Skill 名称'); return; }
    if (!skillDesc.trim()) { setError('请输入 Skill 描述'); return; }
    if (!skillContent.trim()) { setError('请输入 SKILL.md 内容'); return; }
    
    const validationError = validateSkillMd(skillContent);
    if (validationError) { setError(validationError); return; }

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
        if (!data.manual) {
          setSkillName(''); setSkillDesc(''); setSkillContent('');
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, fontWeight: '800', color: '#fff' }}>发布你的 Skill</h1>
            <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>分享到 xiaoxi-skills 收藏库</p>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#161625', padding: '6px 12px', borderRadius: '30px', border: '1px solid #2d2d4a' }}>
              <img src={user.avatar_url} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{user.login}</span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            onClick={() => { setShowImport(true); if (repos.length === 0) fetchRepos(); }}
            disabled={!user}
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: '#24292e', 
              color: '#fff', 
              border: '1px solid #2d2d4a', 
              borderRadius: '8px', 
              cursor: user ? 'pointer' : 'not-allowed',
              opacity: user ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.38-2.43-.98-2.43-.98-.29-.74-.71-.94-.71-.94-.73-.49.06-.48.06-.48.8.06 1.23.82 1.23.82.72 1.23 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            从 GitHub 导入
          </button>
          {!user && (
            <a href="/api/auth/login" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#48bb78', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
              登录以使用 GitHub 导入
            </a>
          )}
        </div>

        {/* GitHub Import Modal */}
        {showImport && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#161625', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid #2d2d4a', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #2d2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>从 GitHub 导入 SKILL.md</h3>
                <button onClick={() => setShowImport(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}>×</button>
              </div>
              
              <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                {loadingRepos || loadingFiles ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>⏳ 加载中...</div>
                ) : !selectedRepo ? (
                  <div>
                    <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>选择一个仓库：</p>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {repos.map(repo => (
                        <div key={repo.id} onClick={() => fetchFiles(repo.full_name)} style={{ padding: '12px 16px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '8px', cursor: 'pointer' }}>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>{repo.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{repo.full_name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <button onClick={() => setSelectedRepo(null)} style={{ padding: '4px 8px', background: '#2d2d4a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>← 返回仓库</button>
                      <span style={{ fontSize: '13px', color: '#888' }}>/{currentPath}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {currentPath && (
                        <div onClick={() => fetchFiles(selectedRepo, currentPath.split('/').slice(0, -1).join('/'))} style={{ padding: '10px 16px', color: '#667eea', cursor: 'pointer', fontSize: '14px' }}>
                          📁 .. (上级目录)
                        </div>
                      )}
                      {repoFiles.map(file => (
                        <div key={file.path} onClick={() => fetchFiles(selectedRepo, file.path)} style={{ padding: '10px 16px', background: file.type === 'dir' ? '#1a1a2e' : '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '14px' }}>{file.type === 'dir' ? '📁' : '📄'} {file.name}</span>
                          {file.name === 'SKILL.md' && <span style={{ fontSize: '10px', background: '#48bb78', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>推荐</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#161625', padding: '24px', borderRadius: '12px', border: '1px solid #2d2d4a' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>基本信息</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Skill 标识符 (必填)</label>
                  <input value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="如: my-tool" style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>简短描述 (必填)</label>
                  <input value={skillDesc} onChange={e => setSkillDesc(e.target.value)} placeholder="一句话介绍..." style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#161625', padding: '24px', borderRadius: '12px', border: '1px solid #2d2d4a' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>提交者信息</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>GitHub 用户名</label>
                  <input value={submitterName} onChange={e => setSubmitterName(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>GitHub Token (可选)</label>
                  <input type="password" value={githubToken} onChange={e => setGithubToken(e.target.value)} placeholder={user ? "已登录，此处可选" : "用于自动创建 PR"} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            </div>

            {error && <div style={{ background: '#e53e3e20', border: '1px solid #e53e3e', padding: '12px', borderRadius: '8px', color: '#feb2b2', fontSize: '13px' }}>⚠️ {error}</div>}
            
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ padding: '16px', background: submitting ? '#333' : '#48bb78', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(72,187,120,0.2)' }}
            >
              {submitting ? '提交中...' : '发布到 Hub'}
            </button>
          </div>

          {/* Right Column: Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ background: '#161625', borderRadius: '12px', border: '1px solid #2d2d4a', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #2d2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#888' }}>SKILL.md 编辑器</span>
                <span style={{ fontSize: '11px', color: '#555' }}>Markdown 支持</span>
              </div>
              <textarea
                value={skillContent}
                onChange={e => setSkillContent(e.target.value)}
                placeholder={`# SKILL.md 示例\n\n## name\nmy-skill-id\n\n## description\n这个 Skill 的详细功能描述...`}
                style={{ flex: 1, width: '100%', padding: '20px', background: 'transparent', border: 'none', color: '#d1d1d1', fontSize: '13px', fontFamily: '"Fira Code", monospace', outline: 'none', resize: 'none', lineHeight: '1.6' }}
              />
            </div>
          </div>

        </div>

        {/* Results / Steps */}
        {result && (
          <div style={{ marginTop: '32px', background: '#161625', padding: '24px', borderRadius: '12px', border: `1px solid ${result.manual ? '#ed8936' : '#48bb78'}` }}>
            <h3 style={{ margin: '0 0 12px', color: result.manual ? '#ed8936' : '#48bb78' }}>{result.manual ? '📝 请手动完成提交' : '✅ 提交成功！'}</h3>
            {result.manual ? (
              <pre style={{ background: '#0a0a0f', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', border: '1px solid #2d2d4a' }}>{result.guide}</pre>
            ) : (
              <div>
                <p style={{ margin: '0 0 16px', color: '#aaa' }}>PR 已提交，等待审核。</p>
                <a href={result.prUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#48bb78', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>查看 Pull Request</a>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', margin: '48px 0', fontSize: '14px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none' }}>← 返回主页</a>
        </div>

      </div>
    </div>
  );
}
