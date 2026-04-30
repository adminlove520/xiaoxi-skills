// List files in a repository
// GET /api/github/files?repo=owner/repo&path=path

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');
  const path = searchParams.get('path') || '';
  const token = request.cookies.get('gh_token')?.value;
  
  if (!token) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!repo) {
    return Response.json({ success: false, error: 'Repo parameter required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      return Response.json({ success: false, error: error.message }, { status: res.status });
    }

    const contents = await res.json();
    
    // If it's a file, it will be an object. If directory, an array.
    if (Array.isArray(contents)) {
      return Response.json({
        success: true,
        type: 'dir',
        files: contents.map(f => ({
          name: f.name,
          path: f.path,
          type: f.type, // 'file' or 'dir'
          sha: f.sha,
          size: f.size,
          download_url: f.download_url
        }))
      });
    } else {
      return Response.json({
        success: true,
        type: 'file',
        file: {
          name: contents.name,
          path: contents.path,
          content: contents.content, // base64
          encoding: contents.encoding,
          download_url: contents.download_url
        }
      });
    }
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
