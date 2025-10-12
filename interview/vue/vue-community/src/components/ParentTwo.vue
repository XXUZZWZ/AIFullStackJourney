<template>
  <div class="parent-two">
    <h2>ParentTwo Component</h2>
    <p>This is the ParentTwo component using modern Vue 3 syntax.</p>
    <div class="data-display">
      <p>Reactive data: {{ reactiveData }}</p>
      <p>Computed value: {{ computedValue }}</p>
      <ChildTwo :msg1="msg1" :msg2="msg2" />
    </div>
    <button @click="updateData" class="update-btn">Update Data</button>
  </div>
</template>

<script setup lang="ts">
import ChildTwo from './ChildTwo.vue'
import { ref, computed } from 'vue'
const msg1 = ref("msg11")
const msg2 = ref("msg22")
// 使用 ref 创建响应式数据
const reactiveData = ref('Initial data from ParentTwo')

// 使用 computed 创建计算属性
const computedValue = computed(() => {
  return `Computed: ${reactiveData.value.toUpperCase()}`
})

// 定义方法
const updateData = () => {
  reactiveData.value = `Updated at ${new Date().toLocaleTimeString()}`
}
</script>

<style scoped>
.parent-two {
  padding: 20px;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  margin: 10px;
  background-color: #fff5f5;
}

h2 {
  color: #e74c3c;
  margin-top: 0;
}

.data-display {
  margin: 15px 0;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.update-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.update-btn:hover {
  background-color: #c0392b;
}
</style>
