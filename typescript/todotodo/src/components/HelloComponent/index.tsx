import React from 'react'
// 如何约束函数的返回的值ReactNode ? jsx
// FC = Function Component
// 如何约定函数·参数？
interface Props{
  name:string
}
// 什么叫做typescript 类型约束，重要的地方一定要类型约束。
// 泛型 泛只内部的类型
const  HelloComponent: React.FC<Props> = (props:Props) =>{
    return (<div>hello ts {props.name}</div>);
 }

 export default HelloComponent