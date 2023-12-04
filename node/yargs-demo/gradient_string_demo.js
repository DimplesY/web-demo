const gradient = require('gradient-string')


const result = gradient([
  { color: '#42d392', pos: 0 },
  { color: '#42d392', pos: 0.1 },
  { color: '#647eff', pos: 1 }
])('Vue.js - The Progressive JavaScript Framework')


console.log(result)
