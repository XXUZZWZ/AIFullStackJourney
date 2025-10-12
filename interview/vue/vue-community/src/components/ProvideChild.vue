<template>
  <div class="provide-child">
    <h3>ProvideChild Component</h3>
    <p>This component demonstrates injecting data from parent using provide/inject.</p>

    <div class="injected-data">
      <h4>Injected Data:</h4>
      <p>Theme: {{ theme }}</p>
      <p>User: {{ user.name }} ({{ user.email }})</p>
      <p>App: {{ config.appName }} v{{ config.version }}</p>
      <p>API: {{ config.apiUrl }}</p>
      <p>Total Updates: {{ updateCount }}</p>
    </div>

    <div class="child-controls">
      <h4>Child Controls:</h4>
      <div class="button-group">
        <button @click="switchToLight" class="btn btn-primary">
          Light Theme
        </button>
        <button @click="switchToDark" class="btn btn-secondary">
          Dark Theme
        </button>
        <button @click="randomTheme" class="btn btn-info">
          Random Theme
        </button>
      </div>
    </div>

    <!-- 更深层的嵌套组件 -->
    <ProvideGrandchild />
  </div>
</template>

<script setup lang="ts">
import { inject, Ref, ref } from 'vue'
import ProvideGrandchild from './ProvideGrandchild.vue'

// 使用 inject 获取父组件提供的数据
// 需要指定类型和默认值
const theme = inject<Ref<string>>('theme', ref('light'))
const user = inject('user', { name: 'Unknown', email: 'unknown@example.com', role: 'user' })
const config = inject('config', { appName: 'Unknown App', version: '0.0.0', apiUrl: '' })
const updateTheme = inject<(theme: string) => void>('updateTheme', () => {})
const updateCount = inject<Ref<number>>('updateCount', ref(0))

// 子组件方法
const switchToLight = () => {
  updateTheme('light')
}

const switchToDark = () => {
  updateTheme('dark')
}

const randomTheme = () => {
  const themes = ['light', 'dark', 'blue', 'green', 'purple']
  const randomTheme = themes[Math.floor(Math.random() * themes.length)]
  updateTheme(randomTheme)
}
</script>

<style scoped>
.provide-child {
  padding: 20px;
  border: 2px solid #f39c12;
  border-radius: 8px;
  margin: 10px 0;
  background-color: #fef9e7;
}

h3 {
  color: #f39c12;
  margin-top: 0;
}

h4 {
  color: #e67e22;
  margin-bottom: 10px;
}

.injected-data {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #fdebd0;
}

.injected-data p {
  margin: 8px 0;
  padding: 8px;
  background-color: #fef5e7;
  border-radius: 4px;
  border-left: 3px solid #f39c12;
}

.child-controls {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #fdebd0;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
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
  background-color: #34495e;
  color: white;
}

.btn-secondary:hover {
  background-color: #2c3e50;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}
</style>
