import {
  Outlet,
  useNavigate,
  useLocation
}from "react-router-dom"
import {
  useEffect,
  useState
}from 'react'
import {
 Tabbar
}from 'react-vant'
import {
  HomeO,
  Search,
  FriendsO,
  SettingO,
  UserO
}from '@react-vant/icons'
const MainLayout = ()=>{
  const tabs = [
    {icon:<HomeO/>,title:'首页',path:'/home'},
    {icon:<Search/>,title:'特惠专区',path:'/discount'},
    {icon:<FriendsO/>,title:'我的收藏',path:'/collection'},
    {icon:<SettingO/>,title:'行程',path:'/trip'},
    {icon:<UserO/>,title:'我的账户',path:'/account'},
  ];
  const [active,setActive] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    console.log(location.pathname,'||||')
   const index = tabs.findIndex(tab=>tab.path === location.pathname.startsWith(tab.path))
   setActive( index)
  },[])

  return (
    <div>
        <Outlet/>
     MainLayout
     {/* tabbar */}
     < Tabbar 
     value={active}
     onChange={
      (key)=>{
        setActive(key)
        navigate(tabs[key].path)
      }
      
     }
     >
    {
      tabs.map((tab,index)=>(
        <Tabbar.Item
        key={index}
        icon = {tab.icon}
        >
          {tab.title}
        </Tabbar.Item>
      ))
    }
     </ Tabbar>
    </div>
  )
}
export default MainLayout