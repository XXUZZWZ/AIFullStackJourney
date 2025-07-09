import { 
  useEffect,
   useState,
   useRef, } from 'react'
import TextList from './components/TextList/TextList'


function App() {

  const [textList, setTextList] = useState([
       'hello',
       'world',
       'hello',
       'world',
       'hello',
  ])

  const [loading,setLoading] = useState(false)
  

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
    <div className="App">
     <TextList
     textList={textList}
     onScroll={handleScroll}
     currentIndex={currentIndex}
     />
    </div>
  )
}

export default App
