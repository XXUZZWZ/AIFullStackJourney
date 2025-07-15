import {
  Navigate,// 组件
  useLocation
}from 'react-router-dom'

const ProtectRoute = (props)=>{
  // 鉴权组件
  const location = useLocation();
  const pathname = location.pathname;
  console.log(location);
  const {children} = props;
  const isLogin = localStorage.getItem('isLogin') === 'true';
  console.log("isLogin",isLogin);
  if(!isLogin){
    return <Navigate to = '/login' state={{from:pathname}}/>
  }
  // 并非子组件，而是父组件
  // children属性，提升定制性
  /*
  <ProtectRoute>
       <Pay/> //是ProtectRoute的chilren属性
  </ProtectRoute>
  */
  console.log(children);
  return (
    <div>
      ProtectRoute
      {children}
    </div>
  )
}

export default ProtectRoute