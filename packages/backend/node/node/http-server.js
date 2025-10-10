const http = require("node:http")


const app = http.createServer((req, res) => { 
  if("/remote" === req.url) {
    res.writeHead(200, {
      "Content-Type": "text/html"
    })
    return res.end("Hello Remote Page\n")
  }else {
    proxy(req, res)
  }
})

function proxy(req, res) {
  let options = {
    host : req.host,
    port : 3000,
    headers: req.headers,
    path : '/remote',
    agent : false,
    method : 'GET'
  }
  
  let httpProxy = http.request(options, (response) => {
    response.pipe(res)
  })

  req.pipe(httpProxy)
}

app.listen(3000, () => {
  console.log("server start at 3000")
})
