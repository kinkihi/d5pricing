import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('../web/', import.meta.url)));
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 4173);
const clients = new Set();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const reload = `<script>const live=new EventSource('/__live');live.onmessage=()=>{sessionStorage.setItem('d5-preview-scroll',scrollY);location.reload()};addEventListener('load',()=>{const y=sessionStorage.getItem('d5-preview-scroll');if(y){scrollTo(0,+y);sessionStorage.removeItem('d5-preview-scroll')}});</script>`;
http.createServer(async (req,res) => {
  if (req.url === '/__live') {res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': connected\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;}
  try {
    const url = new URL(req.url,'http://localhost');
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if(!file.startsWith(root + path.sep) && file !== path.join(root,'index.html')) {res.writeHead(403).end();return;}
    if(!(await stat(file)).isFile()) throw new Error('Not a file');
    let data = await readFile(file);
    if(file.endsWith('.html')) data=Buffer.from(data.toString().replace('</body>',reload+'</body>'));
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  } catch {res.writeHead(404).end('Not found');}
}).listen(port,'0.0.0.0',()=>console.log(`D5 live preview ready on http://localhost:${port}`));
let pending;
watch(root,{recursive:true},()=>{clearTimeout(pending);pending=setTimeout(()=>clients.forEach(c=>c.write('data: reload\n\n')),180);});
