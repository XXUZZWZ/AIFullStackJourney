import { useState } from 'react'
import {
  BrowserRouter as Routers,
  Routes,
  Route,
  Link,
}from 'react-router-dom'
import './App.css'
import './global.styl'
import {About }from './pages/About'
import {Home }from './pages/Home'
function App() {

  return (
    <>
      <Routers>
      <nav>
        <ul>
          <li>a标签跳转</li>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
      <nav>
        <ul>
          <li>LINk 组件跳转</li>
          <li><Link to={'/'}>Home</Link></li>
          <li><Link to={'/about'}>About</Link></li>     
       </ul>
      </nav>
        <Routes>
          <Route path='about' element = {<About/>}/>
          <Route path='home' element = {<Home/>}/>
          <Route path='/' element = {<Home/>}/>
        </Routes>
      </Routers>
    </>
  )
}

export default App
