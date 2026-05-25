// Vercel serverless function — wraps TanStack Start's Web Fetch handler
// dist/server/server.js is included via "includeFiles" in vercel.json
import { Readable } from 'node:stream';

let appPromise = null;

function getApp() {
  if (!appPromise) {
    // Dynamic import so esbuild leaves it external; dist/server/** is included via vercel.json
    appPromise = import('../dist/server/server.js').then((m) => m.default);
  }
  return appPromise;
}

export default async function handler(req, res) {
  const app = await getApp();

  const protocol = req.headers['x-forwarded-proto'] ?? 'https';
  const host = req.headers['x-forwarded-host'] ?? req.headers.host ?? 'localhost';
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : String(value));
    }
  }

  const isBodyless = ['GET', 'HEAD'].includes(req.method ?? '');
  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    ...(isBodyless ? {} : { body: Readable.toWeb(req), duplex: 'half' }),
  });

  const response = await app.fetch(request);

  res.statusCode = response.status;
  for (const [key, value] of response.headers) {
    res.setHeader(key, value);
  }

  if (response.body) {
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      res.end();
    }
  } else {
    res.end();
  }
}
