import { 
  useEffect,
   useState,
   useRef, 
  } from 'react'
import TextList from './components/TextList/TextList'
import { UserIdContext} from    './Context/UserIdContext'
import NavList from './components/NavList/NavList'
function App() {

  const [textList, setTextList] = useState([
       'hello',
       'world',
       'hello',
       'world',
       'hello',
  ])

  const [loading,setLoading] = useState(false)
  
  const [userId, setUserId] = useState("12345"); // Example userId, replace with actual logic to fetch userId

  const [currentIndex, setCurrentIndex] = useState(0);
 


  const handleScroll = (e) =>{
   
  }

  useEffect(()=>{
    if (loading) return; // Prevents setting textList if already loading
    setLoading(true)
    const timeout = setTimeout(() => {
      setTextList([
        'hello',
        'world',
        'hello',
        'world',
        'hello',
        'new text'
      ])
      setLoading(false)
    }, 3000);
  }, [loading])

  return (
   <UserIdContext.Provider value = {userId}>
     <div className="App">
     <NavList/>
     <TextList
     textList={textList}
     onScroll={handleScroll}
     currentIndex={currentIndex}
     />
    
    </div>
   </UserIdContext.Provider>
  )
}

export default App
