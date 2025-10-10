function createRenderer(opts) {
  const { createElement, insert, setElementText } = opts

  function mountElement(vnode, container) {
    const el = createElement(vnode.type)

    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    }

    insert(el, container)
  }

  function patch(n1, n2, container) {
    if (!n1) {
      mountElement(n2, container)
    } else {
      // todo patch children
    }
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        insert(null, container)
      }
    }
    container._vnode = vnode
  }

  function hydrate(vnode, container) {
    patch(container._vnode, vnode, container)
    container._vnode = vnode
  }

  return {
    render,
    hydrate,
  }
}

const counter = ref('1')

const renderer = createRenderer({
  createElement: (tag) => document.createElement(tag),
  insert: (el, container) => container.appendChild(el),
  setElementText: (el, text) => (el.textContent = text),
})

effect(() => {
  renderer.render(
    {
      tag: 'div',
      children: counter.value,
    },
    document.body
  )
})
