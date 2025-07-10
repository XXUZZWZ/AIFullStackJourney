import {useContext} from 'react';
import { ThemeContext } from '../../ThemeContext';
// use 
// 函数
// 响应式状态生命周期
// hook 很好用

const Child = () => {
  const theme = useContext(ThemeContext);
 // console.log(theme, "Child Component Theme");
  return (
    <div className='theme'>
      <h1>Child {theme} </h1>
    </div>
  )
}

export default Child;