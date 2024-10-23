
const { createServer } = require('node:net')


const server = createServer((socket) => {
  socket.on('connect', () => {
    console.log('有新的客户端建立连接')
  })

  socket.on('data', (data) => {
    console.log('接受到数据,', data.toString())
    socket.write('你好，我是服务器')
  })
})


server.listen(8080, () => {
  console.log('服务器启动成功')
})
