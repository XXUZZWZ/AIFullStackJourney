import styles from './index.module.css'
import { memo, useRef } from 'react'
import { ArrowLeft, Close } from '@react-vant/icons'
// 响应式状态数据少的时候可以使用memo优化
const SearchBox = (props) => {
  //  /api
  // 子父通信
  // 单向数据流
  const { queryRef } = useRef(null);
  // 非受控组件
  const handleChange = () => {

  }
  const { handleQuery } = props;
  return (
    <div className={styles.wrapper}>
      <ArrowLeft onClick={() => { history.go(-1) }} />
      <input
        type="text"
        className={styles.ipt}
        placeholder='搜索旅游相关的信息'
        ref={queryRef}
        onChange={
          handleChange
        }
      />
      <Close />
    </div>
  )
}

export default memo(SearchBox);