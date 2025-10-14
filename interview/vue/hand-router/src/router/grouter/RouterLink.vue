<script setup>

import {
  defineProps
} from 'vue'

let props = defineProps({
  to: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <a :href="'#' + props.to">
    <slot />
  </a>
</template>

<style></style>