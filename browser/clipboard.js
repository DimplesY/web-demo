

const clipboard = async (text) => {

  if(navigator.clipboard?.writeText){
    try{
      await navigator.clipboard.writeText(text)
      return
    }catch(e) {
      console.log(e)
    }
  }

  const span = document.createElement('span')
  span.textContent = text

  span.style.whiteSpace = 'pre'

  document.body.appendChild(span)

  const selection = window.getSelection()
  const range = window.document.createRange()

  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)

  try{
    window.document.execCommand('copy')
  } catch(e) {
    console.error(e)
  }

  selection.removeAllRanges()
  window.document.body.removeChild(span)

}
