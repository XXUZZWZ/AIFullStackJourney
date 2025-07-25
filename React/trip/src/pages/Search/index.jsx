import   useTitle from '@/hooks/useTitle'
import {Search as SearchComponent} from 'react-vant'
import {  NavBar } from 'react-vant'
import {useNavigate}from 'react-router-dom'
const Search = ()=>{
  const navigate = useNavigate()
  
  useTitle('奶龙搜索')
  return (
    <div>
      <NavBar 
      title="搜索"
      onClickLeft={() =>{navigate(-1) }}
      />
      <SearchComponent placeholder="请输入内容" />
      
    </div>
  )
}
export default Search