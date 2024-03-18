(() => {
  // test-jsx.tsx
  function createElement(type, props, ...args) {
    const children = args.length ? [].concat(...args) : null;
    return { type, props, children };
  }
  function render(vnode) {
    if (vnode.split)
      return document.createTextNode(vnode);
    let element = document.createElement(vnode.type);
    let props = vnode.props || {};
    Object.keys(props).forEach((k) => element.setAttribute(k, props[k]));
    (vnode.children || []).forEach((c) => element.appendChild(render(c)));
    return element;
  }
  var ITEMS = "hello there people".split(" ");
  var list = (items) => items.map((p) => /* @__PURE__ */ createElement("li", null, " ", p, " "));
  var vdom = /* @__PURE__ */ createElement("div", { id: "foo" }, /* @__PURE__ */ createElement("p", null, "Look, a simple JSX DOM renderer!"), /* @__PURE__ */ createElement("ul", null, list(ITEMS)));
  var dom = render(vdom);
  document.body.appendChild(dom);
})();
