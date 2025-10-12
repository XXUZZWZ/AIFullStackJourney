<template>
  <div class="mitt-a">
    <h2>MittA Component</h2>
    <p>This component demonstrates using mitt for event communication.</p>

    <div class="controls">
      <h3>Send Events:</h3>
      <div class="button-group">
        <button @click="sendMessage" class="btn btn-primary">
          Send Message
        </button>
        <button @click="sendData" class="btn btn-secondary">
          Send Data
        </button>
        <button @click="sendCustom" class="btn btn-info">
          Send Custom Event
        </button>
        <button @click="sendGlobal" class="btn btn-warning">
          Send Global Event
        </button>
      </div>

      <div class="input-group">
        <input v-model="customMessage" type="text" placeholder="Enter custom message" class="input-field" />
        <button @click="sendCustomMessage" class="btn btn-success">
          Send Custom
        </button>
      </div>
    </div>

    <div class="event-log">
      <h3>Event Log (MittA):</h3>
      <ul>
        <li v-for="(event, index) in eventLog" :key="index">
          {{ event }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from '../plugins/eventBus'

// 响应式数据
const customMessage = ref('')
const eventLog = ref<string[]>([])

// 事件处理函数
const handleMessage = (message: string) => {
  addToLog(`Received: ${message}`)
}

const handleData = (data: any) => {
  addToLog(`Received data: ${JSON.stringify(data)}`)
}

// 发送事件的方法
const sendMessage = () => {
  emitter.emit('message', 'Hello from MittA!') //发布者
  addToLog('Sent: message event')
}

const sendData = () => {
  const data = {
    timestamp: new Date().toISOString(),
    sender: 'MittA',
    value: Math.random()
  }
  emitter.emit('data', data) //发布者
  addToLog(`Sent: data event with ${JSON.stringify(data)}`)
}

const sendCustom = () => {
  emitter.emit('custom-event', { //发布者
    type: 'custom',
    message: 'This is a custom event'
  })
  addToLog('Sent: custom-event')
}

const sendGlobal = () => {
  emitter.emit('global-notification', {
    title: 'Global Event',
    content: 'This event can be handled by any component',
    type: 'info'
  })
  addToLog('Sent: global-notification')
}

const sendCustomMessage = () => {
  if (customMessage.value.trim()) {
    emitter.emit('user-message', customMessage.value)
    addToLog(`Sent user message: "${customMessage.value}"`)
    customMessage.value = ''
  }
}

// 工具函数
const addToLog = (message: string) => {
  eventLog.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

// 生命周期
onMounted(() => {
  // 注册事件监听器
  emitter.on('message', handleMessage)
  emitter.on('data', handleData)
  emitter.on('response', (data: any) => {
    addToLog(`Response from MittB: ${JSON.stringify(data)}`)
  })

  addToLog('MittA component mounted and listening for events')
})

onUnmounted(() => {
  // 清理事件监听器
  emitter.off('message', handleMessage)
  emitter.off('data', handleData)
})
</script>

<style scoped>
.mitt-a {
  padding: 20px;
  border: 2px solid #3498db;
  border-radius: 8px;
  margin: 10px;
  background-color: #f8f9fa;
}

h2 {
  color: #3498db;
  margin-top: 0;
}

h3 {
  color: #2980b9;
  margin-bottom: 10px;
}

.controls {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-field {
  flex: 1;
  padding: 8px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
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

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover {
  background-color: #229954;
}

.event-log {
  margin-top: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
}

.event-log ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-log li {
  padding: 5px;
  margin: 2px 0;
  background-color: #f8f9fa;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
  border-left: 3px solid #3498db;
}
</style>
