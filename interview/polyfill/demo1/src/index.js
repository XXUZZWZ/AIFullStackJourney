import { resolve } from "styled-jsx/css";

const arr = Array.from({ length: 3 }, (_, i) => i);

console.log(arr);

if (arr.includes(1)) {
  console.log("包含1");
}

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
