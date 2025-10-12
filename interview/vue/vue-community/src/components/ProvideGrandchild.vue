<template>
  <div class="provide-grandchild">
    <h4>ProvideGrandchild Component</h4>
    <p>This is a deeply nested component that also uses injected data.</p>

    <div class="grandchild-data">
      <h5>Grandchild Injected Data:</h5>
      <p>Current Theme: <span :class="themeClass">{{ theme }}</span></p>
      <p>User Role: {{ user.role }}</p>
      <p>App Version: {{ config.version }}</p>
      <p>Global Updates: {{ updateCount }}</p>
    </div>

    <div class="grandchild-explanation">
      <h5>Provide/Inject 说明：</h5>
      <ul>
        <li>这是三层嵌套的组件</li>
        <li>仍然可以访问根组件提供的数据</li>
        <li>不需要通过中间组件传递 props</li>
        <li>实现了跨层级组件通信</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  inject,
  Ref,
  computed,
  ref
} from 'vue'

// 在深层嵌套组件中仍然可以注入数据
const theme = inject<Ref<string>>('theme', ref('light'))
const user = inject('user', { name: 'Unknown', email: 'unknown@example.com', role: 'user' })
const config = inject('config', { appName: 'Unknown App', version: '0.0.0', apiUrl: '' })
const updateCount = inject<Ref<number>>('updateCount', ref(0))

// 计算属性，根据主题改变样式
const themeClass = computed(() => {
  return {
    'theme-light': theme.value === 'light',
    'theme-dark': theme.value === 'dark',
    'theme-blue': theme.value === 'blue',
    'theme-green': theme.value === 'green',
    'theme-purple': theme.value === 'purple'
  }
})
</script>

<style scoped>
.provide-grandchild {
  padding: 15px;
  border: 2px solid #16a085;
  border-radius: 6px;
  margin: 10px 0;
  background-color: #e8f6f3;
}

h4 {
  color: #16a085;
  margin-top: 0;
}

h5 {
  color: #138d75;
  margin-bottom: 8px;
}

.grandchild-data {
  margin: 10px 0;
  padding: 12px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #a3e4d7;
}

.grandchild-data p {
  margin: 6px 0;
  padding: 6px;
  background-color: #f4fdfb;
  border-radius: 3px;
  border-left: 3px solid #16a085;
}

.theme-light {
  color: #2c3e50;
  background-color: #ecf0f1;
  padding: 2px 6px;
  border-radius: 3px;
}

.theme-dark {
  color: white;
  background-color: #2c3e50;
  padding: 2px 6px;
  border-radius: 3px;
}

.theme-blue {
  color: white;
  background-color: #3498db;
  padding: 2px 6px;
  border-radius: 3px;
}

.theme-green {
  color: white;
  background-color: #27ae60;
  padding: 2px 6px;
  border-radius: 3px;
}

.theme-purple {
  color: white;
  background-color: #9b59b6;
  padding: 2px 6px;
  border-radius: 3px;
}

.grandchild-explanation {
  margin-top: 10px;
  padding: 12px;
  background-color: #d1f2eb;
  border-radius: 4px;
  border: 1px solid #76d7c4;
}

.grandchild-explanation ul {
  margin: 8px 0;
  padding-left: 20px;
}

.grandchild-explanation li {
  margin: 4px 0;
  color: #1a5276;
}
</style>
