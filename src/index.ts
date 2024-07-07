import htmlCreate from './public/new.html';
import { basicAuth } from './helpers';
import createDB from './createdb';
import getDB from './readdb';
import home from './homepage';
import sitemap from './sitemap';
import editDB from './edit';
import html404 from './public/404.html';
const robots = `User-agent: *
Allow: /`;

export interface Env {
  BLOGNAME: string;
  BASEURI: string;
  DB: D1Database;
  USERNAME: string;
  PASSWORD: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const uriPath = new URL(request.url).pathname;

    if (uriPath === '/new' || uriPath === '/create') {
      const authResponse = basicAuth(request, env);
      if (authResponse) {
        return authResponse;
      }
    }

    if (uriPath === '/new') {
      return new Response(htmlCreate, {
        headers: {
          'content-type': 'text/html;charset=utf-8'
        }
      });
    } else if (uriPath === '/create') {
      return await createDB(request, env);
    } else if (uriPath.startsWith('/post/')) {
      return await getDB(request, uriPath, env);
    } else if (uriPath.startsWith('/edit/')) {
      return await editDB(request, uriPath, env);
    } else if (uriPath === '/') {
      return await home(request, env);
    } else if (uriPath === '/sitemap.xml') {
      return await sitemap(request, env);
    } else if (uriPath === '/robots.txt') {
      return new Response(robots);
    } else {
      return new Response(html404, {
        status: 404,
        headers: {
          'content-type': 'text/html;charset=utf-8'
        }
      });
    }
  }
};