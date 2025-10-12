<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input type="text" placeholder="用户名" required v-model="username">
      <input type="password" placeholder="密码" required v-model="password">
      <button type="submit"> 登录 </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from "@/stores/user";

import { login } from "@/api/login";

const username = ref("");
const password = ref("");
const userStore = useUserStore();
const router = useRouter()

const handleLogin = async () => {
  try {
    const data = await login({
      username: username.value,
      password: password.value
    })
    userStore.setToken(data.token);
    userStore.setUsername(data.username);

    router.push("/");
  } catch (error) {
    console.log(error);
  }
}

</script>

<style scoped></style>