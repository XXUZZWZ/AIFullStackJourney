import {
  BrowserRouter as Router, // 路由器组件，提供路由功能的上下文环境
  Routes, // 路由容器，用来包裹所有的路由规则
  Route // 单个路由规则，定义路径和对应的组件
} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import UserProfile from './pages/UserProfile'
import NewProducts from './pages/Products/NewProducts'
import ProductDetail  from './pages/Products/ProductDetail'
import Products from './pages/Products'
function App() {

  return (
    <>
      {/* 前端路由接管一切，配置 */}
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/products" element={<Products />}>
              <Route path=":new" element={<NewProducts />} />
              <Route path=":productId" element={<ProductDetail />} />
            </Route>
          </Routes>
      </Router>
    </>
  )
}

export default App
