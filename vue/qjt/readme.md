# VUE 全家桶

## VUE MVVM 框架(Ref() Reactive() useState()) 组件通信

## VUE 语法

- SFC 单文件组件
- 模板语法
- 指令
- 事件
- 计算属性
- 响应式属性

## typescript 类型

- vue-router 里的 RouterRecordRaw 给路由的 type 标注，保证配置选项正确
  - 路由 path 和 component 是必填项
  - name 属性 可以没有？

## 路由 VueRouter

## 状态管理 Store pinia

- Pinia
- defineStore 定义状态管理
  - 第一个产生 状态管理名称
  - 第二个参数 配置项
- 调用 useHomeStore()
- toRefs 把普通状态转化为响应式的

## slot 插槽

- 提升组件的定制性 #action 表示

## hooks 库 vueuse

## tailwindcss

- 原子 css 类名
- w-[calc(100vw-2rem)] 计算宽度
- 自适应

## 项目架构

## vite

- alias
- 自动加载组件库的组件
  - import Components from 'unplugin-vue-components/vite';
  - import { VantResolver } from '@vant/auto-import-resolver';

## vue 和 react 区别

- react 单向绑定 绑定值 + 事件处理函数
- vue 双向 v-model 指令
