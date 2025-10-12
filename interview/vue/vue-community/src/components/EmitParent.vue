<template>
  <div class="emit-parent">
    <h2>EmitParent Component</h2>
    <p>This component demonstrates Vue 3 event emission patterns.</p>

    <div class="data-section">
      <h3>Parent Data:</h3>
      <p>Message from child: {{ childMessage }}</p>
      <p>Counter value: {{ counter }}</p>
      <p>Last event: {{ lastEvent }}</p>
    </div>
    <!-- @ 是 vue 事件绑定 vue 文档特别好 -->
    <!-- 子组件，监听多个事件 -->
    <EmitChild :initial-count="counter" @message-sent="handleMessage" @counter-updated="handleCounterUpdate"
      @custom-event="handleCustomEvent" @reset="handleReset" @my-click="onMyClick" />

    <div class="controls">
      <p>x: {{ x }}</p>
      <button @click="resetAll" class="reset-btn">Reset All</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmitChild from './EmitChild.vue'

// 响应式数据
const childMessage = ref('No message yet')
const counter = ref(0)
const lastEvent = ref('No events yet')
const x = ref(0)

const onMyClick = () => {
  console.log('onMyClick')
  x.value++;
}

// 事件处理函数
const handleMessage = (message: string) => {
  childMessage.value = message
  lastEvent.value = `Message received: ${message}`
  console.log('Message from child:', message)
}

const handleCounterUpdate = (newValue: number) => {
  counter.value = newValue
  lastEvent.value = `Counter updated to: ${newValue}`
  console.log('Counter updated:', newValue)
}

const handleCustomEvent = (data: any) => {
  lastEvent.value = `Custom event: ${JSON.stringify(data)}`
  console.log('Custom event data:', data)
}

const handleReset = () => {
  lastEvent.value = 'Reset event received'
  console.log('Reset event from child')
}

// 父组件方法
const resetAll = () => {
  childMessage.value = 'No message yet'
  counter.value = 0
  lastEvent.value = 'All data reset'
  console.log('All data reset by parent')
}
</script>

<style scoped>
.emit-parent {
  padding: 20px;
  border: 2px solid #f39c12;
  border-radius: 8px;
  margin: 10px;
  background-color: #fffaf0;
}

h2 {
  color: #f39c12;
  margin-top: 0;
}

h3 {
  color: #e67e22;
  margin-bottom: 10px;
}

.data-section {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #f1c40f;
}

.data-section p {
  margin: 8px 0;
  padding: 5px;
  background-color: #fef9e7;
  border-radius: 4px;
}

.controls {
  margin-top: 15px;
  text-align: center;
}

.reset-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.reset-btn:hover {
  background-color: #c0392b;
}
</style>
