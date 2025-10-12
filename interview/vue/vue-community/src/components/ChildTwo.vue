<template>
  <div class="child-two">
    <h3>ChildTwo Component</h3>
    <p>Message from parent (msg1): {{ msg1 }}</p>
    <p>Message from parent (msg2): {{ msg2 }}</p>
    <p>This component uses modern Vue 3 syntax with TypeScript.</p>
  </div>
</template>

<script setup lang="ts">
// 使用 defineProps 定义组件 props
// 这是 Vue 3 的现代写法，不需要额外的组件选项
// interface Props {
//   msg1: string
//   msg2: string
// }

// 定义 props 类型
// const props = defineProps<Props>()

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

// 在模板中可以直接使用 props.msg1 和 props.msg2
// 或者使用解构：const { msg1, msg2 } = defineProps<Props>()
</script>

<style scoped>
.child-two {
  padding: 15px;
  border: 2px solid #9b59b6;
  border-radius: 6px;
  margin: 10px 0;
  background-color: #f8f9fa;
}

h3 {
  color: #9b59b6;
  margin-top: 0;
}

p {
  margin: 8px 0;
  color: #333;
}
</style>
