import {
  useEffect,
  memo
} from 'react'
const Button = ({children, num})=>{
  useEffect(()=>{
    console.log('Button effect')
  },[])
  console.log('Button rendered')

  return (
    <>
    <h2>{num}</h2>
    <button>{children}</button>
    </>
)
}
export default memo(Button);