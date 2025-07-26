import useTitle from '@/hooks/useTitle'
import { Search as SearchComponent } from 'react-vant'
import { NavBar } from 'react-vant'
import { useNavigate, useLocation } from 'react-router-dom'
import Searchcell from '@/components/Searchcell'
import CellGroup from '@/components/CellGroup'
import { useState, useEffect } from 'react'
import useSearchStore from '@/store/useSearchStore'
const Search = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [history, setHistory] = useState(['奶龙', '哈基米', '猫', '狗', '兔子', '仓鼠', '龙猫', '鹦鹉', '柯尔鸭', '修狗', '修猫', '鼠鼠', '兔兔', '猪猪', '大熊猫', '小熊猫', '企鹅', '水獭', '独角兽', '蜜袋鼯', '狐狸', '乌龟', '金鱼', '鲨鱼']);
  const { state } = location
  const {  searchText, setSearchText } = useSearchStore();

  const handleDelete = () => {
    setHistory([]);
  }
  useEffect(() => {
    
    console.log(searchText);
  }, [searchText])

  useTitle('奶龙搜索')
  return (
    <div>
      <NavBar
        title="奶龙搜索"
        onClickLeft={() => { navigate(-1) }}
      />
      <SearchComponent value={searchText} placeholder="请输入内容" onChange={(e) => setSearchText(e)} />
      <CellGroup onDelete={handleDelete}>
        {
          history.map((item, index) => (
            <Searchcell key={index} text={item} />
          ))
        }
      </CellGroup>

    </div>
  )
}
export default Search