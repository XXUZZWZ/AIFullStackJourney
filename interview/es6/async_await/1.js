async function addasync() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
  return 2;
}

addasync().then((res) => {
  console.log(res);
});

const bar = () => new Promise((resolve) => resolve(5));
// 语法糖
async function foo(){
  const a = await bar();
  return a+1;
};

function fooES5(){
  return new Promise((resolve,reject)=>{
    bar().then(a=>{
      resolve(a+1);
    }).catch(reject)
  })
}
// 本质是语法糖 ，只是写法更优雅，更像同步代码那样好理解；