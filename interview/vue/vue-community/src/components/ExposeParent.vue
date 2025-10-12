<template>
  <div class="expose-parent">
    <h2>ExposeParent Component</h2>
    <p>This component demonstrates Vue 3 expose functionality.</p>

    <div class="data-section">
      <h3>Parent Controls:</h3>
      <div class="control-group">
        <button @click="callChildMethod" class="btn btn-primary">
          Call Child Method
        </button>
        <button @click="getChildData" class="btn btn-secondary">
          Get Child Data
        </button>
        <button @click="updateChildData" class="btn btn-info">
          Update Child Data
        </button>
        <button @click="resetChild" class="btn btn-warning">
          Reset Child
        </button>
      </div>

      <div class="status-section">
        <h4>Child Status:</h4>
        <p>Last action: {{ lastAction }}</p>
        <p>Child data: {{ childData }}</p>
        <p>Child counter: {{ childCounter }}</p>
      </div>
    </div>

    <!-- 子组件，使用 ref 获取组件实例 -->
    <ExposeChild ref="childRef" />


    <div class="explanation">
      <h3>Expose 功能说明：</h3>
      <p>通过 ref 获取子组件实例，可以调用子组件暴露的方法和访问暴露的数据。</p>
      <ul>
        <li>子组件使用 <code>defineExpose</code> 暴露方法和数据</li>
        <li>父组件使用 <code>ref</code> 获取子组件实例</li>
        <li>可以调用子组件的方法和访问子组件的数据</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ExposeChild from './ExposeChild.vue'

// 创建对子组件的引用
const childRef = ref<InstanceType<typeof ExposeChild> | null>(null)

// 响应式数据
const lastAction = ref('No actions yet')
const childData = ref('No data')
const childCounter = ref(0)

const handleChildClick = () => {
  console.log('handleChildClick', childRef.value);
  childRef.value?.incrementCounter()  // 子组件提供给父组件调用
  
}

// 调用子组件方法
const callChildMethod = () => {
  if (childRef.value) {
    const result = childRef.value.sayHello()
    lastAction.value = `Called child method: ${result}`
    console.log('Child method result:', result)
  } else {
    lastAction.value = 'Child ref not available'
  }
}

// 获取子组件数据
const getChildData = () => {
  if (childRef.value) {
    childData.value = childRef.value.getData()
    childCounter.value = childRef.value.counter
    lastAction.value = `Got child data: ${childData.value}, counter: ${childCounter.value}`
    console.log('Child data:', childData.value)
  } else {
    lastAction.value = 'Child ref not available'
  }
}

// 更新子组件数据
const updateChildData = () => {
  if (childRef.value) {
    childRef.value.updateData(`Updated at ${new Date().toLocaleTimeString()}`)
    lastAction.value = 'Updated child data'
    console.log('Child data updated')
  } else {
    lastAction.value = 'Child ref not available'
  }
}

// 重置子组件
const resetChild = () => {
  if (childRef.value) {
    childRef.value.reset()
    lastAction.value = 'Child reset'
    console.log('Child reset')
  } else {
    lastAction.value = 'Child ref not available'
  }
}
</script>

<style scoped>
.expose-parent {
  padding: 20px;
  border: 2px solid #2ecc71;
  border-radius: 8px;
  margin: 10px;
  background-color: #f0f9f4;
}

h2 {
  color: #2ecc71;
  margin-top: 0;
}

h3 {
  color: #27ae60;
  margin-bottom: 10px;
}

h4 {
  color: #229954;
  margin-bottom: 8px;
}

.data-section {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #d5f4e6;
}

.control-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
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

.btn-warning {
  background-color: #f39c12;
  color: white;
}

.btn-warning:hover {
  background-color: #e67e22;
}

.status-section {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.status-section p {
  margin: 8px 0;
  padding: 8px;
  background-color: white;
  border-radius: 3px;
  border-left: 3px solid #2ecc71;
}

.explanation {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e8;
  border-radius: 6px;
  border: 1px solid #c8e6c9;
}

.explanation h3 {
  color: #2e7d32;
}

.explanation code {
  background-color: #f1f8e9;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: #388e3c;
}

.explanation ul {
  margin: 10px 0;
  padding-left: 20px;
}

.explanation li {
  margin: 5px 0;
  color: #455a64;
}
</style>
