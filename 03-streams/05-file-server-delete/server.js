const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    switch (req.method) {
      case 'DELETE': {
        const paths = pathname.split('/');
        if (paths.length > 1) {
          res.statusCode = 400;
          res.end('No nested directories supported');
          return;
        }

        const filepath = path.join(__dirname, 'files', pathname);
        await fs.promises.unlink(filepath);
        res.statusCode = 200;
        res.end('OK');
      }
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    res.statusCode = 500;
    res.end('Internal error');
  }
});

module.exports = server;
