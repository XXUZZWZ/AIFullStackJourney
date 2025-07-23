import { useState } from 'react'
import styles from './button.module.css'
const Box = () => {
  const [count, setCount] = useState(0)
  const [open,setOpen] = useState(true);
  return (
    <div>
      <div className={`${styles.box} ${open?styles.open:''}`}>
      
      </div>
      <button onClick={() => setOpen(!open)}>{open?'关闭':'打开'}</button>
    </div>
  )
}

export default Box