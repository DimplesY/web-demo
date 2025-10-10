function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function* gen() {
  const arr = Array.from({ length: 10 }, (_, i) => i)
  for (const i of arr) {
    await sleep(1000)
    yield i
  }
}

(async function () { 
  for await (const i of gen()) {
    console.log(i)
  }
})()
