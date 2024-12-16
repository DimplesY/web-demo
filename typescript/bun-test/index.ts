import figlet from "figlet"

Bun.serve({
  port: 3000,
  fetch(request, server) {
    const body = figlet.textSync("Hello World")
    return new Response(body)
  },
})
