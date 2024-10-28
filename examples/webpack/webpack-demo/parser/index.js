const { Parser } = require('webpack')

class MyParaser extends Parser {
  constructor(options) {
    super()
    this.options = options || {}
  }
  
  parse(source, state) {
    console.log(source)
    return state
  }
}

module.exports = MyParaser
