# Vue 3 组件通信完整指南

## 概述

Vue 3 提供了多种组件通信方式，每种方式都有其适用场景。本文档将详细介绍 Props、Emit、Expose、Provide/Inject 四种主要通信方式。

## 1. Props - 父传子数据传递

### 1.1 基本用法
```vue
<!-- 父组件 -->
<template>
  <ChildComponent :title="parentTitle" :count="parentCount" />
</template>

<!-- 子组件 -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

### 1.2 Props 特点
- **单向数据流**: 数据只能从父组件流向子组件
- **响应式**: 父组件数据变化会自动更新子组件
- **类型安全**: TypeScript 提供完整的类型检查

## 2. Emit - 子传父事件通信

### 2.1 基本用法
```vue
<!-- 子组件 -->
<template>
  <button @click="sendMessage">Send Message</button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'message-sent': [message: string]
  'counter-updated': [value: number]
}>()

const sendMessage = () => {
  emit('message-sent', 'Hello from child!')
}
</script>

<!-- 父组件 -->
<template>
  <ChildComponent
    @message-sent="handleMessage"
    @counter-updated="handleCounterUpdate"
  />
</template>

<script setup lang="ts">
const handleMessage = (message: string) => {
  console.log('Received message:', message)
}

const handleCounterUpdate = (value: number) => {
  console.log('Counter updated:', value)
}
</script>
```

### 2.2 Emit 特点
- **事件驱动**: 子组件主动通知父组件
- **解耦设计**: 子组件不需要知道父组件的具体实现
- **灵活参数**: 支持传递任意类型的数据

## 3. Expose - 父组件访问子组件

### 3.1 基本用法
```vue
<!-- 子组件 -->
<template>
  <div>Child Component</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const internalData = ref('private data')
const counter = ref(0)

// 暴露给父组件的方法和数据
defineExpose({
  // 方法
  sayHello: () => 'Hello from child!',
  increment: () => counter.value++,

  // 数据（可以控制访问权限）
  counter: {
    get: () => counter.value
  },

  // 完整数据暴露
  getData: () => internalData.value
})
</script>

<!-- 父组件 -->
<template>
  <ChildComponent ref="childRef" />
  <button @click="callChildMethod">Call Child Method</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

const callChildMethod = () => {
  if (childRef.value) {
    const result = childRef.value.sayHello()
    console.log(result)

    childRef.value.increment()
    console.log('Counter:', childRef.value.counter)
  }
}
</script>
```

### 3.2 Expose 特点
- **命令式调用**: 父组件主动调用子组件方法
- **选择性暴露**: 子组件可以控制哪些内容对外可见
- **类型安全**: TypeScript 提供完整的类型支持

## 4. 三种通信方式对比

| 特性 | Props | Emit | Expose |
|------|-------|------|--------|
| 数据流向 | 父 → 子 | 子 → 父 | 父 ↔ 子 |
| 通信方式 | 属性传递 | 事件发射 | 方法调用 |
| 触发方 | 父组件 | 子组件 | 父组件 |
| 适用场景 | 数据展示 | 用户交互 | 复杂逻辑 |
| 耦合度 | 低 | 低 | 较高 |

## 5. 实际应用场景

### 5.1 表单组件 (Props + Emit)
```vue
<!-- FormInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
```

### 5.2 复杂业务组件 (Props + Emit + Expose)
```vue
<!-- DataTable.vue -->
<template>
  <table>
    <!-- 表格内容 -->
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
defineProps<{
  data: any[]
  columns: string[]
}>()

// Emit
defineEmits<{
  'row-click': [row: any]
  'selection-change': [selected: any[]]
}>()

// Expose
const selectedRows = ref<any[]>([])

defineExpose({
  clearSelection: () => selectedRows.value = [],
  getSelectedRows: () => selectedRows.value,
  refresh: () => {
    // 刷新数据的逻辑
  }
})
</script>
```

## 6. 最佳实践

### 6.1 通信方式选择原则
1. **优先使用 Props + Emit**: 适用于大多数场景，保持组件解耦
2. **谨慎使用 Expose**: 只在需要直接操作子组件内部逻辑时使用
3. **避免过度通信**: 不要为了通信而通信，保持组件独立性

### 6.2 类型安全
```typescript
// 完整的类型定义
interface Props {
  title: string
  data?: Record<string, any>
  onSuccess?: () => void
}

interface Emits {
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
  (e: 'error', message: string): void
}

interface Exposed {
  validate: () => boolean
  reset: () => void
  getData: () => any
}
```

### 6.3 性能考虑
- 避免在 Props 中传递大型对象
- 使用计算属性优化频繁更新的数据
- 合理使用 v-if 和 v-show 控制组件渲染

## 7. 常见问题

### 7.1 Props 响应式丢失
```typescript
// ❌ 错误：直接解构会失去响应性
const { title, count } = defineProps<Props>()

// ✅ 正确：使用 toRefs 保持响应性
const props = defineProps<Props>()
const { title, count } = toRefs(props)
```

### 7.2 Emit 事件命名
```typescript
// ✅ 推荐：使用 kebab-case 事件名
defineEmits<{
  'form-submit': [data: FormData]
  'input-change': [value: string]
}>()

// ❌ 不推荐：使用 camelCase
defineEmits<{
  'formSubmit': [data: FormData]
}>()
```

### 7.3 Expose 安全性
```typescript
// ✅ 推荐：选择性暴露，控制访问权限
defineExpose({
  // 只暴露必要的方法
  publicMethod: () => { /* ... */ },

  // 控制数据访问
  data: {
    get: () => internalData.value
  }
})

// ❌ 不推荐：暴露所有内部状态
defineExpose({
  internalData,  // 直接暴露响应式数据
  privateMethod: () => { /* ... */ }
})
```

## 4. Provide/Inject - 跨层级组件通信

### 4.1 基本用法
```vue
<!-- 父组件 (ProvideParent.vue) -->
<template>
  <div>
    <ProvideChild />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive } from 'vue'

// 提供响应式数据
const theme = ref('light')
const user = reactive({
  name: 'John Doe',
  email: 'john@example.com'
})

// 使用 provide 提供数据
provide('theme', theme)
provide('user', user)
provide('updateTheme', (newTheme: string) => {
  theme.value = newTheme
})
</script>

<!-- 子组件 (ProvideChild.vue) -->
<template>
  <div>
    <p>Theme: {{ theme }}</p>
    <p>User: {{ user.name }}</p>
    <button @click="updateTheme('dark')">Switch to Dark</button>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'

// 使用 inject 注入数据
const theme = inject<Ref<string>>('theme', ref('light'))
const user = inject('user', { name: 'Unknown', email: '' })
const updateTheme = inject<(theme: string) => void>('updateTheme', () => {})
</script>
```

### 4.2 Provide/Inject 特点
- **跨层级通信**: 可以在任意深度的子组件中访问数据
- **避免 prop drilling**: 不需要通过中间组件传递 props
- **全局状态管理**: 适合主题、用户信息等全局数据
- **类型安全**: TypeScript 提供完整的类型支持

## 5. 四种通信方式对比

| 特性 | Props | Emit | Expose | Provide/Inject |
|------|-------|------|--------|----------------|
| 数据流向 | 父 → 子 | 子 → 父 | 父 ↔ 子 | 祖先 → 后代 |
| 通信方式 | 属性传递 | 事件发射 | 方法调用 | 依赖注入 |
| 触发方 | 父组件 | 子组件 | 父组件 | 祖先组件 |
| 适用场景 | 数据展示 | 用户交互 | 复杂逻辑 | 全局状态 |
| 耦合度 | 低 | 低 | 较高 | 较低 |
| 层级限制 | 直接父子 | 直接父子 | 直接父子 | 任意层级 |

## 6. 实际应用场景

### 6.1 全局状态管理 (Provide/Inject)
```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref, provide } from 'vue'

// 提供全局状态
const currentUser = ref(null)
const theme = ref('light')
const isLoading = ref(false)

provide('currentUser', currentUser)
provide('theme', theme)
provide('isLoading', isLoading)
provide('setLoading', (loading: boolean) => {
  isLoading.value = loading
})
</script>

<!-- 任意子组件 -->
<script setup lang="ts">
import { inject, Ref } from 'vue'

const theme = inject<Ref<string>>('theme')
const setLoading = inject<(loading: boolean) => void>('setLoading')

const handleSubmit = async () => {
  setLoading(true)
  // 执行操作
  setLoading(false)
}
</script>
```

## 7. 最佳实践

### 7.1 通信方式选择原则
1. **优先使用 Props + Emit**: 适用于大多数场景，保持组件解耦
2. **谨慎使用 Expose**: 只在需要直接操作子组件内部逻辑时使用
3. **合理使用 Provide/Inject**: 用于跨层级共享全局状态
4. **避免过度通信**: 不要为了通信而通信，保持组件独立性

### 7.2 Provide/Inject 类型安全
```typescript
// 定义注入键
const ThemeKey = Symbol('theme') as InjectionKey<Ref<string>>
const UserKey = Symbol('user') as InjectionKey<User>

// 提供数据
provide(ThemeKey, theme)
provide(UserKey, user)

// 注入数据
const theme = inject(ThemeKey)
const user = inject(UserKey)
```

## 8. 常见问题

### 8.1 Provide/Inject 响应式
```typescript
// ✅ 正确：提供响应式数据
const theme = ref('light')
provide('theme', theme)

// ❌ 错误：提供非响应式数据
provide('theme', 'light')  // 不会响应式更新
```

### 8.2 Provide/Inject 默认值
```typescript
// ✅ 推荐：提供有意义的默认值
const theme = inject<Ref<string>>('theme', ref('light'))
const user = inject('user', { name: 'Guest', role: 'user' })

// ❌ 不推荐：不提供默认值
const theme = inject('theme')  // 可能为 undefined
```

## 总结

Vue 3 的组件通信机制提供了灵活而强大的工具集：
- **Props** 用于数据传递
- **Emit** 用于事件通知
- **Expose** 用于方法调用
- **Provide/Inject** 用于跨层级通信

根据具体场景选择合适的通信方式，可以构建出可维护、可复用、高性能的 Vue 应用。