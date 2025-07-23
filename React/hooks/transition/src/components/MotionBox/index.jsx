import { motion } from "framer-motion";
import {useState} from "react";
import styles from "./motionbox.module.css";
const MotionBox = ()=>{
  const [display,setDisplay]  = useState(false);
  const [open,setOpen] = useState(true);

  return (
    <div className={styles.container}>
      
        <motion.div
        initial={{opacity:0 ,y:-50}}
        animate={{opacity:1,y:0}}
        transition={{ duration: 0.5 }}
        className={styles.box}
        style={{height: open ? 100 : 10}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={()=>setOpen(!open)}
        >
       <h2 className={styles.title}> motion Box </h2>
        </motion.div>
      
      
        <button 
        onClick={() => setOpen(!open)} 
        className={styles.button}
        >
          {open?'关闭':'打开'}
        </button>

    </div>
  )
}

export default MotionBox;