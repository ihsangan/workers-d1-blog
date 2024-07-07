import { Env } from './index';

export default async function createDB(request: Request, env: Env): Promise<Response> {
  const fData = await request.formData();
  const title = fData.get('title') as string;
  const cURL = (fData.get('url') as string) || title.toLowerCase().replace(/\s+/g, '-');
  const content = fData.get('content') as string;
  const time = Date.now();
  const query = 'INSERT INTO blog_posts (title, url, time, content) VALUES (?, ?, ?, ?)';
  await env.DB.prepare(query).bind(title, cURL, time, content).run();
  const html = `<!doctype html>
<html>
<head>
  <title>Created</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  body{font-family:sans-serif}@media(prefers-color-scheme:dark){body{background:#222;color:#fff}}
  </style>
</head>
<body>
  <h2>Post created</h2>
  <p><a href="/post/${cURL}">${title}</a></p>
  <p>Return to <a href="${env.BASEURI}">home</a>.</p>
</body>
</html>`;
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=utf-8'
    }
  });
}