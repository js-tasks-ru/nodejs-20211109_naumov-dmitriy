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
    case 'GET':
      // проверка на существование файла
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('File not found');
          return;
        }
    
        // отправка файла
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
    
        stream.on('error', (error) => {
          res.statusCode = 500;
          res.end('Internal server error');
          return;
        });
    
        req.on('close', function() {
          stream.destroy();
        });
      });      
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
