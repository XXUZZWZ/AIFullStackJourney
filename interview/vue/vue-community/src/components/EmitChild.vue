<template>
  <div class="emit-child">
    <h3>EmitChild Component</h3>
    <p>This component demonstrates emitting events to parent.</p>

    <div class="controls">
      <div class="input-group">
        <label for="message-input">Send Message:</label>
        <input id="message-input" v-model="messageInput" type="text" placeholder="Enter a message"
          class="input-field" />
        <button @click="sendMessage" class="btn btn-primary">
          Send Message
        </button>
      </div>

      <div class="counter-group">
        <p>Current Count: {{ localCount }}</p>
        <div class="button-group">
          <button @click="increment" class="btn btn-success">+1</button>
          <button @click="decrement" class="btn btn-warning">-1</button>
          <button @click="double" class="btn btn-info">×2</button>
        </div>
      </div>

      <div class="custom-group">
        <button @click="sendCustomEvent" class="btn btn-secondary">
          Send Custom Event
        </button>
        <button @click="emitReset" class="btn btn-danger">
          Emit Reset
        </button>
      </div>
    </div>

    <div class="event-log">
      <h4>Event Log:</h4>
      <ul>
        <li v-for="(event, index) in eventLog" :key="index">
          {{ event }}
        </li>
      </ul>
    </div>
    <button @click="emitMyClick" class="btn btn-primary"> Emit My Click</button>
    <p>my-click 事件被触发了 {{ x }}</p>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props 定义
interface Props {
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0
})

// Emits 定义
const emit = defineEmits<{
  'message-sent': [message: string]
  'counter-updated': [value: number]
  'custom-event': [data: { timestamp: string; type: string }]
  'reset': []
  'my-click': []
}>()

// 响应式数据
const messageInput = ref('')
const localCount = ref(props.initialCount)
const eventLog = ref<string[]>([])
const x = ref(0)

// 监听 props 变化
watch(
  () => props.initialCount,
  (newValue) => {
    localCount.value = newValue
    addToLog(`Parent updated count to: ${newValue}`)
  }
)

// 事件发射方法
const sendMessage = () => {
  if (messageInput.value.trim()) {
    emit('message-sent', messageInput.value)
    addToLog(`Message sent: "${messageInput.value}"`)
    messageInput.value = ''
  }
}

const increment = () => {
  localCount.value++
  emitCounterUpdate()
}

const decrement = () => {
  localCount.value--
  emitCounterUpdate()
}

const double = () => {
  localCount.value *= 2
  emitCounterUpdate()
}

const emitCounterUpdate = () => {
  emit('counter-updated', localCount.value)
  addToLog(`Counter updated to: ${localCount.value}`)
}

const sendCustomEvent = () => {
  const customData = {
    timestamp: new Date().toISOString(),
    type: 'custom-event-from-child',
    message: 'This is a custom event with data'
  }
  emit('custom-event', customData)
  addToLog(`Custom event sent: ${JSON.stringify(customData)}`)
}

const emitReset = () => {
  emit('reset')
  addToLog('Reset event emitted')
}

const emitMyClick = () => {
  emit('my-click')
  addToLog('My click event emitted')
}
// 工具函数
const addToLog = (message: string) => {
  eventLog.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  // 限制日志长度
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}
</script>

<style scoped>
.emit-child {
  padding: 20px;
  border: 2px solid #3498db;
  border-radius: 8px;
  margin: 10px 0;
  background-color: #f8f9fa;
}

h3 {
  color: #3498db;
  margin-top: 0;
}

h4 {
  color: #2980b9;
  margin-bottom: 10px;
}

.controls {
  margin: 15px 0;
}

.input-group,
.counter-group,
.custom-group {
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  margin-bottom: 10px;
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

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover {
  background-color: #229954;
}

.btn-warning {
  background-color: #f39c12;
  color: white;
}

.btn-warning:hover {
  background-color: #e67e22;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
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
