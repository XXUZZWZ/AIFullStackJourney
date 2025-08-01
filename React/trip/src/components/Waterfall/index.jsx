import useTitle from '../../hooks/useTitle';
import { useEffect, useRef } from 'react';
import Image from '../ImageCard';
import styles from './waterfall.module.css'
const Waterfall = (props) => {
  useTitle('奶龙瀑布流')
  const { loading, fetchMore, images } = props;
  const loader = useRef(null);
  useEffect(() => {
    // ref 出现在视窗了
    // IntersectionObserver
    // 观察者模式
    const observer = new IntersectionObserver(([entry], obs) => {
      console.log(entry)
      if (entry.isIntersecting) {
        fetchMore();
      }
      // obs.unobserve();
      return () => {
        observer.disconnect();
      }
    }, [])
    if (loader.current) observer.observe(loader.current)


  }, [])

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          {
            images
              .filter((_, i) => i % 2 === 0)
              .map((item) => (<Image key={item.id} {...item} />))
          }
        </div>
        <div className={styles.column}>
          {
            images
              .filter((_, i) => i % 2 != 0)
              .map((item) => (<Image key={item.id} {...item} />))
          }
        </div>
        <div ref={loader} className={styles.loader} >加载中...</div>
      </div>

    </div>
  )
}

export default Waterfall;