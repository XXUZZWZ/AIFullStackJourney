<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
 <router-view/>
 <router-link to="/login" class="router-link">登录</router-link>
 <router-link to="/home">首页</router-link>
</template>

<style scoped>

  .router-link {
    margin-right: 10px;
  }

</style>
