import   useTitle from '@/hooks/useTitle'
import { Swiper ,Search} from 'react-vant';
import {useNavigate} from 'react-router-dom'
import { useEffect ,useRef } from 'react';
import styles from './index.module.css'
const Home = ()=>{
  useTitle('奶龙首页');
  const navigate = useNavigate()
  const searchRef = useRef()
  const handleClick = ()=>{
    navigate('/search')
  } 
  const items = [
    <Swiper.Item key="1"><img src="https://tse1-mm.cn.bing.net/th/id/OIP-C.rAzIUHScvAJZYEnsOYB3oAHaNK?w=187&h=333&c=7&r=0&o=7&pid=1.7&rm=3" alt="" /></Swiper.Item>,
    <Swiper.Item key="2"><img src="https://ts1.tc.mm.bing.net/th/id/OIP-C.uuMRp41SjL9ukaBDDBWz5wHaNK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" /></Swiper.Item>,
  ]
  return (
    <div>
      <Search placeholder='搜索'  onClickInput={handleClick} ></Search>
      <Swiper autoplay={1000}>{items}</Swiper>
    </div>
  )
}
export default Home;