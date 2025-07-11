import { Link, useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/about')
  }

  return (
    <div>
      <h1>Home </h1>
      <Link to="/about">Go to About</Link>
      <button onClick={handleClick} >Go to About</button>
    </div>
  )
}
export default Home;