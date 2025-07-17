import { useState } from 'react'
import{
  //BrowserRouter as Router,
  HashRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router> 
       
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
          <main>
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </main>
          <footer>
            <p>&copy; 2023</p>
          </footer>
       
      </Router>
    </>
  )
}

export default App
