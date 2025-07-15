import {
  useState
}from 'react'
import {
  useNavigate,
  useLocation
}from 'react-router-dom'
const Login = ()=>{
  
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  
  const localtion = useLocation();
  //console.log(localtion.state.from);
  const navigate = useNavigate();//获得跳转的能力

  const handleSubmint = (e)=>{
    e.preventDefault();
    if(username==='admin'&&password==='123'){
      localStorage.setItem('isLogin',"true");
      navigate( '/pay');
    }else{
      alert('失败')
    }
  }
  return (
    <div>
      Login
      <form onSubmit={handleSubmint}>
         <h1>登陆页面</h1>
         <input type="text"
          placeholder="请输入账号" 
           required 
           value={username}
           onChange={(e)=>{setUsername(e.target.value)}}
           />
           <br />
         <input 
         type="password"
          placeholder="请输入密码" 
          value={password}
           required 
          onChange={(e)=>{setPassword(e.target.value)}}
          />
          <br />
          <button type='submit'>登陆</button>
      </form>
    </div>
  )
}

export default Login