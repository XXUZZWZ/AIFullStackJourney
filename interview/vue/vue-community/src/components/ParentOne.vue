<template>
  <div class="parent-one">
    <h2>ParentOne Component</h2>
    <ChildOne :msg1="msg1" :msg2="msg2" />
    <p>This is the ParentOne component.</p>
  </div>
</template>

<script>
// 导入子组件 ChildOne
import ChildOne from './ChildOne.vue'
// 从 Vue 中导入 ref 函数，用于创建响应式数据
import { ref } from 'vue'

// vue2 类组件写法 - 使用 Vue 2/3 兼容的 Options API
export default {
  // 注册子组件，使其可以在模板中使用
  components: {
    ChildOne
  },

  /**
   * data() - Vue 2 的 Options API 方式
   * 用于定义组件的响应式数据
   * data 函数返回的对象中的属性会被 Vue 转换为响应式数据
   * 特点：
   * - 在组件实例创建时执行
   * - 返回的对象会被 Vue 转换为响应式
   * - 在模板中可以直接访问这些属性
   */
  data() {
    return {
      // msg1 是一个普通的响应式数据（Vue 2 风格）
      // 在模板中可以直接使用 msg1
      msg1: "msg1",
    }
  },

  /**
   * setup() - Vue 3 的 Composition API 入口函数
   * setup 函数在组件创建之前执行，是 Composition API 的核心
   * 可以在这里定义响应式数据、计算属性、方法等
   *
   * 关键特点：
   * 1. 执行时机：在 beforeCreate 和 created 之间
   * 2. 返回的对象会暴露给模板和组件实例
   * 3. 可以与 Options API（如 data、methods）混用
   * 4. 在 setup 中访问 ref 需要使用 .value，但在模板中可以直接使用
   */
  setup() {
    // 使用 ref 创建一个响应式引用（Vue 3 风格）
    // ref 会将基本类型数据包装成响应式对象
    // 在 setup 中访问需要使用 .value，但在模板中可以直接使用
    const msg2 = ref("msg2");

    // 返回的对象中的属性可以在模板中直接调用
    // 这里返回 msg2，所以模板中可以使用 {{ msg2 }}
    return {
      msg2, // 相当于 msg2: msg2
    }
  }
}

/**
 * 总结：这个组件展示了 Vue 2 和 Vue 3 API 的混用
 *
 * Vue 2 Options API (data):
 * - msg1 通过 data() 定义
 * - 适合简单的数据声明
 * - 传统 Vue 2 写法，容易理解
 *
 * Vue 3 Composition API (setup):
 * - msg2 通过 setup() + ref() 定义
 * - 更灵活，适合复杂逻辑组织
 * - 更好的 TypeScript 支持
 * - 更容易复用逻辑
 * - 现代 Vue 3 推荐写法
 *
 * 两种方式定义的数据都会传递给子组件 ChildOne：
 * - :msg="msg1"  (来自 data)
 * - :msg2="msg2" (来自 setup)
 *
 * 注意：在 Vue 3 中，推荐使用 `<script setup>` 语法糖，
 * 但这里使用了兼容性更好的混合写法
 */
</script>

<style scoped>
.parent-one {
  padding: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  margin: 10px;
}

h2 {
  color: #42b983;
  margin-top: 0;
}
</style>
