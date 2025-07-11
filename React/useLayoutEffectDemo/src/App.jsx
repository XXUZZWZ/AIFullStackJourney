import { 
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
 } from 'react'


// function App() {
//   const boxRef = useRef()
//   useEffect(()=>{
//     console.log('useEffect() height',boxRef.current.offsetHeight)
//   },[])
//   console.log(boxRef.current,boxRef);
  
//   useLayoutEffect(()=>{
//     console.log('useLayoutEffect() height',boxRef.current.offsetHeight)
//   },[])

//   return (
//     <>
//       <div ref={boxRef} style={{height:100,width:100,background: 'red'}}>

//       </div>
//     </>
//   )
// }
// function App() { 
//   const[width, setWidth] = useState(900)
//   const ref = useRef();
//   useEffect(()=>{
//     console.log(ref.current);
//     ref.current.style.height = "100px";
//     setInterval(()=>{
//       ref.current.style.width = width+"px";
//        setWidth(width=>width<0?width+900:width-1)
//     },100)
//   },[width])
  
//   useLayoutEffect(()=>{
//     // 阻塞渲染
//   },[])


//   return (
//     <div 
//     ref={ref}
//     style={{
//       height: "200px",
//       width: width,
//       background: "red",
//     }}
//     >
//       useEffect
//     </div>
//   )
// }




// 弹窗
function Modal(){
  const[width, setWidth] = useState(900)
  const [height, setHeight] = useState(500);
  const [color, setColor] = useState('red');
  const ref = useRef();
  useEffect(()=>{
    console.log(ref.current);
    // ref.current.style.height = "100px";
    // setInterval(()=>{
    //   ref.current.style.width = width+"px";
    //    setWidth(width=>width<0?width+900:width-1)
    // },100)
  },[width])
  
 
    setInterval(()=>{
      ref.current.style.background = color;
      setWidth(width=>width<0?width+100:width-1)
      ref.current.style.width = width+"vw";
      setHeight(height=>height<0?height+100:height-1)
      ref.current.style.height = height+"vw";
      setColor(color=>color==='red'?'blue':color==='blue'?'green':color==='green'?color==='green'?'pink':'black':'red')
    },10)
 
  useLayoutEffect(()=>{
    const height = ref.current.offetHeight;
    ref.current.style.marginTop = `${(window.innerHeight-height+height)/2}px`;
  },[])
  return (
    <div 
    ref={ref}
    style={{
      position: "absolute",
      width: "900vh",
      backgroundColor: "red",
      height: "900vh",
    }}
    >
      我是Modal
    </div>
  )
}
function App() {

  return (
    <>
     <Modal/>
    </>
  )
}



export default App
