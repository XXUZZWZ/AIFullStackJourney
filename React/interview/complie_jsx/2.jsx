"use strict";

// es6 语法形式
var a = 1;
console.log(a);
// (async () => {
//   console.log(a);
//   await new Promise((resolve) => setTimeout(resolve, 1000));
// })();

var element = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Hello, world!"), /*#__PURE__*/React.createElement("h2", null, "It is ", new Date().toLocaleTimeString(), "."));
var element2 = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/
  React.createElement("li",
   {
  key: "abx1"
}, "1"),
 /*#__PURE__*/React.createElement("li", {
  key: "abx2"
}, "2"), /*#__PURE__*/React.createElement("element", null), /*#__PURE__*/React.createElement("element2", null), /*#__PURE__*/React.createElement("li", {
  key: "abx3"
}, "3")));
