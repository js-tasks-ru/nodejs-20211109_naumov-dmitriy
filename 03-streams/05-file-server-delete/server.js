const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = '400';
    res.end('Subfolders are not supported');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      // проверка на существование файла
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('File not found');
          return;
        }

        // удаление файла
        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end('Internal server error');
            return;
          }

          res.statusCode = 200;
          res.end('File deleted successfully');
        });
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
