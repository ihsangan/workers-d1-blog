import { Env } from './index';

export default async function sitemap(request: Request, env: Env): Promise < Response > {
  try {
    const query = 'SELECT url, time FROM blog_posts ORDER BY time ASC';
    const { results } = await env.DB.prepare(query).all();
    let xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${env.BASEURI}</loc>`;
    if (results.length > 0) {
      xmlResponse += `
    <lastmod>${new Date(results.at(-1).time).toISOString()}</lastmod>`;
    }
    xmlResponse += `
  </url>`;
    if (results.length > 0) {
      results.forEach(result => {
        const ISOTime = new Date(result.time).toISOString();
        xmlResponse += `
  <url>
    <loc>${env.BASEURI}post/${result.url}</loc>
    <lastmod>${ISOTime}</lastmod>
  </url>`;
      });
    }
    xmlResponse += `
</urlset>`;
    return new Response(xmlResponse, {
      headers: {
        'content-type': 'application/xml;charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}