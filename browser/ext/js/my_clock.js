function my_clock(el) {
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  var s = today.getSeconds()
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  el.innerHTML = h + ':' + m + ':' + s
  setTimeout(function () {
    my_clock(el)
  }, 1000)
}

let a = document.getElementById('a')
let b = document.getElementById('b')
let c = document.getElementById('c')
let d = document.getElementById('d')
let e = document.getElementById('e')
let f = document.getElementById('f')
let g = document.getElementById('g')

let ji = document.getElementById('ji')
let ni = document.getElementById('ni')
let tai = document.getElementById('tai')
let mei = document.getElementById('tai')
let xianjian = document.getElementById('xianjian')
let jinitaimei = document.getElementById('jinitaimei')
let pf = document.getElementById('pf')

ji.addEventListener('click', () => {
  a.play()
})

ni.addEventListener('click', () => {
  b.play()
})

tai.addEventListener('click', () => {
  c.play()
})

mei.addEventListener('click', () => {
  d.play()
})

xianjian.addEventListener('click', () => {
  e.play()
})

jinitaimei.addEventListener('click', () => {
  f.play()
})

pf.addEventListener('click', () => {
  g.play()
})

var file = document.querySelector('input')
var img = document.querySelector('#img')

file.addEventListener('change', function (e) {
  let url = URL.createObjectURL(e.target.files[0])
  img.src = url
  img.onload = function () {
    URL.revokeObjectURL(url)
  }

  console.log(url)
})

// var clock_div = document.getElementById('clock_div')
// my_clock(clock_div)

// chrome.storage.sync.get('color', function (data) {
//   clock_div.style.color = data.color
// })

// clock_div.addEventListener('click', async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   })
// })

// function setPageBackgroundColor() {
//   let currentColor = document.body.style.backgroundColor

//   chrome.storage.sync.get('color', ({ color }) => {
//     document.body.style.backgroundColor = color
//     chrome.storage.sync.set({ color: currentColor })
//   })
// }
