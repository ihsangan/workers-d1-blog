import { Env } from './index';
import { convertTime } from './helpers';

export default async function home(request: Request, env: Env): Promise<Response> {
  const query = 'SELECT title, url, time FROM blog_posts ORDER BY time DESC';
  const { results } = await env.DB.prepare(query).all();
  let htmlPage = `<!doctype html>
<html>
<head>
  <title>Homepage | ${env.BLOGNAME}</title>
  <meta name="description" property="og: description" content="${env.DESCRIPTION}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta itemprop="dateModified" content="${new Date(results[0].time).toISOString()}">
  <style>
  body{font-family:sans-serif}@media(prefers-color-scheme:dark){body{background:#222;color:#fff}}
  </style>
</head>
<body>
  <h1>${env.BLOGNAME}</h1>
  <div>
  ${env.DESCRIPTION}
  </div>
  <hr>`;
  results.forEach(result => {
    const cvTime = convertTime(request, result.time);
    htmlPage += `
  <h2><a href="/post/${result.url}">${result.title}</a></h2>
  <div style="font-size:14px;opacity:0.6">${cvTime}</div>
  <hr>`;
  });
  htmlPage += `
</body>
</html>`;
  return new Response(htmlPage, {
    headers: {
      'content-type': 'text/html;charset=utf-8'
    }
  });
}