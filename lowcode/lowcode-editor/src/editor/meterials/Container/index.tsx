import type { PropsWithChildren} from "react";
import type {CommonComponentProps} from '../../interfaces/component'
import {
  useComponentsStore
} from '../../stores/components'
import {
  useComponentConfigStore
}from '../../stores/component-config'
import {useDrop} from 'react-dnd'
import {useMaterialDrop} from '../../hooks/useMaterialDrop'

const Container : React.FC<CommonComponentProps> = ({children,id,name})=>{
 
  const {canDrop,drop} = useMaterialDrop(['Button','Container','Page'],id,name)

  return (
    <div 
    ref={drop}
    className={`border-[1px] border-[#000] min-h-[100px] p-[20px] ${canDrop ? 'bg-lightgreen' : 'bg-white'}`}
    >
      {children}
    </div>
  )
}

export default Container;
// export function Container({children}:PropsWithChildren){
//   return <div className="w-full h-full bg-red-500">{children}</div>
// }



