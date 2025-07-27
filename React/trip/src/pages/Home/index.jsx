import useTitle from '@/hooks/useTitle'
import { Swiper, Search, Grid } from 'react-vant';
import { useNavigate } from 'react-router-dom'
import { 
  Search as SearchIcon,
  MapMarked,
  Coupon,
  HotelO,
  LocationO,
  GuideO,
  ShopO,
  Shop
} from '@react-vant/icons';

const Home = () => {
  useTitle('奶龙首页');
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/search')
  }
  
  const items = [
    <Swiper.Item key="1">
      <img 
        src="https://tse1-mm.cn.bing.net/th/id/OIP-C.rAzIUHScvAJZYEnsOYB3oAHaNK?w=187&h=333&c=7&r=0&o=7&pid=1.7&rm=3" 
        alt="推荐景点1" 
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />
    </Swiper.Item>,
    <Swiper.Item key="2">
      <img 
        src="https://ts1.tc.mm.bing.net/th/id/OIP-C.uuMRp41SjL9ukaBDDBWz5wHaNK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" 
        alt="推荐景点2" 
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />
    </Swiper.Item>,
  ]
  
  const gridItems = [
    { icon: <SearchIcon />, text: '景点查询', onClick: () => navigate('/search') },
    { icon: <MapMarked />, text: '地图导航' },
    { icon: <Coupon />, text: '优惠券' },
    { icon: <HotelO />, text: '酒店预订' },
    { icon: <LocationO />, text: '交通出行' },
    { icon: <GuideO />, text: '导游服务' },
    { icon: <ShopO />, text: '热门景点' },
    { icon: <Shop />, text: '特产商店' },
  ];
  
  return (
    <div>
      <Search placeholder='搜索目的地、景点、攻略' onClickInput={handleClick} />
      <Swiper autoplay={3000} indicator>{items}</Swiper>
      
      <div style={{ padding: '10px 0' }}>
        <Grid columnNum={4} border={false}>
          {gridItems.map((item, index) => (
            <Grid.Item
              key={index}
              icon={item.icon}
              text={item.text}
              onClick={item.onClick}
            />
          ))}
        </Grid>
      </div>
    </div>
  )
}
export default Home;