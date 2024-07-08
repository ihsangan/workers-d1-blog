import html401 from './public/401.html';
import html403 from './public/403.html';
import { Env } from './index';

export function convertTime(request: Request, time: number): string {
  const lang = request.headers.get('accept-language') || 'en-US';
  const tz = request.cf?.timezone || 'UTC';
  return new Intl.DateTimeFormat(lang.slice(0, 5), {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: tz
  }).format(new Date(time));
}

export function basicAuth(request: Request, env: Env): Response | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(html401, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Login required"',
        'content-type': 'text/html;charset=utf-8'
      }
    });
  }
  const encodedCredentials = authHeader.split(' ')[1];
  const decodedCredentials = atob(encodedCredentials).split(':');
  const username = decodedCredentials[0];
  const password = decodedCredentials[1];
  if (username === env.USERNAME && password === env.PASSWORD) {
    return null;
  } else {
    return new Response(html403, {
      status: 403,
      headers: {
        'content-type': 'text/html;charset=utf-8'
      }
    });
  }
}

export function MDrewrite(str: string): string {
  let markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let urlOnlyRegex = /\[([^\]]+)\]/g;
  str = str.replace(markdownRegex, (match, url, note) => {
    return `<a href="${url}">${note.trim()}</a>`;
  });
  str = str.replace(urlOnlyRegex, (match, url) => {
    return `<a href="${url}">${url}</a>`;
  });
  return str.replace(/(?:\r\n|\r|\n)/g, '<br/>');
}