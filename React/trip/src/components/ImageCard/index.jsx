import styles from './imagecard.module.css';
import { useRef, useEffect } from 'react';
const Image = (props) => {
  const { url, height } = props;
  const imgRef = useRef(null);
  // console.log(props);
  useEffect(() => {
    const InterObersaton = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        // console.log(entry)
        const img = entry.target;
        const oImge = document.createElement('img');
        oImge.onload = () => {
          img.src = img.dataset.src;
        };
        img.src = imgRef.current.dataset.src || '';
        obs.unobserve(img);
      }
      if (imgRef.current) obs.observe(imgRef.current);
    })
  }, [])
  return (
    <div className={styles.card}>
      <img ref={imgRef} data-src={url} style={{ height }} className={styles.img} />
    </div>
  )
}

export default Image;