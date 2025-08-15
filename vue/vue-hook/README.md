| 功能               | React 写法                                                       | Vue 写法 (Composition API)                            | 备注                                   |
| ------------------ | ---------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| **创建状态**       | `const [count, setCount] = useState(0)`                          | `const count = ref(0)`                                | Vue 中取值要用 `.value`                |
| **修改状态**       | `setCount(count + 1)`                                            | `count.value++`                                       | Vue 自动追踪 `.value` 变化             |
| **渲染变量**       | `{count}`                                                        | `{{ count }}`                                         | 模板插值语法                           |
| **点击事件**       | `<button onClick={fn}>`                                          | `<button @click="fn">`                                | `onClick` → `@click`                   |
| **条件渲染**       | `{isShow && <div>Hi</div>}`                                      | `<div v-if="isShow">Hi</div>`                         | 复杂条件可用 `v-else-if` / `v-else`    |
| **列表渲染**       | `{list.map((item,i)=>(<li key={i}>{item}</li>))}`                | `<li v-for="(item,i) in list" :key="i">{{item}}</li>` | `:key` 必须                            |
| **双向绑定**       | `<input value={name} onChange={e => setName(e.target.value)} />` | `<input v-model="name" />`                            | Vue 自带简化                           |
| **样式绑定**       | `<div style={{color:'red'}}>`                                    | `<div :style="{color:'red'}">`                        | 属性绑定用 `:`                         |
| **class 绑定**     | `<div className={isRed ? 'red' : ''}>`                           | `<div :class="{red: isRed}">`                         | 也支持数组形式                         |
| **props 定义**     | `function Child({title}) {}`                                     | `defineProps({ title: String })`                      | Vue 中 props 用 `defineProps`          |
| **调用子组件方法** | `useRef()` 获取实例                                              | `ref()` + `expose()`                                  | 需 `defineExpose` 暴露方法             |
| **副作用 / 挂载**  | `useEffect(()=>{},[])`                                           | `onMounted(()=>{})`                                   | React 依赖数组 → Vue 生命周期钩子      |
| **卸载清理**       | `useEffect(()=>()=>{},[])`                                       | `onUnmounted(()=>{})`                                 | Vue 单独提供卸载钩子                   |
| **监听数据变化**   | `useEffect(()=>{...}, [count])`                                  | `watch(count, ()=>{})`                                | Vue 有更细粒度的监听                   |
| **全局状态管理**   | Redux/Zustand                                                    | Pinia/Vuex                                            | Vue 推荐 Pinia（语法接近 React hooks） |
| **传递 children**  | `{props.children}`                                               | `<slot></slot>`                                       | Vue 中插槽替代 children                |
| **条件类名工具**   | `classnames()`                                                   | `:class="['a', isRed && 'red']"`                      | 原生支持数组+对象                      |



        ┌─────────────────────────────────┐
        │           Vue 3 核心结构         │
        └─────────────────────────────────┘
                     │
     ┌───────────────┴─────────────────┐
     │                                 │
 [模板语法]                       [脚本逻辑]
     │                                 │
 ┌───┴─────────────┐       ┌───────────┴─────────────────┐
 │插值  {{变量}}   │       │ <script setup> 模式          │
 │属性绑定 :src="" │       │   import { ref, reactive }   │
 │样式绑定 :style  │       │   const count = ref(0)       │
 │类绑定   :class  │       │   const obj = reactive({...})│
 │事件绑定 @click  │       │   方法直接写函数             │
 │条件 v-if / else │       │   生命周期 onMounted()       │
 │循环 v-for="..." │       │   监听 watch(source, cb)     │
 │双向 v-model     │       │   props: defineProps({ ... })│
 └─────────────────┘       │   emit: defineEmits(['xxx']) │
                            └─────────────────────────────┘
     │                                 │
     ▼                                 ▼
 [组件结构]                       [状态管理]
     │                                 │
 ┌───┴───────────────┐        ┌────────┴───────────┐
 │父子通信 props    │        │ 局部状态 ref       │
 │事件 emit         │        │ 响应式对象 reactive│
 │插槽 <slot>       │        │ 全局状态 Pinia    │
 └──────────────────┘        └───────────────────┘
