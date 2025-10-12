// editor/components/Material/index.tsx
import {useMemo} from 'react'
import {useComponentConfigStore} from '../../stores/component-config'
import { Materialtem } from '@components/Materialtem'


export function Material() {
  const {componentConfig} = useComponentConfigStore()
  const components = useMemo(()=>{
     return Object.values(componentConfig)
  },[componentConfig])
  return (<div>
    {components.map((item)=>
   ( <Materialtem key={item.name} name={item.name} />)
    )}
  </div>)
}