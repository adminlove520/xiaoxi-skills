'use client';
import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';

const API_BASE = '/api';

export default function SubmitPage() {
  const { t } = useI18n();
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
        setError(t.common.error + ': ' + data.error);
      }
    } catch (e) {
      setError(t.common.error + ': ' + e.message);
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
          loadFileData(data.file);
        }
      } else {
        setError(t.common.error + ': ' + data.error);
      }
    } catch (e) {
      setError(t.common.error + ': ' + e.message);
    } finally {
      setLoadingFiles(false);
    }
  };

  const extractFromMd = (content, field) => {
    // 1. Try ## Header format
    const headerRegex = new RegExp(`##\\s*${field}\\s*\\n\\s*([^\\n#]+)`, 'i');
    const headerMatch = content.match(headerRegex);
    if (headerMatch && headerMatch[1].trim()) return headerMatch[1].trim();

    // 2. Try YAML-like format
    const yamlRegex = new RegExp(`^${field}:\\s*([^\\n]+)`, 'im');
    const yamlMatch = content.match(yamlRegex);
    if (yamlMatch && yamlMatch[1].trim()) return yamlMatch[1].trim();

    return '';
  };

  const loadFileData = (file) => {
    try {
      const content = decodeURIComponent(escape(atob(file.content.replace(/\s/g, ''))));
      setSkillContent(content);
      
      const name = extractFromMd(content, 'name');
      const desc = extractFromMd(content, 'description');
      
      if (name) setSkillName(name);
      if (desc) setSkillDesc(desc);
      
      setShowImport(false);
    } catch (e) {
      setError(t.common.error + ': ' + e.message);
    }
  };

  const validateSkillMd = (content) => {
    if (!extractFromMd(content, 'name')) {
      return t.submit.validation.skill_md_invalid_name;
    }
    if (!extractFromMd(content, 'description')) {
      return t.submit.validation.skill_md_invalid_desc;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!skillName.trim()) { setError(t.submit.validation.name_required); return; }
    if (!skillDesc.trim()) { setError(t.submit.validation.desc_required); return; }
    if (!skillContent.trim()) { setError(t.submit.validation.content_required); return; }
    
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
        setError(data.error || t.common.error);
      }
    } catch (e) {
      setError(t.common.error + ': ' + e.message);
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
            <h1 style={{ fontSize: '28px', margin: 0, fontWeight: '800', color: '#fff' }}>{t.submit.title}</h1>
            <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{t.submit.subtitle}</p>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#161625', padding: '6px 12px', borderRadius: '30px', border: '1px solid #2d2d4a' }}>
              <img src={user.avatar_url} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt={user.login} />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{user.login}</span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        {!user && !loadingUser && (
          <div style={{ background: '#161625', padding: '32px', borderRadius: '16px', border: '1px solid #ed893630', textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 12px', color: '#ed8936' }}>{t.submit.auth_needed}</h3>
            <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>{t.submit.auth_desc}</p>
            <a 
              href="/api/auth/login?next=/submit" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#48bb78', 
                color: '#fff', 
                padding: '12px 32px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(72,187,120,0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.38-2.43-.98-2.43-.98-.29-.74-.71-.94-.71-.94-.73-.49.06-.48.06-.48.8.06 1.23.82 1.23.82.72 1.23 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              {t.submit.login_btn}
            </a>
          </div>
        )}

        {user && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button 
              onClick={() => { setShowImport(true); if (repos.length === 0) fetchRepos(); }}
              style={{ 
                flex: 1, 
                padding: '12px', 
                background: '#24292e', 
                color: '#fff', 
                border: '1px solid #2d2d4a', 
                borderRadius: '8px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#2f363d'}
              onMouseOut={e => e.currentTarget.style.background = '#24292e'}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.38-2.43-.98-2.43-.98-.29-.74-.71-.94-.71-.94-.73-.49.06-.48.06-.48.8.06 1.23.82 1.23.82.72 1.23 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              {t.submit.import_btn}
            </button>
          </div>
        )}

        {/* GitHub Import Modal */}
        {showImport && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#161625', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid #2d2d4a', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #2d2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{t.submit.modal_title}</h3>
                <button onClick={() => setShowImport(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}>×</button>
              </div>
              
              <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                {loadingRepos || loadingFiles ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>⏳ {t.common.loading}</div>
                ) : !selectedRepo ? (
                  <div>
                    <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>{t.submit.select_repo}</p>
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
                      <button onClick={() => setSelectedRepo(null)} style={{ padding: '4px 8px', background: '#2d2d4a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>{t.submit.back_to_repos}</button>
                      <span style={{ fontSize: '13px', color: '#888' }}>/{currentPath}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {currentPath && (
                        <div onClick={() => fetchFiles(selectedRepo, currentPath.split('/').slice(0, -1).join('/'))} style={{ padding: '10px 16px', color: '#667eea', cursor: 'pointer', fontSize: '14px' }}>
                          {t.submit.parent_dir}
                        </div>
                      )}
                      {repoFiles.map(file => (
                        <div key={file.path} onClick={() => fetchFiles(selectedRepo, file.path)} style={{ padding: '10px 16px', background: file.type === 'dir' ? '#1a1a2e' : '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '14px' }}>{file.type === 'dir' ? '📁' : '📄'} {file.name}</span>
                          {file.name === 'SKILL.md' && <span style={{ fontSize: '10px', background: '#48bb78', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{t.submit.recommended}</span>}
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
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>{t.submit.basic_info}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{t.submit.skill_id}</label>
                  <input value={skillName} onChange={e => setSkillName(e.target.value)} placeholder={t.submit.skill_id_placeholder} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{t.submit.short_desc}</label>
                  <input value={skillDesc} onChange={e => setSkillDesc(e.target.value)} placeholder={t.submit.short_desc_placeholder} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#161625', padding: '24px', borderRadius: '12px', border: '1px solid #2d2d4a' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>{t.submit.submitter_info}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{t.submit.github_user}</label>
                  <input value={submitterName} onChange={e => setSubmitterName(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{t.submit.github_token}</label>
                  <input type="password" value={githubToken} onChange={e => setGithubToken(e.target.value)} placeholder={user ? t.submit.token_placeholder_auth : t.submit.token_placeholder_noauth} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0f', border: '1px solid #2d2d4a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            </div>

            {error && <div style={{ background: '#e53e3e20', border: '1px solid #e53e3e', padding: '12px', borderRadius: '8px', color: '#feb2b2', fontSize: '13px' }}>⚠️ {error}</div>}
            
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ padding: '16px', background: submitting ? '#333' : '#48bb78', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(72,187,120,0.2)' }}
            >
              {submitting ? t.submit.publishing : t.submit.publish_btn}
            </button>
          </div>

          {/* Right Column: Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ background: '#161625', borderRadius: '12px', border: '1px solid #2d2d4a', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #2d2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#888' }}>{t.submit.editor_title}</span>
                <span style={{ fontSize: '11px', color: '#555' }}>Markdown 支持</span>
              </div>
              <textarea
                value={skillContent}
                onChange={e => setSkillContent(e.target.value)}
                placeholder={t.submit.editor_placeholder}
                style={{ flex: 1, width: '100%', padding: '20px', background: 'transparent', border: 'none', color: '#d1d1d1', fontSize: '13px', fontFamily: '"Fira Code", monospace', outline: 'none', resize: 'none', lineHeight: '1.6' }}
              />
            </div>
          </div>

        </div>

        {/* Results / Steps */}
        {result && (
          <div style={{ marginTop: '32px', background: '#161625', padding: '24px', borderRadius: '12px', border: `1px solid ${result.manual ? '#ed8936' : '#48bb78'}` }}>
            <h3 style={{ margin: '0 0 12px', color: result.manual ? '#ed8936' : '#48bb78' }}>{result.manual ? t.submit.manual_title : t.submit.success_title}</h3>
            {result.manual ? (
              <pre style={{ background: '#0a0a0f', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', border: '1px solid #2d2d4a' }}>{result.guide}</pre>
            ) : (
              <div>
                <p style={{ margin: '0 0 16px', color: '#aaa' }}>{t.submit.pr_waiting}</p>
                <a href={result.prUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#48bb78', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>{t.submit.view_pr}</a>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', margin: '48px 0', fontSize: '14px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none' }}>{t.submit.back_home}</a>
        </div>

      </div>
    </div>
  );
}
