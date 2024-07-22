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
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const urlOnlyRegex = /\[([^\]]+)\]/g;
  const imageMarkdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;
  const codeRegex = /```(\w+)\s*([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicRegex = /\*([^*]+)\*/g;
  const newLineRegex = /(?:\r\n|\r|\n)/g;
  const headingSizes = [
    'xx-large',
    'x-large',
    'large',
    'medium',
    'small',
    'x-small'
  ];
  let codeBlocks: { [key: string]: string } = {};
  let codeBlockId = 0;
  str = str.replace(codeRegex, (match, lang, code) => {
    const id = `__CODE_BLOCK_${codeBlockId++}__`;
    codeBlocks[id] = `<pre><code class="lang-${lang}" style="font-size:12px">${code.trim()}</code></pre>`;
    return id;
  });
  str = str.replace(inlineCodeRegex, (match, code) => {
    const id = `__INLINE_CODE_${codeBlockId++}__`;
    codeBlocks[id] = `<code class="lang-none">${code.trim()}</code>`;
    return id;
  });
  str = str.replace(boldRegex, (match, text) => {
    return `<strong>${text.trim()}</strong>`;
  });
  str = str.replace(italicRegex, (match, text) => {
    return `<em>${text.trim()}</em>`;
  });
  str = str.replace(imageMarkdownRegex, (match, altText, url) => {
    return `<img src="${url.replace('://', '://i0.wp.com/').concat('?w=1280&h=1280&quality=85&ssl')}" alt="${altText.trim()}" loading="lazy">`;
  });
  str = str.replace(markdownRegex, (match, note, url) => {
    return `<a href="${url}" target="_blank">${note.trim()}</a>`;
  });
  str = str.replace(urlOnlyRegex, (match, url) => {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
  str = str.replace(headingRegex, (match, hashes, text) => {
    let level = hashes.length;
    let fontSize = headingSizes[level - 1];
    return `<div style="font-size:${fontSize}"><strong>${text.trim()}</strong></div>`;
  });
  str = str.replace(newLineRegex, '<br/>\n');

  for (const id in codeBlocks) {
    str = str.replace(id, codeBlocks[id]);
  }
  return str;
}