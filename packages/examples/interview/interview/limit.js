function limit(signal, request) {

  const tasks = []

  async function run() {
    if(signal > 0 && tasks.length > 0) {
      const task = tasks.shift()
      if(task) {
        signal--
        await task()
        signal++
        run()
      }
    }
  }

  return async (...args) => {
    return new Promise((resolve, reject) => {
      tasks.push(async () => {
        try{
          const result = await request(...args)
          resolve(result)
        }catch(e) {
          reject(e)
        }
      })

      run()
    })
  }

}
