const bucket = new Set()

const data = { text: 'hello world' }

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach((fn) => fn())
    return true
  },
})

function effect() {
  document.body.innerHTML = obj.text
}

effect()

console.log(bucket)

setTimeout(() => {
  obj.text = "你好，世界"
}, 2000);
