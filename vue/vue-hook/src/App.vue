<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {useMouse} from './hooks/useMouse.js'
import {useTodo} from './hooks/useTodo.js'
// mvvm 响应式 数据绑定 状态管理 生命周期 hooks 
// 页面上晃来晃去，去显示鼠标的x,y坐标
import {ref,onMounted,onUnmounted} from 'vue'

const {x,y} = useMouse();

const {
  title,
  todos,
  addTodo,
  clear,
  active,
  all,
  allDone,
} = useTodo();


</script>

<template>
  <div>
    {{ x }} {{ y }}
  </div>
  <div>
    <!-- 事件绑定 @ 修饰符 -->
    <input type="text" v-model="title" placeholder="title" @keydown.enter="addTodo">
    <!-- v-if vue vue 指令 true 就显示 -->
    <button v-if = "active<all"  @click="clear" >清理</button>
    
    <ul v-if="todos.length">
      <!-- v-for 循环指令 -->
      <li v-for="todo in todos">
        <input type="checkbox" v-model="todo.done">
        <span>{{ todo.title }}</span>
      </li>
    </ul>
    <div>暂无数据</div>
    <div>全选
      <input type="checkbox" v-model="allDone">
      <span>{{ active }}/{{ all }}</span>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
