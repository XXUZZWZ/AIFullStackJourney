// test.js
console.log("test.js");
let colors = ["#FFB6C1", "#87CEFA", "#90EE90", "#FFD700", "#FFA07A", "#DDA0DD"];
let idx = 0;
setInterval(() => {
  document.body.style.backgroundColor = colors[idx % colors.length];
  idx++;
}, 1000);
// npx create-next-app@latest my-todos