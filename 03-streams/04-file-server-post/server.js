const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const removeFile = function (filepath) {
  fs.unlink(filepath, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal server error');
      return;
    }
  });
};

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
    case 'POST':
      // проверка на существование файла
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          // создаем файл только если ошибка - файла не существует
          // в противном случае 500
          if (err.code !== 'ENOENT') {
            res.statusCode = 500;
            res.end('Server internal error');
            return;
          }

          const limitedStream = new LimitSizeStream({ limit: 1 * 1024 * 1024 }); // 1мб
          const outStream = fs.createWriteStream(filepath);

          // завершение соединения
          req.on('close', () => {
            // удаляем файл если обрыв
            if (!req.complete) {
              limitedStream.destroy();
              outStream.destroy();

              removeFile(filepath);
            }
          });

          // успещное выполнение
          outStream.on('finish', () => {
            res.statusCode = 201;
            res.end('File is write');
            return;
          });

          req
            .pipe(limitedStream)
            .on('error', error => {
              outStream.destroy();

              // если ошибка в превышении лимита
              if (error.code === 'LIMIT_EXCEEDED') {
                removeFile(filepath);

                res.statusCode = 413;
                res.end(`${error.name}: ${error.message}`);
                return;
              }

              // какая-то другая
              res.statusCode = 500;
              res.end('Internal server error');
              return;
            })

            .pipe(outStream)
            .on('error', error => {
              res.statusCode = 500;
              res.end(`${error.name}: ${error.message}`);
              return;
            });
          return;
        } 

        res.statusCode = 409;
        res.end('The file is already on disk');
        return;
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
