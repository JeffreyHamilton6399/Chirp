const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

let express;
let ExpressPeerServer;
try {
  express = require('express');
  ({ ExpressPeerServer } = require('peer'));
} catch (err) {
  console.error('Missing dependencies.');
  console.error('Run "npm.cmd install" once, then run "npm.cmd start".');
  process.exit(1);
}

const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const app = express();
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  path: '/',
  proxied: true,
});

function clientId(client) {
  return typeof client?.getId === 'function' ? client.getId() : String(client || 'unknown');
}

function localUrls() {
  const urls = [`http://localhost:${PORT}`];
  Object.values(os.networkInterfaces()).flat().forEach(net => {
    if (!net || net.internal || net.family !== 'IPv4') return;
    urls.push(`http://${net.address}:${PORT}`);
  });
  return urls;
}

app.use('/peerjs', peerServer);

app.use(express.static(ROOT, {
  etag: false,
  index: false,
  maxAge: 0,
  setHeaders(res) {
    res.setHeader('cache-control', 'no-cache');
  },
}));

app.use((req, res) => {
  if (req.method !== 'GET') {
    res.sendStatus(404);
    return;
  }
  res.setHeader('cache-control', 'no-cache');
  res.sendFile(path.join(ROOT, 'index.html'));
});

peerServer.on('connection', client => {
  console.log(`[peer] connected ${clientId(client)}`);
});

peerServer.on('disconnect', client => {
  console.log(`[peer] disconnected ${clientId(client)}`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Chirp app:');
  localUrls().forEach(url => console.log(`  ${url}`));
  console.log('PeerJS signaling: /peerjs');
});
