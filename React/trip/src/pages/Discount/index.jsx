import React from 'react';
import useTitle from '@/hooks/useTitle';
import { Card, Divider, Tag, Typography, Swiper } from 'react-vant';
import { CouponO, GiftO, HotO } from '@react-vant/icons';
import styles from './Discount.module.css';

const Discount = () => {
  useTitle('奶龙的优惠');

  const discountItems = [
    {
      id: 1,
      title: "夏日海滩度假套餐",
      description: "包含五星级酒店住宿+免费早餐+海滩活动",
      price: "¥888",
      originalPrice: "¥1288",
      image: "https://ts1.cn.mm.bing.net/th/id/R-C.15e95307504dcba517203657600093f9?rik=1234567890&riu=http%3a%2f%2fwww.example.com%2fimage1.jpg&ehk=example&risl=&pid=ImgRaw&r=0",
      tag: "限时特惠"
    },
    {
      id: 2,
      title: "山水景区联票",
      description: "包含3个景区门票+交通接驳+导游服务",
      price: "¥299",
      originalPrice: "¥599",
      image: "https://ts1.cn.mm.bing.net/th/id/R-C.15e95307504dcba517203657600093f9?rik=1234567890&riu=http%3a%2f%2fwww.example.com%2fimage2.jpg&ehk=example&risl=&pid=ImgRaw&r=0",
      tag: "热门"
    },
    {
      id: 3,
      title: "亲子乐园年卡",
      description: "全年无限次入园+专属停车位+快速通道",
      price: "¥699",
      originalPrice: "¥1099",
      image: "https://ts1.cn.mm.bing.net/th/id/R-C.15e95307504dcba517203657600093f9?rik=1234567890&riu=http%3a%2f%2fwww.example.com%2fimage3.jpg&ehk=example&risl=&pid=ImgRaw&r=0",
      tag: "新品"
    }
  ];

  const bannerItems = [
    <Swiper.Item key="1">
      <div className={styles.bannerItem}>
        <Typography.Title level={3} className={styles.bannerTitle}>暑期大促</Typography.Title>
        <Typography.Text className={styles.bannerText}>全场低至5折起</Typography.Text>
      </div>
    </Swiper.Item>,
    <Swiper.Item key="2">
      <div className={styles.bannerItem} style={{ background: 'linear-gradient(to right, #00c9ff, #92fe9d)' }}>
        <Typography.Title level={3} className={styles.bannerTitle}>会员专享</Typography.Title>
        <Typography.Text className={styles.bannerText}>额外9折优惠券</Typography.Text>
      </div>
    </Swiper.Item>,
    <Swiper.Item key="3">
      <div className={styles.bannerItem} style={{ background: 'linear-gradient(to right, #834d9b, #d04ed6)' }}>
        <Typography.Title level={3} className={styles.bannerTitle}>周末特惠</Typography.Title>
        <Typography.Text className={styles.bannerText}>周末不加价</Typography.Text>
      </div>
    </Swiper.Item>
  ];

  return (
    <div className={styles.discountContainer}>
      <Swiper autoplay={3000} indicator className={styles.swiperBanner}>
        {bannerItems}
      </Swiper>

      <div className={styles.discountSectionTitle}>
        <GiftO className={styles.discountIcon} />
        <Typography.Title level={4} style={{ margin: 0 }}>热门优惠</Typography.Title>
      </div>

      {discountItems.map(item => (
        <Card key={item.id} style={{ marginBottom: '15px' }}>
          <div className={styles.cardContent}>
            <div className={styles.cardDetails}>
              <div className={styles.cardTitleRow}>
                <Typography.Title level={5} className={styles.cardTitle}>{item.title}</Typography.Title>
                {item.tag && (
                  <Tag round type="danger">
                    {item.tag}
                  </Tag>
                )}
              </div>
              <Typography.Text size="sm" type="secondary" className={styles.cardDescription}>
                {item.description}
              </Typography.Text>
              <div className={styles.cardPriceRow}>
                <span className={styles.cardPrice}>{item.price}</span>
                <span className={styles.cardOriginalPrice}>
                  {item.originalPrice}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Divider className={styles.divider}>
        <HotO style={{ fontSize: '59px', color: '#ee0a24' }} />
      </Divider>

      <div className={styles.couponSectionTitle}>
        <CouponO className={styles.couponIcon} />
        <Typography.Title level={4} style={{ margin: 0 }}>优惠券专区</Typography.Title>
      </div>

      <Card style={{ marginBottom: '15px' }}>
        <div className={styles.couponCardContent}>
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>新人专享券</Typography.Title>
            <Typography.Text size="sm" type="secondary">满100减20元</Typography.Text>
          </div>
          <Tag type="primary" round>立即领取</Tag>
        </div>
      </Card>

      <Card style={{ marginBottom: '15px' }}>
        <div className={styles.couponCardContent}>
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>周末特惠券</Typography.Title>
            <Typography.Text size="sm" type="secondary">满200减50元</Typography.Text>
          </div>
          <Tag type="success" round>立即领取</Tag>
        </div>
      </Card>
    </div>
  );
};

export default Discount;