import { useState } from 'react'
import TextList from './components/TextList/TextList'


function App() {
  const [textList, setTextList] = useState([
       'hello',
       'world',
       'hello',
       'world',
       'hello',
  ])

  return (
    <div className="App">
     <TextList
     textList={textList}
     />
    </div>
  )
}

export default App
