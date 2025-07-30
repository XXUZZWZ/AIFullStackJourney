
import HelloComponent from './components/HelloComponent/index.tsx'
import './App.css'

// react + typescript
// javascript 可能会有一些问题，主要是因为弱类型。
// jsx 后缀改成tsx 
function App() {
  // 编译阶段 进行类型检查
  // 多了类型声明
 // 多写一些代码 类型声明 代码质量保驾护航

// 对函数进行类型约束
//  const HelloComponent = () =>{
//   // return <div>hello</div>
//   // void 返回void
//   return 1;
//  }
  let count:number = 10;
 count = "fsfsf".charCodeAt(0);
 const title:string = "hello ts world";
 count = 2;  
 const isDone : boolean = true;
 const list:number[]   = [1,2,3];
  // 元组类型

 const tuple:[string,number] = ["1",2];
 // 元组类型
 const Status = {
  Pending: 0,
  Fullfilled: 1,
  Rejected: 2,
} as const;
type StatusType = typeof Status[keyof typeof Status];
 const pStatus:StatusType= Status.Pending;
 // 对象的类型 约束
 interface User {
  name:string;
  age:number;
  isSingle?:boolean;
 }
 // 使用接口来约定类型
 // 接口类定义 要用分号隔开
 const user:User = {
  name:"Mary",
  age:18,
  isSingle:true
 }

  return (
    <>{isDone}
      {tuple[1]}
      {pStatus}
      {count}
      {title}
      {list.map(item => item)}
      {user.name}
      {user.age}
      {/* typescript 很严格 */}
      <HelloComponent name='大佬'  />
    </>
  )
}

export default App
