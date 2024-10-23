const { createConnection } = require("node:net")

const client = createConnection({
  host: 'localhost',
  port: 8080
}, () => {
  console.log('连接到服务端')
})


client.on('data', (data) => {
  console.log('接受到数据,', Buffer.from(0x11))
  client.write('hello')
  client.end()
})

client.write('hello')
