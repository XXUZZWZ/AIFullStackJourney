<script setup>
import EmitParent from './components/EmitParent.vue'
// 不用 return 了
import HelloWorld from './components/HelloWorld.vue'
import ParentOne from './components/ParentOne.vue'
import ParentTwo from './components/ParentTwo.vue'
import ExposeParent from './components/ExposeParent.vue'
import ProvideParent from './components/ProvideParent.vue'
import MittA from './components/MittA.vue'
import MittB from './components/MittB.vue'
import { ref } from 'vue'
const msg1 = ref("msg11")
const msg2 = ref("msg22")
</script>

<template>
  <div>
    <!-- <ParentOne />
    <ParentTwo :msg1="msg1" :msg2="msg2" />
    <EmitParent />
    <ExposeParent />
    <ProvideParent /> -->
    <MittA />
    <MittB />
  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
