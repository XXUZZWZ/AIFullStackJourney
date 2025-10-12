<script setup lang="ts">
import { ref } from 'vue';

const active = ref<number>(0);

</script>

<template>
  <div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" name="home" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="discount" name="discount" to="/discount">优惠</van-tabbar-item>
      <van-tabbar-item icon="star-o" name="collection" to="/collection">收藏</van-tabbar-item>
      <van-tabbar-item icon="setting-o" name="trip" to="/trip">行程</van-tabbar-item>
      <van-tabbar-item icon="user-o" name="account" to="/account">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>