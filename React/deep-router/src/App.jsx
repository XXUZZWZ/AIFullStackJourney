import {
  useState,
  Suspense,
  lazy
}from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import  Navigation from './components/Navigation'
import ProtectRoute from './pages/ProtectRoute'
import Pay from './pages/Pay'
import Login from './pages/Login'
// 30几个页面 1000个路由，1000个组件
const Home = lazy(()=>import('./pages/Home'));
const About = lazy(()=>import('./pages/About'));
const NotFound = lazy(()=>import('./pages/NotFound'));
function App() {
  // 函数 路由->Route

  return (
    <>
     <Router>
         <Navigation/>
         <Suspense fallback={<div>加载中</div>}>
         <Routes>
          <Route path = "/" element = {<Home/>} />
          <Route path = "/home" element = {<Home/>} />
          <Route path = "/about" element = {<About/>} />
          <Route path = "/login" element = {<Login/>} />

          {/* 鉴权 */}
          <Route path = "/pay" element = {
            <ProtectRoute>
               <Pay/>
               <div>我是children属性的div</div>
           </ProtectRoute>
          } />
          <Route path = "*" element = {<NotFound/>} />
         </Routes>
         </Suspense>
     </Router>
    </>
  )
}

export default App
