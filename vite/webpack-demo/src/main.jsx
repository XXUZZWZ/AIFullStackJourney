import { aMessage } from "./message.js";
import Hello from "./Hello.jsx";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
// 引入css 文件
import "./main.css";

const container = document.getElementById("app");

// 方案一：字符串渲染（已存在的版本）
// const html = renderToString(
//   <>
//     <div>{aMessage}</div>
//     <Hello />
//   </>
// );
// container.innerHTML = html;

// 方案二：水合（注入后绑定事件与状态）
// 先服务端字符串注入（模拟 SSR 输出已在页面中）
const ssrHtml = renderToString(
  <>
    <div>{aMessage}</div>
    <Hello />
  </>
);
container.innerHTML = ssrHtml;
// 再进行水合
hydrateRoot(
  container,
  <>
    <div>{aMessage}</div>
    <Hello />
  </>
);

// 如需纯客户端渲染，则使用：
// const root = createRoot(container);
// root.render(
//   <>
//     <div>{aMessage}</div>
//     <Hello />
//   </>
// );
