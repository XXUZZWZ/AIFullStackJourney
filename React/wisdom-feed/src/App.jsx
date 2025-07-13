import { 
  useEffect,
  useLayoutEffect,
   useState,
   useRef, 
   useCallback,
  } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
}from 'react-router-dom'
import TextList from './components/TextList/TextList'
import { UserIdContext} from    './Context/UserIdContext'
import NavList from './components/NavList/NavList'
function App() {

  const [textList, setTextList] = useState([
    '孩子读书真的有用吗？',
    '生男孩好还是生女孩好？',
    '结婚一定要买房吗？',
    '该不该看伴侣的手机？',
    '彩礼到底该不该要？',
    '钱是省出来的还是赚出来的？',
    '老人该不该帮子女带孩子？',
    '过年必须回男方家吗？',
    '打工好还是当老板好？',
    '养孩子是穷养好还是富养好？',
    '结婚门当户对重要吗？',
    '早结婚好还是晚结婚好？',
    '孩子该不该上兴趣班？',
    '学历重要还是能力重要？',
    '该不该和父母住一起？',
    '女人该不该做全职太太？',
    '养儿真能防老吗？',
    '朋友借钱该不该借？',
    '买国产车好还是买合资车好？',
    '该不该让孩子玩手机？',
    '在大城市拼搏好还是回小城市安稳好？',
    '人活着是为了自己还是为了孩子？',
    '身体健康重要还是拼命赚钱重要？',
    '遇到老人摔倒该不该扶？',
    '该不该给孩子零花钱？',
    '结婚必须办婚礼吗？',
    '读书多的人一定更明事理吗？',
    '吃亏真的是福吗？',
    '养宠物是爱心的表现还是浪费钱？',
    '该不该催子女结婚？',
    '老实人在社会上真的吃亏吗？',
    '死要面子活受罪，这话对吗？',
    '考公啃老族值得被同情吗？',
    '考公务员真是好出路吗？',
  '进大厂996真值得吗？',
  '读研究生真比早工作强吗？',
  '彩礼要十万算多吗？',
  '租房结婚真能接受吗？',
  '必须给孩子买学区房吗？',
  '网红真能赚大钱吗？',
  '躺平真是年轻人的错吗？',
  '直播带货东西真便宜吗？',
  '相亲能找到真爱吗？',
  '工资该不该全交给老婆？',
  '女人过了30真难嫁吗？',
  '男人没房该不该嫁？',
  '养个孩子真要100万吗？',
  '下班后该不该回工作消息？',
  '亲戚借钱不还该撕破脸吗？',
  '寒门真难出贵子吗？',
  '手机支付让人更省钱了吗？',
  '老人该不该把积蓄都给子女？',
  '网上买药靠谱吗？',
  '外卖员挣得比白领多，读书还有用吗？',
  '离婚了该不该要孩子？',
  '朋友圈该不该晒娃？',
  '过年红包该给多少？',
  '同学聚会真是攀比吗？',
  '同事能当朋友吗？',
  '婆媳矛盾都是婆婆的错吗？',
  '幼儿园该学小学知识吗？',
  '网红景点真值得去吗？',
  '宠物该当孩子养吗？',
  '超市塑料袋该不该收钱？',
  '网暴别人的人现实里都是坏人吗？',
  '月入过万真算有钱人吗？'
  ])
  const [loading,setLoading] = useState(false)
  
  const [userId, setUserId] = useState("12345"); // Example userId, replace with actual logic to fetch userId

  const [currentIndex, setCurrentIndex] = useState(0);
 
  const containerRef = useRef(null);

  const loadMore = useCallback(async()=>{
    if(loading) return;

    setLoading(true)
    try{
      //  setTimeout(()=>{
        const newTextList = [...textList, ...new Array(5).fill('helloCallback'+currentIndex)]
        console.log("currentIndex",currentIndex);
        setTextList(newTextList)
      // },1)
    }catch(error){
      console.log(error)

    }finally{
      setLoading(false)
    }
  },[currentIndex])


 
  useEffect(()=>{
    const container =  containerRef.current;
    const handleScroll = () =>{
      const {scrollTop,scrollHeight,clientHeight} = container;
      if(scrollTop + clientHeight >= scrollHeight-100){
        setCurrentIndex(currentIndex =>currentIndex+1)
        loadMore()
      }
    }
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore])

  return (
   <UserIdContext.Provider value = {userId}>
     <div className="App">
     <NavList/>
     <TextList
     textList={textList}
     ref = {containerRef}
     currentIndex={currentIndex}
     />
    
    </div>
   </UserIdContext.Provider>
  )
}

export default App
