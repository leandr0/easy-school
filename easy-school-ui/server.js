const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

// Load your self-signed certificate and key
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'sslcert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'sslcert', 'server.crt')),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000,'0.0.0.0' ,(err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});