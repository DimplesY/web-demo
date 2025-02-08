
function sleep(ms = 2000) {
  return new Promise((rs) => {
    setTimeout(() => {
      rs(Date.now())
    }, ms)
  })
}

const funcs = [
  () => sleep(),
  () => sleep(),
  () => sleep(),
  () => sleep(),
]

async function pipeline(handles) {
  let p = Promise.resolve()
  for(let i = handles.length - 1; i >= 0; i--) {
    p = p.then(res => Promise.resolve(res).then(handles[i]).then(res => {
      console.log(res)
      return res
    }))
  }

  return p
}


pipeline(funcs)
