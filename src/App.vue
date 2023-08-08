<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <header></header> -->
  <RouterView />
</template>

<style lang="scss">
.fix_btn{
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 20;
}
.btn {
  color: black;
  border: 1px solid black;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    background-color: #1890ff;
    color: white;
    border: none;
  }
}
</style>
