# typescript + react

大型项目标配

- typescript ?
  javascript 超集

- js 开发容易出现问题

  - 类型 随意 动态
  - js 添加了类型的约定
  - 可以按 js 来写

- 什么是组件？
  - 函数 返回 jsx 的才是 组件
  - 类型约束
- 类型约束
- ts 在 React 业务的用法
  - 子组件+ props 的约定
    interface Props{
    name:string;
    }
    :React.FC<Props> = (props)=>{ return <div>{props.name}</div>}
- 单向数据流
- props 回传入 callback
- 函数类型()=>void
- 参数类型约定
- React 对 ts 原生支持的非常好 如 React 专属类型 React.FC 和 React.ChangeEvent<HTMLInputElement>
