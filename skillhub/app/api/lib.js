const API_BASE = '';

export async function fetchDiscover(query, source = 'all') {
  const res = await fetch(`${API_BASE}/api/discover?q=${encodeURIComponent(query)}&source=${source}`);
  if (!res.ok) throw new Error('Discover failed');
  return res.json();
}

export async function fetchLeaderboard(source = 'all') {
  const res = await fetch(`${API_BASE}/api/leaderboard?source=${source}`);
  if (!res.ok) throw new Error('Leaderboard failed');
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/api/skills`);
  if (!res.ok) throw new Error('Skills fetch failed');
  return res.json();
}

export function getInstallCommand(skill, source) {
  if (source === 'workspace' || source === 'openclaw') {
    return `cp -r ~/.openclaw/${source === 'workspace' ? 'workspace' : ''}skills/${skill.name} ~/.openclaw/skills/`;
  }
  return `clawdhub install ${skill.name}`;
}
