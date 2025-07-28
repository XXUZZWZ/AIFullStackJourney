import useTitle from '@/hooks/useTitle'
import SearchBox from '../../components/SearchBox';
const Home = () => {
  useTitle('奶龙首页');
  return (
    <div>
      Home
      <SearchBox />
    </div>
  )
}
export default Home;