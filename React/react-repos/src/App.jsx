import {
   useState,
   useEffect,
   Suspense,
   lazy
 } from 'react'
import {
   getRepos,
   getUserInfo,
   getReposNum,
   getReposDetails
 }from './api/repos'
import './App.css'
import {
  Routes,
  Route,
  Navigate
}from 'react-router-dom'
import {
  Loading
}from './components/Loading'

const RepoList = lazy(()=>{
  return import('./pages/RepoList/RepoList')
})
const RepoDetail = lazy(()=>{
  return import('./pages/RepoDetails/RepoDetails')
})
const Home = lazy(()=>{
  return import('./pages/Home/Home')
})
const NotFound = lazy(()=>{
  return import('./pages/NotFound')
})
function App() {
 
  
  return (
    <Suspense fallback={<Loading/>}>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/:id/repos" element={<RepoList/>} />
      <Route path="/users/:id/repos/:repoId" element={<RepoDetail/>} />
      <Route path="*" element={<NotFound/>} />
     </Routes>
    </Suspense>
  )
}

export default App
