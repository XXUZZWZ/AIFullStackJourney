import {create} from 'zustand'
import Page from '../meterials/Page'
import Container from '../meterials/Container'
import Button from '../meterials/Button'

export interface ComponentConfig{
  name:string;
  defaultProps:Record<string,any>;
  // Record 约束对象类型 key 为string 对value 不约束
  component:any;
}

interface State{
  componentConfig:{[key:string]:ComponentConfig}
}

interface Actions {
  registerComponent:(name:string,config:ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Actions>((set)=>({
  componentConfig:{
    Page:{
      name:'Page',
      defaultProps:{},
      component:Page
    },
    Container:{
      name:'Container',
      defaultProps:{},
      component:Container
    },
    Button:{
      name:'Button',
      defaultProps:{
        type:'primary',
        text:'按钮'
      },
      component:Button
    },
  },
  registerComponent:(name,componentConfig)=>set((state)=>{
        return {
          ...state,
          componentConfig:{
            ...state.componentConfig,
            [name]:componentConfig
          }
        }
  })
}))