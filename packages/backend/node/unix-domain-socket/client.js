const net = require('net');
const path = '/tmp/myapp.sock';

const client = net.createConnection(path, () => {
  console.log('已连接到服务器');
  client.write('Hello, server!');
});

client.on('data', (data) => {
  console.log('收到服务器响应:', data.toString());
  client.end(); // 发送结束后关闭连接
});

client.on('error', (err) => {
  console.error('连接错误:', err);
});

client.on('end', () => {
  console.log('连接已关闭');
});
