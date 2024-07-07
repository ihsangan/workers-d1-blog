import { Env } from './index';
import html404 from './public/404.html';

export default async function (request: Request, path: string, env: Env): Promise<Response> {
  const key = path.slice(6);
  if (request.method === 'POST') {
    const fData = await request.formData();
    const title = fData.get('title');
    const url = fData.get('url');
    const content = fData.get('content');
    const deleteFlag = fData.get('delete');
    if (deleteFlag === 'true') {
      const query = 'DELETE FROM blog_posts WHERE url = ?';
      await env.DB.prepare(query).bind(key).run();
      return new Response(null, {
        status: 302,
        headers: {
          'Location': env.BASEURI
        }
      });
    } else {
      const query = 'UPDATE blog_posts SET title = ?, url = ?, content = ? WHERE url = ?';
      await env.DB.prepare(query).bind(title, url, content, key).run();
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `/post/${url}`
        }
      });
    }
  } else {
    try {
      const query = 'SELECT title, url, content FROM blog_posts WHERE url = ?';
      const result = await env.DB.prepare(query).bind(key).first();
      if (!result) {
        throw new Error('Not found');
      }
      let htmlPage = `<!doctype html>
<html>
<head>
  <title>Edit Mode</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{font-family:sans-serif}@media(prefers-color-scheme:dark){body{background:#222;color:#fff}}
  </style>
</head>
<body>
  <form method="POST" enctype="application/x-www-form-urlencoded" action="${path}">
    <label for="title">Title:</label><br/>
    <input id="title" type="text" name="title" value="${result.title}" required><br/>
    <label for="url">Custom URL:</label><br/>
    <input id="url" type="text" name="url" value="${result.url}"><br/>
    <label for="content">Content:</label><br/>
    <textarea id="content" name="content" rows="20" cols="49" required>${result.content}</textarea><br/>
    <input type="checkbox" id="delete" name="delete" value="true"> <label for="delete">Delete this post</label><br/>
    <button type="submit">edit</button><br/>
  </form>
</body>
</html>`;
      return new Response(htmlPage, {
        headers: {
          'content-type': 'text/html;charset=utf-8'
        }
      });
    } catch (error) {
      return new Response(html404, {
        status: 404,
        headers: {
          'content-type': 'text/html;charset=utf-8'
        }
      });
    }
  }
}