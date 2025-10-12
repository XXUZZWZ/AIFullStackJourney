import {Button as AntdButton} from 'antd'
import type { ButtonType } from 'antd/es/button'

// butten type 值 default" | "primary" | "dashed" | "link" | "text"这些



export interface ButtonProps {
  type:ButtonType;
  text:string;

}

const Button = ({type,text}:ButtonProps) =>{
  return (
    <AntdButton type={type}>{text}</AntdButton>
  )
}

export default Button;