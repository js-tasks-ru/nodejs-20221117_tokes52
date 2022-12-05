const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

const FILE_SIZE_LIMIT = 1024 ** 2; // 1mb

server.on('request', async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    switch (req.method) {
      case 'POST': {
        const paths = pathname.split('/');
        if (paths.length > 1) {
          res.statusCode = 400;
          res.end('No nested directories supported');
          return;
        }

        const filepath = path.join(__dirname, 'files', pathname);
        try {
          await fs.promises.stat(filepath);
          res.statusCode = 409;
          res.end('Already exists');
          return;
        } catch (e) {
          console.log('the file does not exists and will be created');
        }

        const limitedStream = new LimitSizeStream({limit: FILE_SIZE_LIMIT});
        const writeStream = fs.createWriteStream(filepath);

        limitedStream.on('end', () => {
          res.statusCode = 201;
          res.end('OK');
        });

        limitedStream.on('error', (e) => {
          if (e instanceof LimitExceededError) {
            fs.unlink(filepath, () => {
              res.statusCode = 413;
              res.end('File is too big');
            });
            return;
          }
          res.statusCode = 500;
          res.end(e.message || 'Internal server error');
        });

        req.on('error', (e) => {
          if (e.code === 'ECONNRESET') {
            fs.unlink(filepath, () => {
              console.log('lost connection, file has been deleted');
            });
          }
        });

        limitedStream.pipe(writeStream);
        req.pipe(limitedStream);

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
