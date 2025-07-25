import {
  useTitle
} from '@/hooks/useTitle'
import { ServiceO, FriendO, StarO, SettingO, UserO, UserCircleO } from '@react-vant/icons'
import {
  useState
} from 'react'
import {
  Image,
  Cell,
  CellGroup,
  ActionSheet,
  Popup,
  Loading,
} from 'react-vant'
const Account = () => {
  useTitle('我的')
  const [userInfo, setUserInfo] = useState({
    nickname: '奶龙',
    slogan: '我是奶龙',
    avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.Pq8dDCkuj2fBhQsiC6A7WgHaD_?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'
  });
  return (
    <div>
      <CellGroup>
        <Cell title="服务" icon={<ServiceO />} ></Cell>
      </CellGroup >
      <CellGroup inset style={{ marginTop: 8 }}>
        <Cell title="收藏" icon={<StarO />} isLink />
        <Cell title="朋友圈" icon={<FriendsO />} isLink />
      </CellGroup>
      <CellGroup inset style={{ marginTop: 8 }}>
        <Cell title="设置" icon={<SettingO />} isLink />
      </CellGroup>
    </div>
  )
}
export default Account