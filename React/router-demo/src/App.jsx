import {
  BrowserRouter as Router,// 前端路由
  Routers,// 路由设置容器
  Route // 单条路由
}from 'react'
import  Home  from './pages/Home'
import  About  from './pages/About'

function App() {
 
  return (
    <>
    {/* 前端路由接管一切，配置 */}
     <Router>
      <Routers>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
      </Routers>
     </Router>
    </>
  )
}

export default App
