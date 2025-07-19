# JSX 考点

- 何为 JSX?

  - JS in XML ()
  - 在 .js 或 .jsx 文件中混合使用 HTML-like 标签和 JavaScript 逻辑。
  - React 推崇的 Javascript 语法扩展，允许在 JavaScript 中嵌入 HTML 结构。
  - 常用于 React 组件的定义，使得 UI 结构更加直观已读。
  - JSX 会被编译工具（如 Babel）转换为 React.createElement() 调用(本质是语法糖) - 例如:

  ```jsx
  const Greeting = ({ name }) => (
    <div className="greet">
      <h1>Hello, {name}!</h1>
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
  // 编译后结果（简化）
  const Greeting = ({ name }) =>
    React.createElement(
      "div",
      { className: "greet" },
      React.createElement("h1", null, "Hello, ", name, "!"),
      React.createElement(
        "p",
        null,
        "Today is ",
        new Date().toLocaleDateString()
      )
    );
  ```

- JSX 可以直接运行吗？
  - 不可以
- JSX --编译-> React.createElement(type, props, children)--->当 render()时，React.createElement()会返回一个对象，React DOM 会用这个对象来创建 DOM 节点。
- global.styl --> global.css

```jsx
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```
