import {
  useParams,
  useNavigate
} from 'react-router-dom'
import { useEffect, memo } from 'react'
import useDetailStore from '@/store/useDetailStore'
import { Skeleton, Swiper, Image } from 'react-vant'
import useTitle from '@/hooks/useTitle'
import styles from './detail.module.css'
import {
  ArrowLeft,
  Cart,
  StarO,
  ShopO,
  ServiceO,
  LikeO,
  Description,
  Logistics
} from '@react-vant/icons'

const ProductSkeleton = () => {
  return (
    <div style={{ padding: '16px' }}>
      {/* 图片骨架 */}
      <Skeleton.Image
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '4px',
          backgroundColor: '#e6e6e6',
        }}
      />

      {/* 商品价格 */}
      <Skeleton.Paragraph row={1} style={{ marginTop: '16px', height: 24, width: '30%' }} />

      {/* 登录查看更多按钮 */}
      <Skeleton.Paragraph row={1} style={{ height: 20, width: '40%', marginTop: 8 }} />

      {/* 商品标题 */}
      <Skeleton.Paragraph row={1} style={{ height: 22, width: '70%', marginTop: 16 }} />

      {/* 发货信息 */}
      <Skeleton.Paragraph row={2} style={{ height: 16, marginTop: 16 }} />

      {/* 7天无理由退货 / 其他说明 */}
      <Skeleton.Paragraph row={2} style={{ height: 16, marginTop: 12 }} />

      {/* 底部按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Skeleton.Button style={{ width: '48%', height: 40, borderRadius: 4 }} />
        <Skeleton.Button style={{ width: '48%', height: 40, borderRadius: 4 }} />
      </div>
    </div>
  );
};
const BottomBar = memo(() => {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.left}>
        <div className={styles.iconBlock}>
          <ShopO />
          <span>店铺</span>
        </div>
        <div className={styles.iconBlock}>
          <ServiceO />
          <span>客服</span>
        </div>
        <div className={styles.iconBlock}>
          <StarO />
          <span>收藏</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.cartBtn}>加入购物车</div>
        <div className={styles.buyBtn}>立即购买</div>
      </div>
    </div>
  )
})

const Detail = () => {
  const { id } = useParams()
  const { loading, detail, setDetail } = useDetailStore()

  useEffect(() => {
    setDetail(id)

  }, [])

  useEffect(() => {
    useTitle(detail.title)
  }, [detail])

  // if (loading) return <ProductSkeleton />



  return (
    <>
   
      <nav className={styles.nav}>
        <ArrowLeft fontSize={36} />
        <Cart fontSize={36} />
      </nav>
      {/* 幻灯片 */}

      <div className={styles.container}>

        <Swiper>
          {
            detail.images.map((item, index) => (
              <Swiper.Item key={index} lazyload>
                <Image src={item.url} />
              </Swiper.Item>
            ))
          }
        </Swiper>
        <div className={styles.priceRow}>
          <div className={styles.price}>￥{detail.price}</div>
          <div className={styles.couponBtn}>登录查看更多</div>
        </div>
        <div className={styles.titleRow}>
          <span className={styles.tag}>IFASHIOS</span>
          <span className={styles.title}>{detail.title}</span>
        </div>
        <div className={styles.deliveryRow}>
          <Logistics className={styles.icon} fontSize={30} />
          <span className={styles.deliveryText}>
            预计3小时内发货 | 承诺48小时内发货
          </span>
          <br />
          <span className={styles.extraInfo}>河北保定 · 快递 · 免运费</span>
        </div>

        <div className={styles.row}>
          <LikeO className={styles.icon} />
          <span>7天无理由退货</span>
        </div>
        <div className={styles.row}>
          <Description className={styles.icon} />
          <span>风格 肩带是否可拆卸 是否带锁 有无夹层</span>
        </div>
      </div>
      <BottomBar />
    </>
  )
}

export default Detail