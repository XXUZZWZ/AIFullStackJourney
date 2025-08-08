import { useState, useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    // (async () => {
    //   const res = await fetch('http://localhost:8080/api/hello')
    //   const data = await res.json();
    //   console.log(data);
    // })()
  }, [])
  return (
    <>
      <h1>Hello World</h1>
      <img src="https://ts4.tc.mm.bing.net/th/id/OIP-C.h-MLOTX-vz9DTNypKdRbawHaNK?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />

    </>
  )
}

export default App
