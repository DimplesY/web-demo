/** @jsx createElement */

function createElement(type: string | Function, props: any, ...args: any[]) {
  const children = args.length ? [].concat(...args) : null
  return { type, props, children }
}

function render(vnode: any) {
  if (vnode.split) return document.createTextNode(vnode)

  let element = document.createElement(vnode.type)

  let props = vnode.props || {}
  Object.keys(props).forEach((k) => element.setAttribute(k, props[k]))

  ;(vnode.children || []).forEach((c) => element.appendChild(render(c)))

  return element
}

const ITEMS = 'hello there people'.split(' ');

let list = items => items.map( p => <li> {p} </li> );
 
let vdom = (
    <div id="foo">
        <p>Look, a simple JSX DOM renderer!</p>
        <ul>{ list(ITEMS) }</ul>
    </div>
);
 
let dom = render(vdom);
 
document.body.appendChild(dom);
 