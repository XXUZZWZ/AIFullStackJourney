import { useState, useEffect } from 'react'
import styles from './toast.module.css'
import { toastEvents } from './ToastController';
const Toast = (props) => {
  const [visible, setIsvisible] = useState(false);
  const [data, setData] = useState({
    user: 0,
    bell: 0,
    mail: 0,
  });

  useEffect(() => {
    // 自定义事件 
    // toastEvent 是 mitt的实例
    // on 监听一个事件
    const show = (info) => {
      setData(info);
      setIsvisible(true);
      setTimeout(() => {
        setIsvisible(false);
      }, 3000);
    };
    // 订阅了show 事件
    toastEvents.on('show', show)
    return () => {
      // toastEvents.off('show', show)
      toastEvents.off('show', show);
    }
  }, [])
  // 等待通信的到来
  // 事件机制

  if (!visible) {
    return null;
  }
  return (
    <>
      <div className={styles.toastWrapper}>
        <div className={styles.toastItem}>👤 {data.user}</div>
        <div className={styles.toastItem}>🔔 {data.bell}</div>
        <div className={styles.toastItem}>✉️ {data.mail}</div>
        <div className={styles.toastArrow}></div>
      </div>
    </>
  )
}

export default Toast