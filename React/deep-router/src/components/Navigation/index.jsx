import { Link } from 'react-router-dom';

const Navigation = ()=>{
  return (
    <nav>
      <ul>
        <li>
          <Link to={'/'}>home</Link>
        </li>
        <li>
          <Link to={'/home'}>home</Link>
        </li>
        <li>
          <Link to={'/about'}>about</Link>
        </li>
        <li>
          <Link to={'/pay'}>pay</Link>
        </li>
        <li>
          <Link to={'/login'}>login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation