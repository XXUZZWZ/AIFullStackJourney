<template>
  <div class="provide-parent">
    <h2>ProvideParent Component</h2>
    <p>This component demonstrates Vue 3 provide/inject functionality.</p>

    <div class="data-section">
      <h3>Provided Data:</h3>
      <p>Theme: {{ theme }}</p>
      <p>User: {{ user.name }}</p>
      <p>Config: {{ config.appName }}</p>
      <p>Update Count: {{ updateCount }}</p>
    </div>

    <div class="controls">
      <button @click="toggleTheme" class="btn btn-primary">
        Toggle Theme
      </button>
      <button @click="updateUser" class="btn btn-secondary">
        Update User
      </button>
      <button @click="updateConfig" class="btn btn-info">
        Update Config
      </button>
    </div>

    <!-- 多层嵌套的子组件 -->
    <ProvideChild />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  provide, // 向外提供数据
  reactive
} from 'vue'
import ProvideChild from './ProvideChild.vue'

// 提供响应式数据
const theme = ref('light')
const updateCount = ref(0)

// 提供响应式对象
const user = reactive({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
})

// 提供配置对象
const config = reactive({
  appName: 'Vue Community',
  version: '1.0.0',
  apiUrl: 'https://api.example.com'
})

// 提供方法
const updateTheme = (newTheme: string) => {
  theme.value = newTheme
  updateCount.value++
}

// 使用 provide 提供数据给所有子组件
provide('theme', theme)
provide('user', user)
provide('config', config)
provide('updateTheme', updateTheme)
provide('updateCount', updateCount)

// 控制方法
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  updateCount.value++
}

const updateUser = () => {
  user.name = `User ${Math.floor(Math.random() * 100)}`
  user.email = `user${Math.floor(Math.random() * 100)}@example.com`
  updateCount.value++
}

const updateConfig = () => {
  config.version = `1.0.${Math.floor(Math.random() * 10)}`
  updateCount.value++
}
</script>

<style scoped>
.provide-parent {
  padding: 20px;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  margin: 10px;
  background-color: #fef5f5;
}

h2 {
  color: #e74c3c;
  margin-top: 0;
}

h3 {
  color: #c0392b;
  margin-bottom: 10px;
}

.data-section {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #fadbd8;
}

.data-section p {
  margin: 8px 0;
  padding: 8px;
  background-color: #fdf2f2;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}
</style>
