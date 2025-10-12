# Vue 2 与 Vue 3 组件写法对比

## 组件结构对比

### Vue 2 Options API 写法 (ChildOne.vue)
```vue
<template>
  <div class="child-one">
    <h3>ChildOne Component</h3>
    <p>Message from parent (msg1):{{ msg1 }}</p>
    <p>Message from parent (msg2): {{ msg2 }}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg1: {
      type: String,
      default: ""
    },
    msg2: {
      type: String,
      default: ""
    }
  }
}
</script>
```

### Vue 3 Composition API 写法 (ChildTwo.vue)
```vue
<template>
  <div class="child-two">
    <h3>ChildTwo Component</h3>
    <p>Message from parent (msg1): {{ msg1 }}</p>
    <p>Message from parent (msg2): {{ msg2 }}</p>
    <p>This component uses modern Vue 3 syntax with TypeScript.</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  msg1: {
    type: String,
    default: ""
  },
  msg2: {
    type: String,
    default: ""
  }
})
</script>
```

## 主要差异对比

### 1. Props 定义方式

**Vue 2 (Options API):**
```javascript
export default {
  props: {
    msg1: {
      type: String,
      default: ""
    }
  }
}
```

**Vue 3 (Composition API):**
```javascript
// 运行时声明
defineProps({
  msg1: {
    type: String,
    default: ""
  }
})

// 或 TypeScript 类型声明
interface Props {
  msg1: string
  msg2: string
}
const props = defineProps<Props>()
```

### 2. 响应式数据定义

**Vue 2 (Options API):**
```javascript
export default {
  data() {
    return {
      count: 0
    }
  }
}
```

**Vue 3 (Composition API):**
```javascript
import { ref } from 'vue'

const count = ref(0)
```

### 3. 方法定义

**Vue 2 (Options API):**
```javascript
export default {
  methods: {
    increment() {
      this.count++
    }
  }
}
```

**Vue 3 (Composition API):**
```javascript
const increment = () => {
  count.value++
}
```

### 4. 计算属性

**Vue 2 (Options API):**
```javascript
export default {
  computed: {
    doubledCount() {
      return this.count * 2
    }
  }
}
```

**Vue 3 (Composition API):**
```javascript
import { computed } from 'vue'

const doubledCount = computed(() => count.value * 2)
```

## 混合写法示例 (ParentOne.vue)

```vue
<script>
import { ref } from 'vue'

export default {
  data() {
    return {
      msg1: "msg1",  // Vue 2 风格
    }
  },
  setup() {
    const msg2 = ref("msg2")  // Vue 3 风格
    return {
      msg2,
    }
  }
}
</script>
```

## 优缺点对比

### Vue 2 Options API
**优点：**
- 结构清晰，易于理解
- 学习曲线平缓
- 代码组织有固定模式
- 适合简单应用

**缺点：**
- 逻辑关注点分散
- 代码复用困难
- TypeScript 支持有限
- 大型应用维护困难

### Vue 3 Composition API
**优点：**
- 更好的逻辑复用
- 更好的 TypeScript 支持
- 更灵活的逻辑组织
- 更好的 tree-shaking
- 更适合大型应用

**缺点：**
- 学习曲线较陡
- 需要更多经验来组织代码
- 迁移成本较高

## 迁移建议

1. **新项目**: 直接使用 Vue 3 + Composition API
2. **现有项目**: 可以逐步迁移，先在新组件中使用 Composition API
3. **混合使用**: Vue 3 支持两种写法共存，可以平滑过渡

## 性能差异

- Vue 3 有更好的性能优化
- Composition API 在大型应用中表现更好
- Options API 在小到中型应用中差异不大

## 总结

两种写法各有优势，Vue 3 的 Composition API 代表了未来的发展方向，提供了更好的开发体验和更强的能力。对于新项目，推荐使用 Vue 3 的现代写法；对于现有项目，可以根据实际情况选择迁移策略。