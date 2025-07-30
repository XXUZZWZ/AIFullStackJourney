import useTitle from '@/hooks/useTitle'
import { Search } from 'react-vant';
import { Navigate, useNavigate } from 'react-router-dom';
const Home = () => {
  useTitle('奶龙首页');
  const navigate = useNavigate();
  const handleChange = (value) => {
    console.log(value, "fdfsfsdf");
    navigate('/search');
  };
  return (
    <div>

      <Search
        placeholder='搜索'
        onClickInput={handleChange}
      ></Search>
    </div>
  )
}
export default Home;