import {useDrag} from 'react-dnd'


export interface MaterialItemProps {
  name:string;
}


export function Materialtem(props:MaterialItemProps){
  const {name} = props
  const [, drag] = useDrag({
    type: name,
    // 数据项
    item:{
      name
    }
  })
  return (
    <div
    ref={drag}
    className='border-dashed border-[1px] border-[#000] py-[10px] px-[8px]   cursor-move inline-block bg-white hover:bg-[#ccc]'
    >{name}</div>
  )
}