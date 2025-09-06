import { useState } from 'react'
import VirtualList from './components/VirtualList'
import './App.css'

const generateData = (count) =>{
 return  Array.from({length:count},(_,i)=>({
    id:i,
    name:`Item ${i}`,
    description:
    `This is item number ${i} ,rendered with virtual scrolling `
  }))
}

function App() {
  const data = generateData(100000);
  const renderItem = (item,index)=>(
    <div
    style={{
      padding:'10px',
      borderBottom:'1px solid #eee',
      backgroundColor:index %2===0?'#f9f9f9':'#fff'
    }}
    >
   <strong>[{index}]</strong>
   {item.name}
   <p
   style={{margin:'4px 0',fontSize:'0.9em',color:'#666'}}
   >
    {item.description}
   </p>
    </div>
  )
  return (
    <div
    style={{padding:'20px',fontSize:'Arial'}}
    >
    <h1>Virtual List With 100000 Item</h1>
    <p>Smooth scroll with Virtualization</p>
    {/* 固定高度的虚拟列表 */}
    < VirtualList
    data = {data}
    height = {window.innerHeight - 100}
    itemHeight={80}
    renderItem={renderItem}
    overscan={3}
    // 预先渲染3个额外项
    />
    </div>
  )
}

export default App
