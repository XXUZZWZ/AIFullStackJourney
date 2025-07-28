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
import { PullRefresh, List, } from 'react-vant'
import { useEffect, useState } from 'react'
const TouristSpotItem = ({ title, description, imageUrl }) => {
  return (
    <div style={{ width: "100%", padding: '20px', height: "450px", backgroundColor: '#ffffff', margin: '0 auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: '2px solid #e7e9fc' }}>
      <img src={imageUrl} alt={title} style={{ width: "100%", height: "60%", objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} />
      <h2 style={{ marginTop: '15px', fontSize: '24px', textAlign: 'center', color: 'rgb(63, 69, 255)' }}>{title}</h2>
      <p style={{ fontSize: '16px', textAlign: 'justify', color: '#333333', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
};
const Home = () => {
  useTitle('奶龙首页');
  const navigate = useNavigate()
  const [list, setList] = useState([{
    id: '#bj1',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj2',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj3',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj4',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj5',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj6',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj7',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj8',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj9',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  }, {
    id: '#bj10',
    title: '北京',
    description: '北京景点推荐',
    imageUrl: 'https://img-s.msn.cn/tenant/amp/entityid/BB1msG0Y?w=0&h=0&q=60&m=6&f=jpg&u=t'
  },]);
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
      <PullRefresh onRefresh={() => {
        setTimeout(() => {
          setList([{
            id: "sxii",
            title: "测试数据",
            description: "测试数据",
            imageUrl: 'https://img-baofun.zhhainiao.com/pcwallpaper_ugc/static/388379538bf2af745f3f7cfea82816a2.jpg?x-oss-process=image%2fresize%2cm_lfit%2cw_3840%2ch_2160'
          }, ...list])
        })
      }}>
        <List
          onLoad={() => {
            setList([...list, ...list])
          }}

        >
          {
            list.map((item) => (
              < TouristSpotItem key={item.id} title={item.title} description={item.description} imageUrl={item.imageUrl} />
            ))
          }
        </List>
      </PullRefresh>
    </div>
  )
}
export default Home;