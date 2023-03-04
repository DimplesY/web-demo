const { fork, spawn, exec, execFile } = require('child_process')
// const os = require('os')

// const sender = fork('./work.js')
// sender.send('Hello')
// sender.on('message', (e) => {
//   console.log(e)
// })

const log = spawn('node', ['log.js'])

log.stdout.on('data', (e) => console.log(e.toString()))
