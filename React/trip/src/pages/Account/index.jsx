import
useTitle
  from '@/hooks/useTitle'
import { ServiceO, FriendsO, StarO, SettingO, UserO, UserCircleO } from '@react-vant/icons'
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
import styles from './account.module.css'
import { generateAvatar } from '@/llm'
const Account = () => {
  useTitle('我的')

  const actions = [
    {
      name: 'AI生成头像',
      color: '#123123',
      type: 1
    },
    {
      name: '上传头像',
      color: '#ee0a24',
      type: 1
    }
  ]
  const [showActionSheet, setShowActionSheet] = useState(true);
  const [userInfo, setUserInfo] = useState({
    nickname: '奶龙',
    slogan: '我是奶龙',
    level: 3,
    avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.Pq8dDCkuj2fBhQsiC6A7WgHaD_?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'
  });
  const handleAction = async (e) => {
    console.log(e)
    if (e.type === 1) {
      console.log('生成头像')
      const text = `
      昵称：${userInfo.nickname},
      签名：${userInfo.slogan}
      `;
      const newAavatar = await generateAvatar(text);

    } else {
      console.log('头像')
    }
    // setShowActionSheet((pre) => !pre)
  }
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          round
          width='64px'
          height='64px'
          src={userInfo.avatar}
          style={{ cursor: 'pointer' }}
          onClick={() => { handleAction }}
        />
        <div className='ml4'>
          <div className={styles.nickname}>昵称：{userInfo.nickname}</div>
          <div className={styles.level}>等级：{userInfo.level}级</div>
          <div className={styles.slogan}>简介：{userInfo.slogan}</div>
        </div>
      </div>
      <div className="mt3">

        <CellGroup inset style={{ marginTop: 8 }} className='mt2'>
          <Cell title="服务" icon={< ServiceO />} isLink />
        </CellGroup>
        <CellGroup inset style={{ marginTop: 8 }} className='mt2'>
          <Cell title="收藏" icon={<StarO />} isLink />
          <Cell title="朋友圈" icon={<FriendsO />} isLink />
        </CellGroup>
        <CellGroup inset style={{ marginTop: 8 }} className='mt2' >
          <Cell title="设置" icon={<SettingO />} isLink />
        </CellGroup>
      </div>
      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        cancelText="取消"
        onCancel={() => setShowActionSheet(false)}
        onSelect={(e) => handleAction(e)}
        duration={200}
      >

      </ActionSheet>
    </div>
  )
}
export default Account