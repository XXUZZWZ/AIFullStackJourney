import SearchBox from "../../components/SearchBox"
import { useCallback } from "react"

const Search = () => {
  // 单向数据流
  // 函数会反复生成
  // const handleQuery = () => {
  //   //处理api 请求
  // }
  const handleQuery = useCallback(() => {
    //处理api 请求
  })
  return (
    <div>
      <SearchBox handleQuery={handleQuery} />
    </div>
  )
}
export default Search