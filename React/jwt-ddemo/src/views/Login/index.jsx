import {
  useRef
}from 'react'
import {
  useUserStore
}from '../../store/user'
import {useNavigate}from 'react-router-dom'
const Login = () =>{
  const usernameRef = useRef();
  const passwordRef = useRef();
  const {Login} = useUserStore();
  const navigate = useNavigate();
  const handleLogin = (event)=>{
    event.preventDefault();
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      if(!username || !password){
        alert('请输入用户名和密码')
        return ;
      }

      Login({username,password});
      // setTimeout(()=>{
      //   navigate('/')
      // },1000)
  }
  return (
    <div>
      Login
      <form onSubmit={handleLogin}>
        <label htmlFor="username">username: </label>
        <input type="text" id='username' ref={usernameRef} required placeholder='请输入账号' /><br />
        <label htmlFor="password">password:  </label>
        <input type="password" id='password' ref={passwordRef} required placeholder='请输入密码' />
      <div>
           <button type='submit'>登录</button>
      </div>
      </form>
    </div>
  )
}

export default Login;