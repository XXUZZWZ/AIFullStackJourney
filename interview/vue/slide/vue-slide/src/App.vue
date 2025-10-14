<script setup>
import {
  ref, // 引用类型 简单类型
  // reactive  对象 
  onMounted, // 生命周期函数
  onUnmounted
} from 'vue'

const images = ['#ff6b6f', '#4ec777', 'pink', 'blue', 'red'];
const currentIndex = ref(0); // number
let timer = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
}
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

onMounted(() => {
  timer = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  clearInterval(timer);
})

</script>

<template>
  <div class="carousel">
    <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div class="slide" v-for="(color, index) in images" :key="index" :style="{ background: `${color}` }">
        slide{{ index }}
      </div>
    </div>
    <button class="arrow left" @click="prevSlide">&lt;</button>
    <button class="arrow right" @click="nextSlide">&gt;</button>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 400px;
  height: 200px;
  overflow: hidden;
  border-radius: 12px;

}

.slides {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  height: 100%;
}

.slide {
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 20px;
  border-radius: 4px;
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

.arrow:hover {
  background-color: rgba(0, 0, 0, 0.6);

}
</style>
