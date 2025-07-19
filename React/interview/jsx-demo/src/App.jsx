import {createElement,useState} from 'react'

function App() {
  const element = <h1 className="title" >Hello,World</h1>
  const element2 = createElement('h1',{className:'title'},'Hello,World')
  const [list,setList] = useState([
    {
      id:1,
      title:'学习react'
    },
    {
      id:2,
      title:'学习vue'
    }
  ])
  console.log(element)
  console.log(element2)
  //                             type      props              children
  return (
    <>
     {element}
     {element2}
     {
      list.map(item=>{
        return <h1 key={item.id}>{item.title}</h1>
      })
     }{
      list.map(item=>{
        return createElement('h1',{key:item.id},item.title)
      })
     }
    </>
  )
}

export default App
