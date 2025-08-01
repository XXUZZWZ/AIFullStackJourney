import useTitle from '@/hooks/useTitle'
import { Search } from 'react-vant';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from 'react-vant';
import { showToast } from '../../components/toast/ToastController';
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
      <Button onClick={() => showToast(3, 6, 9)} type='primary'>按钮</Button>
    </div>
  )
}
export default Home;