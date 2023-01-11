import { initMixin } from './init'

function Vue(options) {
  if (!(this instanceof Vue)) {
    console.warn('只能够使用new Vue()的方式来创建实例')
    return
  }
  this._init(options)
}

initMixin(Vue)

export default Vue
