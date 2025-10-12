<template>
  <div class="child-one">
    <h3>ChildOne Component</h3>
    <p>Message from parent (msg1):{{ msg1 }}</p>
    <p>Message from parent (msg2): {{ msg2 }}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg1: {
      type: String,
      default: ""
    },
    msg2: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped>
.child-one {
  padding: 15px;
  border: 2px solid #3498db;
  border-radius: 6px;
  margin: 10px 0;
  background-color: #f8f9fa;
}

h3 {
  color: #3498db;
  margin-top: 0;
}

p {
  margin: 8px 0;
  color: #333;
}
</style>
