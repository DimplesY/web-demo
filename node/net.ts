import { createServer }  from 'node:net'
import fs from 'node:fs'


const server = createServer()

server.on('connection', (socket) => {
  socket.on('data', (data) => {
    const img = fs.readFileSync('./a.jpg')

    const httpResponse = Buffer.concat([
      Buffer.from([
        'HTTP/1.1 200 OK',
        'Content-Type: image/jpeg', // 确保Content-Type与文件类型相符
        'Content-Length: ' + img.length, // 图片的实际大小
        '', // 空行标记头部结束
      ].join('\r\n')),
      Buffer.from('\r\n'), // 分隔头部和正文的空行
      img // 图片的二进制数据
    ]);

    socket.write(httpResponse, () => {
      socket.end(); // 正确结束响应
    });

  })
})


server.listen(3000)
