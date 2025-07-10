import { useState } from 'react'
import Page from './components/Page'
import { ThemeContext } from './ThemeContext'

function App() {
  
  //console.log(ThemeContext,"/////");
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value = {theme}>
       <Page/> 
       <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} >切换主题</button>
     {/* <Parent>
      <Child>
        <GrandChild>
          <GreatGreatChild>
              
          </GreatGreatChild>
        </GrandChild>
      </Child>
     </Parent> */}
   
    {/* <Uncle/> */}
    
    </ThemeContext.Provider>
  )
}

export default App
