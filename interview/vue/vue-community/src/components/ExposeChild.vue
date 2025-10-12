<template>
  <div class="expose-child">
    <h3>ExposeChild Component</h3>
    <p>This component demonstrates exposing methods and data to parent.</p>

    <div class="child-data">
      <h4>Child Internal State:</h4>
      <p>Internal data: {{ internalData }}</p>
      <p>Counter: {{ counter }}</p>
      <p>Last operation: {{ lastOperation }}</p>
    </div>

    <div class="child-controls">
      <h4>Child Controls:</h4>
      <div class="button-group">
        <button @click="incrementCounter" class="btn btn-success">
          Increment Counter
        </button>
        <button @click="updateInternalData" class="btn btn-primary">
          Update Data
        </button>
        <button @click="performOperation" class="btn btn-info">
          Perform Operation
        </button>
      </div>
    </div>

    <div class="exposed-info">
      <h4>Exposed to Parent:</h4>
      <ul>
        <li><strong>sayHello()</strong> - 返回问候消息</li>
        <li><strong>getData()</strong> - 获取内部数据</li>
        <li><strong>updateData(newData)</strong> - 更新内部数据</li>
        <li><strong>reset()</strong> - 重置所有数据</li>
        <li><strong>counter</strong> - 计数器值（只读）</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 内部响应式数据
const internalData = ref('Initial child data')
const counter = ref(0)
const lastOperation = ref('No operations yet')

// 内部方法
const incrementCounter = () => {
  counter.value++
  lastOperation.value = `Counter incremented to ${counter.value}`
  console.log('Child: Counter incremented')
}

const updateInternalData = () => {
  internalData.value = `Updated at ${new Date().toLocaleTimeString()}`
  lastOperation.value = 'Internal data updated'
  console.log('Child: Internal data updated')
}

const performOperation = () => {
  const randomNum = Math.floor(Math.random() * 100)
  lastOperation.value = `Performed operation with random number: ${randomNum}`
  console.log('Child: Performed operation', randomNum)
}

// 使用 defineExpose 暴露给父组件的方法和数据
defineExpose({
  // 暴露方法
  sayHello: () => {
    const message = 'Hello from child component!'
    console.log('Child: sayHello called')
    return message
  },

  getData: () => {
    console.log('Child: getData called')
    return internalData.value
  },

  updateData: (newData: string) => {
    internalData.value = newData
    lastOperation.value = 'Data updated by parent'
    console.log('Child: Data updated by parent:', newData)
  },

  reset: () => {
    internalData.value = 'Initial child data'
    counter.value = 0
    lastOperation.value = 'Reset by parent'
    console.log('Child: Reset by parent')
  },

  // 暴露数据（只读）
  counter: {
    get: () => counter.value
  }
})

// 注意：没有暴露 internalData 和 lastOperation，
// 所以父组件无法直接访问这些数据
</script>

<style scoped>
.expose-child {
  padding: 20px;
  border: 2px solid #9b59b6;
  border-radius: 8px;
  margin: 10px 0;
  background-color: #f8f9fa;
}

h3 {
  color: #9b59b6;
  margin-top: 0;
}

h4 {
  color: #8e44ad;
  margin-bottom: 10px;
}

.child-data {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e8daef;
}

.child-data p {
  margin: 8px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #9b59b6;
}

.child-controls {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e8daef;
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

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover {
  background-color: #229954;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.exposed-info {
  margin-top: 15px;
  padding: 15px;
  background-color: #f3e5f5;
  border-radius: 6px;
  border: 1px solid #e1bee7;
}

.exposed-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exposed-info li {
  margin: 8px 0;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #9b59b6;
}

.exposed-info strong {
  color: #7b1fa2;
  font-family: monospace;
}
</style>
