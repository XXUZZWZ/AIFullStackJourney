<template>
  <div>
    <h1>Home</h1>
    <div class="home-container" v-if="userStore.isLogin">
      <h2> 欢迎 {{ userStore.username }} 登录 </h2>
      <button @click="handleLogout"> 退出登录 </button>
    </div>
    <div v-else>
      <h2> 请先登录 </h2>
      <router-link to="/login"> 登录 </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.setToken('')
  userStore.setUsername('')
  router.push('/login')
}
</script>

<style scoped></style>