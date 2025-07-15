import './App.css'
import {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
}from 'react'
// function App() {
//   return (
//     <>
//     <TodosContext.Provider>
//       <LoginContext.Provider>
//           <ThemeContext.Provider>
//             <Layout>
//                 <Header></Header>
//                 <Main></Main>
//               <Footer></Footer>
//             </Layout>
//           </ThemeContext.Provider>
//         </LoginContext.Provider>
//     </TodosContext.Provider>    
//     </>
//   )
// }
  const initialState = {
    count:0,
  }
  // 管理 分部门
  // reducer 纯函数,返回可靠的状态
  // 状态生成器
  const reducer = (state,action)=>{
    // {type:'increment',payload:1} 返回新状态
    // 生成新的状态
    // case 状态修改的规定
    // 状态工厂
      switch (action.type){
        case 'increment':
          return {
            count:state.count+1
           }
        case 'decrement':
          return {
            count:state.count-1
           }
           case 'FunDecrement':
            return {
              count:(count)=>count-1
             }
        case 'set':
          return {
            count:parseInt(action.payload)
          }
          case 'reset':
            return {
              count:999
            }
        default :
          return {
            count:state.count
          }
      }
     
  }
  function App(){
    // initialValue
    // 当前状态，旧状态，新状态
    // 界面由当前状态来驱动
    // 修改状态的方法 function
    // 响应式
    // useReducer 管理状态，useState有的useReducer也有 但是高级和复杂点
    
    const[count,setCount] = useState(0);
    // 适合大型项目
    const[state,dispatch] = useReducer(reducer,initialState);
    // dispatch 提供action 固定参数 给reducer函数
    return (
      <div style={{
        fontSize: state?.count||10 + 'px'
      }}>
        <p>{state.count}</p>
        <button onClick={()=>dispatch({type:'increment'})}>+</button >
        <button onClick={()=>dispatch({type:"FunDecrement"})} >-</button>
        <button onClick={()=>dispatch({type:"decrement"})} >-</button>
        <button onClick={()=>dispatch({type:'reset'})}>reset</button>
        <input type="text" value={state.count}  onChange={(e)=>dispatch({type:"set",payload:e.target.value})} />
        
      </div>
    )
  }

export default App
