import {useUserStore} from '../../store/user'
import {useNavigate,useLocation} from 'react-router-dom'
import { useEffect } from 'react';
const RequireAuth = ( {children} )=>{
  const navigator = useNavigate();
  const {pathname} = useLocation();
  const {isLogin} = useUserStore();
  
  useEffect(()=>{
    if(!isLogin){
      navigator('/login',{from : pathname})
   }
  },[])
  return (
    <div>
      <h1>RequireAuth</h1>
      {children}
    </div>
  )
}

export default RequireAuth;