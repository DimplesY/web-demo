const http = require('http')

// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello NodeJS!\n');
// }).listen(Math.round((1 + Math.random()) * 2000), '127.0.0.1');

process.on('message', (e) => {
  console.log(e)
  setTimeout(() => {
    process.send('你好啊')
  }, 1000)
})
