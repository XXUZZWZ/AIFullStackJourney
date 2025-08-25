var a = 0
console.log(a,window.a)
if(true){
  a=2
  console.log(a,window.a)
  function a (){}
  console.log(a,window.a)
  a=3
  console.log(a,window.a)

  console.log('里面',a)
}

console.log('外面',a)