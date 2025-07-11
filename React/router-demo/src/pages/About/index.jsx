import { Link, useNavigate } from 'react-router-dom'

const About = () => {

  const naviagte = useNavigate();

  const handleClick = () => {
    naviagte('/')
  }

  return (
    <div>
      <h1>About</h1>
      <Link to="/">Go to Home</Link>
      <button onClick={handleClick} >Go to Home</button>
    </div>
  )
}
export default About