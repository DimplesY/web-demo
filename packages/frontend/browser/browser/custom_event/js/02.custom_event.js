;(function (window) {
  // 自定义 event
  const myEvent = new CustomEvent('myCustomEvent', {
    // 可以添加任意属性
    detail: {
      helle: 'world',
    },
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
