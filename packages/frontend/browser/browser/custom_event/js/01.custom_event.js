;(function (window) {
  // 自定义 event
  const myEvent = new Event('myCustomEvent', {
    // 是否事件冒泡
    bubbles: true,
    // 是否可以取消默认行为
    cancelable: true,
  })

  // 监听自定义事件
  document.addEventListener('myCustomEvent', (e) => {
    console.log(e)
  })

  // 按钮点击
  window.handleClick = function () {
    document.dispatchEvent(myEvent)
  }
})(window)
