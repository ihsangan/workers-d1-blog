import { Env } from './index';
import { convertTime, MDrewrite } from './helpers';
import html404 from './public/404.html';

export default async function getDB(request: Request, path: string, env: Env): Promise<Response> {
  const key = path.slice(6);
  try {
    const query = 'SELECT * FROM blog_posts WHERE url = ?';
    const result = await env.DB.prepare(query).bind(key).first();
    if (!result) {
      throw new Error('Not found');
    }
    const cvTime = convertTime(request, result.time);
    const ISOTime = new Date(result.time).toISOString();
    const htmlPage = `<!doctype html>
<html>
<head>
  <title>${result.title} | ${env.BLOGNAME}</title>
  <meta name="description" property="og: description" content="${env.DESCRIPTION}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  body{font-family:sans-serif}@media(prefers-color-scheme:dark){body{background:#222;color:#fff}}
  </style>
</head>
<body>
  <a href="${env.BASEURI}">Home</a> > post
  <hr>
  <h2>${result.title}</h2>
  <time itemprop="datePublished" datetime="${ISOTime}" style="font-size:14px;opacity:0.6">${cvTime}</time>
  <hr>
  <div style="white-space:pre-wrap">
${MDrewrite(result.content)}
  </div>
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