

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface ExecuteContext {
  ws: WebSocket
  close: () => void
}

interface Command {
  execute(context?: ExecuteContext): void | Promise<void>
}

class UpCommand implements Command {
  async execute(context?: ExecuteContext) {
    console.time('Up')
    context?.ws.send(JSON.stringify({ data: 0x21010202 }))

    console.timeEnd('Up')
  }
}

class DownCommand implements Command {
  async execute() {
    console.time('Down')
    await sleep(1000)
    console.log('Down')
    console.timeEnd('Down')
  }
}

class LeftCommand implements Command {
  async execute() {
    console.time('Left')
    await sleep(1000)
    console.log('Left')
    console.timeEnd('Left')
  }
}

class RightCommand implements Command {
  async execute() {
    console.time('Right')
    await sleep(1000)
    console.log('Right')
    console.timeEnd('Right')
  }
}



class Invoker {
  private taskList: Command[]
  private inProcess: boolean
  constructor(private upCommand: Command, private downCommand: Command, private leftCommand: Command, private rightCommand: Command) {
    this.taskList = [] as Command[]
    this.inProcess = false
  }


  up() {
    this.taskList.push(this.upCommand)
  }

  down() {
    this.taskList.push(this.downCommand)
  }

  left() {
    this.taskList.push(this.leftCommand)
  }

  right() {
    this.taskList.push(this.rightCommand)
  }

  async execute(context?: ExecuteContext) {
    if (this.inProcess) {
      return
    }
    this.inProcess = true
    while (this.taskList.length > 0) {
      await this.taskList.shift()?.execute(context)
    }
    this.inProcess = false
  }
}


const invoker = new Invoker(new UpCommand(), new DownCommand(), new LeftCommand(), new RightCommand())

document.addEventListener("keydown", async e => {

  const key = e.key
  switch (key) {
    case 'ArrowUp':
      invoker.up()
      break
    case 'ArrowDown':
      invoker.down()
      break
    case 'ArrowLeft':
      invoker.left()
      break
    case 'ArrowRight':
      invoker.right()
      break
  }
  const context = await createExecutionContext('ws://localhost:3000')
  invoker.execute(context)
})


async function createExecutionContext(url: string): Promise<ExecuteContext> {
  let connectionMap: Map<string, WebSocket> = new Map()

  function getWebSocket(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if(connectionMap.has(url)){
        resolve(connectionMap.get(url)!)
      }else {
        const ws = new WebSocket(url)
        ws.onopen = () => {
          connectionMap.set(url, ws)
          resolve(ws)
        }
        ws.onerror = reject
      }
    })
  }

  function close() {
    const ws = connectionMap.get(url)
    if (ws) {
      ws.close()
      connectionMap.delete(url)
    }
  }

  return {
    ws: await getWebSocket(),
    close
  }
}
