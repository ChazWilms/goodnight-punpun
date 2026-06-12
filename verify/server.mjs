// Tiny static server + screenshot sink for headless verification.
// node verify/server.mjs [port]   — beacons print to stdout, canvas shots land in /tmp/ppshots
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = parseInt(process.argv[2] || '8444');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = '/tmp/ppshots';
fs.mkdirSync(SHOTS, { recursive: true });
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.json': 'application/json',
};

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (req.method === 'POST' && u.pathname === '/__shot') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', () => {
      try {
        const { name, data } = JSON.parse(body);
        const safe = String(name).replace(/[^a-z0-9_.-]/gi, '');
        fs.writeFileSync(path.join(SHOTS, safe + '.png'), Buffer.from(data.split(',')[1], 'base64'));
        console.log('SHOT ' + safe);
      } catch (e) { console.log('SHOT-ERR ' + e.message); }
      res.end('ok');
    });
    return;
  }
  if (u.pathname.startsWith('/__')) {
    console.log('BEACON ' + decodeURIComponent(u.pathname.slice(2)));
    res.end('ok');
    return;
  }
  const f = path.join(root, u.pathname === '/' ? 'index.html' : decodeURIComponent(u.pathname));
  try {
    const data = fs.readFileSync(f);
    res.setHeader('content-type', mime[path.extname(f)] || 'application/octet-stream');
    res.setHeader('cache-control', 'no-store');
    res.end(data);
  } catch (e) {
    res.statusCode = 404; res.end('not found');
  }
}).listen(PORT, () => console.log('READY ' + PORT));
