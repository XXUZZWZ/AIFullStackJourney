// es6 语法形式
let a = 1;
console.log(a);
// (async () => {
//   console.log(a);
//   await new Promise((resolve) => setTimeout(resolve, 1000));
// })();

const element = (
  <div>
    <h1>Hello, world!</h1>
    <h2>It is {new Date().toLocaleTimeString()}.</h2>
  </div>
);
const element2 = (
  <div>
    <ul>
     <li key= "abx1">1</li>
     <li key= "abx2">2</li>
     {<element/>} 
     {<element2/>}
     <li key= "abx3">3</li>
    </ul>
  </div>
)