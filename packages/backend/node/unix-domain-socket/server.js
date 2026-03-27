const net = require('net');
const path = '/tmp/myapp.sock';

try {
  require('fs').unlinkSync(path);
} catch (err) {
}

const server = net.createServer((socket) => {
  console.log('客户端已连接');

  socket.on('data', (data) => {
    console.log('收到数据:', data.toString());
    socket.write('服务器收到了你的消息');
  });

  socket.on('end', () => {
    console.log('客户端断开连接');
  });

  socket.on('error', (err) => {
    console.error('socket 错误:', err);
  });
});

server.listen(path, () => {
  console.log(`Unix Socket 服务器监听在 ${path}`);
});

server.on('error', (err) => {
  console.error('服务器错误:', err);
});
