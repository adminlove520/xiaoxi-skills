// List user repositories
// GET /api/github/repos

export async function GET(request) {
  const token = request.cookies.get('gh_token')?.value;
  
  if (!token) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      return Response.json({ success: false, error: error.message }, { status: res.status });
    }

    const repos = await res.json();
    return Response.json({
      success: true,
      repos: repos.map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        url: r.html_url,
        private: r.private
      }))
    });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
