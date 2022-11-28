const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    switch (req.method) {
      case 'GET': {
        const paths = pathname.split('/');
        if (paths.length > 1) {
          res.statusCode = 400;
          res.end('No nested directories supported');
          return;
        }

        const filepath = path.join(__dirname, 'files', pathname);
        const read = fs.createReadStream(filepath);
        read.on('error', (e) => {
          if (e.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not found');
            return;
          }
          res.statusCode = 500;
          res.end(e.message || 'Internal server error');
        });

        read.pipe(res);
        break;
      }
      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (e) {
    res.statusCode = 500;
    res.end(e.message || 'Internal server error');
  }
});

module.exports = server;
