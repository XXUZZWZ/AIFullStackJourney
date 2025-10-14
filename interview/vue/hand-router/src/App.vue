<script setup>
// 全局
// vue.use 声明route-link or route-view 等组件
</script>

<template>
  <div>

    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <br>
    <router-view />
  </div>
</template>

<style scoped></style>
