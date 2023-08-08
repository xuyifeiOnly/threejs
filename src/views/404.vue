<template>
  <div class="z404">
    该页面没有找到 <br />
    <RouterLink to="/index" class="btn">返回首页</RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const hello = ref('hello world')
</script>
<style lang="scss" scoped>
.z404 {
  font-size: 30px;
  text-align: center;
}
</style>
