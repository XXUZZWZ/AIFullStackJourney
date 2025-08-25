import React, { useState } from "react";
const Hello = () => { 
  const [count, setCount] = useState(0)
  return (
    <div>
      我说jsx
      <button onClick={()=>setCount(count+1)}>点击</button>
      <p>{count}</p>
    </div>
  )
}
export default Hello;