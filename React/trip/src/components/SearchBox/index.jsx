import styles from './index.module.css'
import { memo, useRef } from 'react'
import { ArrowLeft, Close } from '@react-vant/icons'
import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { debounce } from '../../utils'
// 响应式状态数据少的时候可以使用memo优化
const SearchBox = (props) => {
  //  /api
  // 子父通信
  // 单向数据流
  const [query, setQuery] = useState('');
  const { queryRef } = useRef(null);
  const clearQuery = () => {
    setQuery('');
    queryRef.currentTarget.value = '';
    queryRef.current.focus();
  }
  // 非受控组件
  const handleChange = (e) => {
    let val = e.currentTarget.value;
    setQuery(val);
  }
  const displayStyle = query ? { display: 'block' } : { display: 'none' };
  const { handleQuery } = props;
  // 对函数的封装计算结果；函数封装也是缓存
  // const handleQueryDebounce =  debounce(handleQuery, 500) 多次计算
  //1. 函数防抖
  //2. useMemo 可以缓存闭包结果，如果直接生成函数，每次都会生成新的函数。
  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 300);
  }, [])
  useEffect(() => {
    handleQueryDebounce(query);
  }, [query])
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
      {/* 用户体验当输入框有内容才出现，针对移动端 */}
      <Close onClick={clearQuery} style={displayStyle} />
    </div>
  )
}

export default memo(SearchBox);