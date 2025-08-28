interface Animal{
  name:string;
}
interface Animal {
  age:number;
}
// 同名声明自动合并
const dog:Animal = {
  name:"dog",
  age:3
}

const dragon:Animal = {name:'奶龙',age:100}

type AnimalType = { name : string}
// type AnimalType = { age:number  } 报错

// type 不支持合并，重复声明不符合