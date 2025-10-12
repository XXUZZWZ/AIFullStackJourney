<template>
  <div class="mitt-b">
    <h2>MittB Component</h2>
    <p>This component also uses mitt for event communication with MittA.</p>

    <div class="controls">
      <h3>Send Events:</h3>
      <div class="button-group">
        <button @click="sendResponse" class="btn btn-primary">
          Send Response
        </button>
        <button @click="sendBroadcast" class="btn btn-secondary">
          Send Broadcast
        </button>
        <button @click="sendToAll" class="btn btn-info">
          Send to All
        </button>
      </div>

      <div class="input-group">
        <input
          v-model="responseMessage"
          type="text"
          placeholder="Enter response message"
          class="input-field"
        />
        <button @click="sendCustomResponse" class="btn btn-success">
          Send Response
        </button>
      </div>
    </div>

    <div class="event-log">
      <h3>Event Log (MittB):</h3>
      <ul>
        <li v-for="(event, index) in eventLog" :key="index">
          {{ event }}
        </li>
      </ul>
    </div>

    <div class="status-section">
      <h3>Component Status:</h3>
      <p>Events received: {{ eventCount }}</p>
      <p>Last event type: {{ lastEventType }}</p>
      <p>Active listeners: {{ activeListeners }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from '../plugins/eventBus'

// 响应式数据
const responseMessage = ref('')
const eventLog = ref<string[]>([])
const eventCount = ref(0)
const lastEventType = ref('None')
const activeListeners = ref(0)

// 事件处理函数
const handleMessage = (message: string) => {
  addToLog(`Message from MittA: ${message}`)
  eventCount.value++
  lastEventType.value = 'message'
}

const handleData = (data: any) => {
  addToLog(`Data from MittA: ${JSON.stringify(data)}`)
  eventCount.value++
  lastEventType.value = 'data'
}

const handleCustomEvent = (data: any) => {
  addToLog(`Custom event: ${JSON.stringify(data)}`)
  eventCount.value++
  lastEventType.value = 'custom-event'
}

const handleGlobalNotification = (notification: any) => {
  addToLog(`Global notification: ${notification.title} - ${notification.content}`)
  eventCount.value++
  lastEventType.value = 'global-notification'
}

const handleUserMessage = (message: string) => {
  addToLog(`User message: "${message}"`)
  eventCount.value++
  lastEventType.value = 'user-message'
}

// 发送事件的方法
const sendResponse = () => {
  const response = {
    timestamp: new Date().toISOString(),
    from: 'MittB',
    message: 'This is a response from MittB'
  }
  emitter.emit('response', response)
  addToLog('Sent: response event')
}

const sendBroadcast = () => {
  emitter.emit('broadcast', {
    sender: 'MittB',
    message: 'Broadcast message to all listeners',
    timestamp: Date.now()
  })
  addToLog('Sent: broadcast event')
}

const sendToAll = () => {
  emitter.emit('*', {
    type: 'wildcard',
    message: 'This event uses wildcard listener',
    sender: 'MittB'
  })
  addToLog('Sent: wildcard event (*)')
}

const sendCustomResponse = () => {
  if (responseMessage.value.trim()) {
    emitter.emit('custom-response', {
      message: responseMessage.value,
      sender: 'MittB',
      timestamp: new Date().toLocaleTimeString()
    })
    addToLog(`Sent custom response: "${responseMessage.value}"`)
    responseMessage.value = ''
  }
}

// 通配符监听器（监听所有事件）
const handleAllEvents = (event: string, data?: any) => {
  if (event !== '*') { // 避免循环
    addToLog(`[Wildcard] Event: ${event}, Data: ${JSON.stringify(data)}`)
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
  emitter.on('custom-event', handleCustomEvent)
  emitter.on('global-notification', handleGlobalNotification)
  emitter.on('user-message', handleUserMessage)

  // 通配符监听器
  emitter.on('*', handleAllEvents)

  // 更新活跃监听器数量
  activeListeners.value = Object.keys(emitter.all).length

  addToLog('MittB component mounted and listening for events')
})

onUnmounted(() => {
  // 清理事件监听器
  emitter.off('message', handleMessage)
  emitter.off('data', handleData)
  emitter.off('custom-event', handleCustomEvent)
  emitter.off('global-notification', handleGlobalNotification)
  emitter.off('user-message', handleUserMessage)
  emitter.off('*', handleAllEvents)
})
</script>

<style scoped>
.mitt-b {
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

.controls {
  margin: 15px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #fadbd8;
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
  border: 1px solid #f5b7b1;
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
  border: 1px solid #fadbd8;
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
  background-color: #fef9f9;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
  border-left: 3px solid #e74c3c;
}

.status-section {
  margin-top: 15px;
  padding: 15px;
  background-color: #fdf2f2;
  border-radius: 6px;
  border: 1px solid #f5b7b1;
}

.status-section p {
  margin: 8px 0;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
}
</style>
