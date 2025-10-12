import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
// createRoot(container)：React 18 的新挂载入口，启用并发特性。参数必须是一个真实的 DOM 容器（例如 #root）。
ReactDOM.createRoot(document.getElementById('root')!).render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
)
// render(element)：将 React 组件树渲染到 container 中；可多次调用做更新。
/*
这里的 ! 是 TypeScript 的“非空断言（Non-null assertion）”运算符，意思是“我保证这个值不是 null/undefined，让编译器别再报空值错误”。只影响编译期，不会改变运行时行为；如果实际是 null，仍会在运行时报错。
*/