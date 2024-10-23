
Bun.serve({
  port: 3000,
  fetch(request, server) {
    const ip = server.requestIP(request)
    return new Response(ip?.address)
  },
})
