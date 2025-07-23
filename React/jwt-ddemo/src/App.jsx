import { Routes,Route } from 'react-router-dom'
import { lazy,Suspense } from 'react'
import NavBar from './components/NavBar'

const Home = lazy(()=>import('./views/Home'));
const Login = lazy(()=>import('./views/Login'));
const Pay = lazy(()=>import('./views/Pay'))
const RequireAuth = lazy(()=>import('./components/RequireAuth'));
function App() {
 

  
  return (
    <>  
    <Suspense fallback={<div>Loading...</div>}>
    <NavBar/>
      <h1>你好</h1>
      <Routes> 
      <Route path='/' element = {<Home/>} ></Route>
      <Route path='/login' element = {<Login/>}></Route>
      <Route path='/pay' element = {<RequireAuth> <Pay/></RequireAuth>}></Route>
      </Routes>
    </Suspense>
  
    
    
    </>
  )
}

export default App
