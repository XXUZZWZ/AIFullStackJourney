# Vue 3 JavaScript 最佳实践指南

## 1. 组件结构规范

### 1.1 文件命名
- 使用 PascalCase 命名组件文件：`UserProfile.vue`
- 使用 kebab-case 命名非组件文件：`user-profile.js`

### 1.2 组件模板结构
```vue
<template>
  <!-- 单根元素 -->
  <div class="component-name">
    <!-- 语义化 HTML 标签 -->
    <header class="component-header">
      <h1>{{ title }}</h1>
    </header>

    <main class="component-content">
      <!-- 内容区域 -->
    </main>

    <footer class="component-footer">
      <!-- 底部区域 -->
    </footer>
  </div>
</template>
```

## 2. Script Setup 最佳实践

### 2.1 导入顺序
```javascript
<script setup>
// 1. Vue 核心导入
import { ref, computed, watch, onMounted } from 'vue'

// 2. 第三方库导入
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 3. 组件导入
import UserCard from './UserCard.vue'
import Button from './Button.vue'

// 4. 工具函数导入
import { formatDate } from '@/utils/date'
import { validateEmail } from '@/utils/validation'

// 5. 类型定义导入
import type { User } from '@/types/user'
</script>
```

### 2.2 响应式数据定义
```javascript
<script setup>
// 基本类型使用 ref
const count = ref(0)
const name = ref('')
const isLoading = ref(false)

// 对象类型使用 reactive
const user = reactive({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})

// 数组使用 ref
const items = ref([])

// 计算属性
const fullName = computed(() => `${user.firstName} ${user.lastName}`)
const itemCount = computed(() => items.value.length)

// 方法定义
const increment = () => {
  count.value++
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/data')
    items.value = response.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>
```

## 3. Props 和 Emits 规范

### 3.1 Props 定义
```javascript
<script setup>
// 运行时声明
defineProps({
  // 必填属性
  title: {
    type: String,
    required: true
  },
  // 可选属性
  description: {
    type: String,
    default: ''
  },
  // 数字类型
  count: {
    type: Number,
    default: 0
  },
  // 数组类型
  items: {
    type: Array,
    default: () => []
  },
  // 对象类型
  config: {
    type: Object,
    default: () => ({})
  },
  // 函数类型
  onSuccess: {
    type: Function,
    default: () => {}
  }
})

// 或者使用 TypeScript 类型
defineProps<{
  title: string
  description?: string
  count?: number
  items?: any[]
  config?: Record<string, any>
  onSuccess?: () => void
}>()
</script>
```

### 3.2 Emits 定义
```javascript
<script setup>
// 定义 emits
const emit = defineEmits<{
  // 无参数事件
  (e: 'close'): void
  // 带参数事件
  (e: 'update:modelValue', value: string): void
  (e: 'submit', data: FormData): void
  // 可选参数事件
  (e: 'error', message?: string): void
}>()

// 使用 emits
const handleClose = () => {
  emit('close')
}

const handleSubmit = (data) => {
  emit('submit', data)
}
</script>
```

## 4. 响应式数据处理

### 4.1 避免直接修改响应式对象
```javascript
// ❌ 不推荐 - 直接修改
user.name = 'New Name'

// ✅ 推荐 - 使用 Object.assign 或展开运算符
Object.assign(user, { name: 'New Name' })
// 或者
user.name = 'New Name'
```

### 4.2 数组操作
```javascript
const list = ref([])

// ✅ 推荐的操作方式
list.value.push(newItem)           // 添加
list.value.splice(index, 1)        // 删除
list.value[index] = newValue       // 修改
list.value = [...list.value, item] // 不可变操作
```

### 4.3 解构响应式对象
```javascript
const user = reactive({
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  }
})

// ❌ 失去响应性
const { name, age } = user

// ✅ 保持响应性
const name = toRef(user, 'name')
const age = toRef(user, 'age')

// ✅ 或者使用 computed
const userName = computed(() => user.name)
const userAge = computed(() => user.age)
```

## 5. 组合式函数 (Composables)

### 5.1 创建组合式函数
```javascript
// composables/useCounter.js
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return {
    count,
    increment,
    decrement,
    reset
  }
}

// composables/useApi.js
export function useApi(url) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    error,
    isLoading,
    fetchData
  }
}
```

### 5.2 使用组合式函数
```javascript
<script setup>
import { useCounter, useApi } from '@/composables'

// 使用计数器
const { count, increment } = useCounter(0)

// 使用 API
const { data: users, isLoading, fetchData } = useApi('/api/users')

onMounted(() => {
  fetchData()
})
</script>
```

## 6. 事件处理

### 6.1 事件命名规范
```javascript
// ✅ 推荐的事件命名
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input-change': [value: string, event: Event]
  'form-submit': [data: FormData]
  'item-selected': [item: Item, index: number]
}>()
```

### 6.2 事件处理函数
```javascript
<script setup>
const handleClick = (event) => {
  // 阻止默认行为
  event.preventDefault()

  // 停止事件冒泡
  event.stopPropagation()

  // 业务逻辑
  emit('click', event)
}

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
}

// 防抖处理
const debouncedSearch = useDebounceFn((query) => {
  search(query)
}, 300)
</script>
```

## 7. 样式和 CSS 最佳实践

### 7.1 作用域样式
```vue
<style scoped>
/* 使用 BEM 命名规范 */
.component {
  &__header {
    padding: 1rem;
  }

  &__content {
    margin: 1rem 0;
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

/* 使用 CSS 变量 */
:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
}

.component {
  color: var(--primary-color);
  background-color: var(--secondary-color);
}
</style>
```

## 8. 性能优化

### 8.1 条件渲染优化
```vue
<template>
  <!-- 使用 v-show 频繁切换 -->
  <div v-show="isVisible">频繁切换的内容</div>

  <!-- 使用 v-if 一次性渲染 -->
  <div v-if="shouldRender">一次性渲染的内容</div>

  <!-- 列表渲染使用 key -->
  <div
    v-for="item in items"
    :key="item.id"
    class="item"
  >
    {{ item.name }}
  </div>
</template>
```

### 8.2 计算属性缓存
```javascript
// ✅ 推荐 - 使用计算属性
const filteredItems = computed(() => {
  return items.value.filter(item =>
    item.name.includes(searchTerm.value)
  )
})

// ❌ 不推荐 - 在模板中直接计算
// <div v-for="item in items.filter(i => i.name.includes(searchTerm))">
```

## 9. 错误处理

### 9.1 异步错误处理
```javascript
const fetchUser = async (userId) => {
  try {
    const user = await api.getUser(userId)
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    // 显示错误信息给用户
    showError('加载用户信息失败')
    throw error // 重新抛出错误
  }
}
```

### 9.2 组件错误边界
```javascript
// ErrorBoundary.vue
<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  console.error('Error captured:', err, info)
  // 阻止错误继续传播
  return false
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h3>Something went wrong</h3>
    <p>{{ error.message }}</p>
    <button @click="error = null">Try Again</button>
  </div>
  <slot v-else />
</template>
```

## 10. 代码组织原则

### 10.1 单一职责原则
- 每个组件只负责一个特定的功能
- 复杂的组件拆分为多个小组件
- 业务逻辑提取到组合式函数中

### 10.2 可复用性原则
- 创建通用的基础组件
- 使用组合式函数封装可复用逻辑
- 通过 props 和 slots 提供灵活性

### 10.3 可测试性原则
- 组件逻辑与 UI 分离
- 使用依赖注入而不是硬编码
- 编写单元测试和组件测试

通过遵循这些最佳实践，可以创建出可维护、可测试、高性能的 Vue 3 应用程序。