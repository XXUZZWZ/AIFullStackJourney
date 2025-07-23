import {
  Link
}from "react-router-dom";
import {useUserStore} from '../../store/user'
const NavBar = () => { 
  const {isLogin,user,Logout} = useUserStore();
  console.log(isLogin,user,"||||||");
  return (
    <nav style={{padding:"10px" ,borderBottom:"1px solid #ddd"}}>
      NavBar
      <ul>
        <Link to='/'>Home</Link> &nbsp;&nbsp;
        <Link to='/pay'>Pay</Link>&nbsp;&nbsp;
        {
        !isLogin?(
          <>
          <Link to='/login'>Login</Link>&nbsp;&nbsp;
         
          </>

        ):(
          <>
           <span style={{ color:"red"}}>欢迎{user.username}</span><button onClick={Logout}>Logout</button>&nbsp;&nbsp;
          </>
        )
        }
      </ul>
    </nav>
  )
};

export default NavBar;