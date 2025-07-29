import SearchBox from "../../components/SearchBox"
import { useCallback } from "react"
import useSearchStore from "../../store/useSearchStore"
import styles from "./index.module.css"
import { useState } from "react"
import { useEffect, memo } from "react"



const HotListItems = memo(({ hotList }) => {
  console.log('----', hotList)
  return (
    <div className={styles.list}>
      <h1>热门城市</h1>
      {hotList.map((item) => (
        <div className={styles.item} key={item.id}>
          <div>{item.city}</div>
        </div>
      ))}
    </div>
  )
})

const Search = () => {
  // 单向数据流
  // 函数会反复生成
  // const handleQuery = () => {
  //   //处理api 请求
  // }

  const [query, setQuery] = useState("")
  const {
    suggestList,
    setSuggestList,
    hotList,
    setHotList
  } = useSearchStore();

  useEffect(() => {
    setHotList();
  }, [])

  const handleQuery = useCallback((query) => {
    //处理api 请求
    setQuery(query)
    if (!query) return;
    setSuggestList(query)
    console.log("handleQuery")

  },[])
  const suggestListStyle = {
    display: query.length > 0 ? "block" : "none",
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div>
          <SearchBox handleQuery={handleQuery} />
          <div className={styles.list} style={suggestListStyle}>
            {
              suggestList.map(item => (
                <div key={item} className={styles.item} >{item}</div>
              ))
            }

          </div>
          <HotListItems hotList={hotList} />
        </div>
      </div>
    </div>
  )
}
export default Search