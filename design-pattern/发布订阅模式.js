const eventBus = {
  _obj: {},
  _arr: [],
  on(fn) {
    this._arr.push(fn)
  },
  emit(key, value) {
    this._obj[key] = value
    this._arr.map((fn) => fn(this._obj))
  },
}

eventBus.on((data) => {
  if (Reflect.ownKeys(data).length === 2) {
    console.log(data)
  }
})

eventBus.emit('name', '小颜')
eventBus.emit('age', '22')
