/**
 * 使用自定义事件实现双击
 */
;(function (window) {
  const button = document.querySelector('button')

  const MAX_DOUBLE_CLICK_TIME = 500
  let lastClick = 0
  button.addEventListener('click', (e) => {
    const timeBetweenClicks = e.timeStamp - lastClick
    if (timeBetweenClicks > MAX_DOUBLE_CLICK_TIME) {
      lastClick = e.timeStamp
      return
    }

    const doubleClick = new CustomEvent('custom:doubleClick', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { timeBetweenClicks },
    })

    e.target.dispatchEvent(doubleClick)

    lastClick = 0
  })

  button.addEventListener('custom:doubleClick', (e) => {
    console.log('double click', e)
  })
})(window)
