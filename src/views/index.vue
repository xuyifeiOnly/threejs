<template>
  <div class="home_index">
    <canvas class="my_canvas" ref="canvas"></canvas>
    <div class="container" id="container">
      <div class="title">项目展示</div>
      <div class="pro_list">
        <div
          @click="() => toNav(item)"
          class="nav_item btn"
          v-for="(item, index) in navList"
          :key="index"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import gsap from 'gsap'
import { onMounted, ref, reactive } from 'vue'
import { createScene } from './utils/index'
import type { RouterProps } from '@/models/index'
import { routerList } from '@/utils/index'
import { useRouter } from 'vue-router'
const router = useRouter()
const canvas = ref<HTMLCanvasElement>()
const navList = ref<RouterProps[]>()
let cameraIstance: THREE.PerspectiveCamera
const toNav = (item: RouterProps) => {
  gsap.to('#container', {
    opacity: 0
  })
  gsap.to(cameraIstance.position, {
    z: 25,
    ease: 'power3.inOut',
    duration: 2
  })
  gsap.to(cameraIstance.rotation, {
    x: 1.57,
    ease: 'power3.inOut',
    duration: 2
  })

  gsap.to(cameraIstance.position, {
    y: 1000,
    ease: 'power3.in',
    duration: 1,
    delay: 2,
    onComplete: () => {
      router.push(item.path)
      // console.log(131);
    }
  })
}
onMounted(() => {
  navList.value = routerList().filter((it) => {
    return !(it.name === '404' || it.name === 'index')
  })
  const { camera } = createScene(canvas.value)
  cameraIstance = camera
})
</script>
<style lang="scss" scoped>
.home_index {
  .container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 30;
    color: white;
    .pro_list {
      max-width: 600px;
      text-align: center;
    }
    .nav_item {
      display: inline-block;
      margin-right: 20px;
      border: none;
      color: white;
      border: 1px solid white;
      border-radius: 8px;
      padding: 8px 15px;
      transition: all 0.5s;
      margin-bottom: 20px;
      cursor: pointer;
      &:hover {
        background-color: white;
        color: black;
      }
    }
    .title {
      font-size: 30px;
      margin-bottom: 50px;
    }
  }
}
.my_canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
