import type { PropsWithChildren } from "react";
import {useMaterialDrop} from '../../hooks/useMaterialDrop'
interface PageProps extends PropsWithChildren{
  id:number;
  name:string;
}

function Page({id,name,children}:PageProps){
 
  const {canDrop,drop} = useMaterialDrop(['Button','Container','Page'],id,name)
  return (
    <div 
    ref={drop} 
    className="p-[20px] h-full box-border"
    style={{backgroundColor:canDrop ? 'lightgreen' : 'white'}}
    >
      <div>
        {name} {id}
      </div>
       {children}
    </div>
  )
}

export default Page;