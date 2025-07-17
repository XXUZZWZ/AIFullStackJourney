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

function App() {
 
  
  return (
    <Suspense fallback={<Loading/>}>
     <Routes>
      <Route path="/users/:id/repos" element={<RepoList/>} />
      <Route path="*" element={<Navigate to="/users/XXUZZWZ/repos" />} />
     </Routes>
    </Suspense>
  )
}

export default App
