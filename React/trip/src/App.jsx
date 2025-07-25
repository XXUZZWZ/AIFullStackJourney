import './App.css'
import {
  Suspense,
  lazy
}from 'react'
import {
  Routes,
  Route,
  Navigate
}from 'react-router-dom'
import { Flex, Loading } from 'react-vant';
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'
const Home = lazy(()=>import('@/pages/Home'))
const Collection = lazy(()=>import('./pages/Collection'))
const Account = lazy(()=>import('./pages/Account'))
const Discount = lazy(()=>import('./pages/Discount'))
const Search = lazy(()=>import('./pages/Search'))
const Trip = lazy(()=>import('./pages/Trip'))
function App() {
  return (
    <>
     <Suspense fallback={
    <Flex justify='center' align='center'  style={{ width: '100vw', height: '100vh' }}>
      <Loading color="#3f45ff" />
    </Flex>
}>
      {/*  带有tabbar的layout */}
         <Routes >
         <Route element = {<MainLayout/>}>
         <Route path='/' element={<Navigate to={'/home'}/>}></Route>
         <Route path='/home' element={<Home/>}></Route>
         <Route path='/collection' element={<Collection/>}></Route>
         <Route path='/account' element={<Account/>}></Route>
         <Route path='/discount' element={<Discount/>}></Route>
         <Route path='/trip' element={<Trip/>}></Route>
         </Route>
         {/* 空的Navbar */}
         <Route element = {<BlankLayout/>}>
         <Route path='/search' element = {<Search/>}></Route>
         </Route>
         </Routes>
      </Suspense>
    </>
  )
}

export default App
