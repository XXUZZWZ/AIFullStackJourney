// 编辑区域的数据由store 管理
import {create} from 'zustand'


// parentId + children 可以构建组件树
export interface Component{
  id:number;
  name:string;
  children?:Component[];
  parentId?:number;
  props: Record<string, unknown>;
  desc?:string;
}

interface State {
  components:Component[];
  componentIndex: Map<number, Component>; // 添加索引缓存
}
// store 主要提供 State 和 Actions

interface Actions {
  addComponent: (component:Component,parentId?:number) => void;
  deleteComponent:( componentId:number)=>void
  updateComponent:()=>void
  updateComponentProps:(componentId:number,props: Record<string, unknown>)=>void
  buildComponentIndex: (components: Component[]) => void; // 添加构建索引方法
}

//  State & Actions 交叉运算 合并 要求都有  | 是 二选一有一个即可
// 递归构建组件索引的辅助函数
function buildIndexRecursive(components: Component[], index: Map<number, Component>) {
  for (const component of components) {
    index.set(component.id, component);
    if (component.children && component.children.length > 0) {
      buildIndexRecursive(component.children, index);
    }
  }
}

export const useComponentsStore = create<State & Actions>(
  (
    (set,get) =>(
      {
        components:[
          {
            id:1,
            name:'Page',
            props:{},
            desc:'页面',
            children:[],
          }
        ],
        componentIndex: new Map([[1, { id:1, name:'Page', props:{}, desc:'页面', children:[] }]]), // 初始化索引
        addComponent:(component,parentId)=>set((state)=>{
          const newComponent: Component = { ...component };
          const newIndex = new Map(state.componentIndex);
          
          if (parentId) {
            const parentComponent = state.componentIndex.get(parentId);
            if (parentComponent) {
              newComponent.parentId = parentId;
              if (parentComponent.children) {
                parentComponent.children = [
                  ...parentComponent.children,
                  newComponent,
                ];
              } else {
                parentComponent.children = [newComponent];
              }
              // 更新索引
              newIndex.set(newComponent.id, newComponent);
              // 只更新现有树（不要把子节点重复加入根级）
              return {
                components: [...state.components],
                componentIndex: newIndex,
              };
            }
          }
          // 无 parentId 或未找到父节点时，作为根级节点添加
          newIndex.set(newComponent.id, newComponent);
          return {
            components: [...state.components, newComponent],
            componentIndex: newIndex,
          };
        }),
        deleteComponent:(componentId:number)=>{
          if(!componentId) return;
          const state = get();
          const component = state.componentIndex.get(componentId);
          if(component?.parentId){
            const parentComponent = state.componentIndex.get(component.parentId);
            if(parentComponent){
              parentComponent.children = parentComponent.children?.filter((c)=>c.id !== componentId);
              const newIndex = new Map(state.componentIndex);
              newIndex.delete(componentId);
              set({
                components:[...state.components],
                componentIndex: newIndex
              })
            }
          }
        },
        updateComponent:()=>{},
        updateComponentProps:()=>{},
        buildComponentIndex: (components: Component[]) => {
          const index = new Map<number, Component>();
          buildIndexRecursive(components, index);
          set({ componentIndex: index });
        }
      }
    )
  )
)

// 优化后的O(1)查找函数
export function getComponentById(
  id:number,
  components:Component[]
):Component|null{
  if(!id) return null;
  // 优先使用索引缓存进行O(1)查找
  const store = useComponentsStore.getState();
  const cachedComponent = store.componentIndex.get(id);
  if (cachedComponent) {
    return cachedComponent;
  }
  
  // 如果索引中没有找到，回退到原来的递归查找（兼容性保证）
  for(const component of components){
    if(component.id === id){
      return component;
    }
    if(component.children&&component.children.length>0){
      const result = getComponentById(id,component.children);
      if(result){
        return result;
      }
    }
  }
   return null
}