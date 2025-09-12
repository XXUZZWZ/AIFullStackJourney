/**
 *
 * @param {*} text
 * @returns {Object} VDOM
 */
// 创建一个文本节点
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 *
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @returns {Object} VDOM
 */
function createElement(type, props, ...children) {
  // 对参数的抽象 ，基于真实dom 的抽象出 type props children
  // 递归思想
  return {
    type,
    props: {
      ...props,
      children: children.map(
        (child) =>
          typeof child === "object" ? child : createTextElement(child) //所有节点的叶子节点
      ),
    },
  };
}

function render(element, container) {
  //  不考虑fc
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = (key) => key !== "children"; // 判断是否为属性

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name]; // setAttribute 简单写法
      // dom.setAttribute(name, element.props[name]);
    });
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}
// namespace

const Didact = {
  createElement, // 生成VDOM ,一次生成，内存中
  render, // 挂载生成真实DOM
};

// 之后 Babel 转成 Didact.createElement()
const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("br", null)
);

console.log(element);

// 之后 Babel 转成 Didact.render()
Didact.render(element, document.getElementById("root"));
