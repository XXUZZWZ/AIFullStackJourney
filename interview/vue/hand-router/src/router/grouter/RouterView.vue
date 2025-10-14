<template>
  <!-- 动态组件 -->
  <component :is="component" />

</template>

<script setup>
import {
  computed
} from 'vue'
// 计算属性
import { useRouter } from '../grouter/index';// hooks 路由实例

let router = useRouter()
// 计算当前路由
const component = computed(() => {
  const currentPath = window.location.hash.slice(1) || '/'
  const matchedRoute = router.routes.find((route) => route.path === currentPath)
  console.log(matchedRoute, 'route')
  return matchedRoute ? matchedRoute.component : null
})
</script>

<style></style>