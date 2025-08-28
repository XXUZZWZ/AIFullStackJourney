
// js 是弱类型 容易出问题
// ts 带来类型约束
// ts 是微软，想让java 工程师写前端
// react + ts 是开发的标配
// 自定义类型
interface User{
  name:string;
  age:number;
}
type nameProltrol ={
  name:string;
}

type ageProltrol ={
  age:number;
}

//相同点，都可以生成自定义声明自定义类型

type UserProltrol = ageProltrol & nameProltrol;

const u1:User = {
  name:"name",
  age:18
};
const u2:UserProltrol = {
  name:"卢的高傲",
  age:21
}