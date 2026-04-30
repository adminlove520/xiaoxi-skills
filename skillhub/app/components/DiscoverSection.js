import { useState } from 'react';
import SkillCard from './SkillCard';

export default function DiscoverSection({ onDetail, onCopy }) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/discover?q=${encodeURIComponent(query)}&source=${source}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索全球 Agent Skills (ClawHub, GitHub, skill.sh...)"
          style={{
            flex: 1,
            padding: '12px 20px',
            background: '#161625',
            border: '1px solid #2d2d4a',
            borderRadius: '8px',
            color: '#fff',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{
            padding: '0 12px',
            background: '#161625',
            border: '1px solid #2d2d4a',
            borderRadius: '8px',
            color: '#fff',
            outline: 'none',
            fontSize: '14px'
          }}
        >
          <option value="all">全渠道</option>
          <option value="clawhub">ClawHub</option>
          <option value="github">GitHub</option>
          <option value="skillssh">skill.sh</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0 24px',
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '搜索中...' : '发现'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '16px', background: '#e53e3e10', border: '1px solid #e53e3e', borderRadius: '8px', color: '#feb2b2', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {results.map((skill) => (
          <SkillCard key={`${skill.source}-${skill.name}`} skill={skill} onDetail={onDetail} onCopy={onCopy} />
        ))}
        {!loading && results.length === 0 && query && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
            未找到相关技能
          </div>
        )}
      </div>
    </div>
  );
}
