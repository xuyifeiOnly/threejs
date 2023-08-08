<template>
  <div class="point_model" ref="instance">{{}}</div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import TWEEN from 'three-tween'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
const bufArrays = []
let current = 0
var scene: THREE.Scene
var points: THREE.Points
var geometry: THREE.BufferGeometry

interface ThreeProps {
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
}
const instance = ref<HTMLDivElement>(null)
const threeModel = reactive<ThreeProps>({
  camera: null,
  renderer: null,
  controls: null
})
const render = () => {
  points.rotation.x += 0.0003
  points.rotation.y += 0.001
  points.rotation.z += 0.002
  TWEEN.update()
  threeModel.renderer.render(scene, threeModel.camera)
  requestAnimationFrame(render)
}
const backgroundTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0)
  gradient.addColorStop(0, '#4e22b7')
  gradient.addColorStop(1, '#3292ff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const canvasTexture = new THREE.CanvasTexture(canvas)
  return canvasTexture
}

const transition = () => {
  // j是模型场景的定点
  for (let i = 0, j = 0; i < 26016; i++, j++) {
    const item = geometry['tween'][i]
    if (j >= bufArrays[current].length) {
      j = 0
    }
    // 表示从某个位置到另外一个位置
    item
      .to({ position: bufArrays[current][j] }, THREE.MathUtils.randFloat(1000, 4000)) // 变化时长
      .onUpdate(function () {
        geometry.attributes.position['array'][i] = this.position
        geometry.attributes.position.needsUpdate = true
      })
      .start()
  }

  setTimeout(() => {
    transition()
  }, 5000)
  current = (current + 1) % 3
}
const onWindowResize = () => {
  threeModel.renderer.setSize(window.innerWidth, window.innerHeight)
  threeModel.camera.aspect = window.innerWidth / window.innerHeight
  threeModel.camera.updateProjectionMatrix()
}
const _initBase = () => {
  let width = window.innerWidth
  let height = window.innerHeight
  let rate = width / height

  scene = new THREE.Scene()
  scene.background = backgroundTexture()
  // threeModel.scene.background = new THREE.Color(0x000)

  // 添加相机
  threeModel.camera = new THREE.PerspectiveCamera(45, rate, 0.1, 80)
  threeModel.camera.position.set(0, 0, 6)

  //  添加渲染器
  threeModel.renderer = new THREE.WebGLRenderer({ antialias: true })
  threeModel.renderer.setPixelRatio(window.devicePixelRatio)
  threeModel.renderer.setSize(width, height)

  const manager = new THREE.LoadingManager()
  manager.onStart = (url, itemsLoaded, itemsTotal) => {
    // console.log('onStart')
  }
  manager.onLoad = () => {
    // console.log('onLoad')
    transition()
    // console.log(bufArrays);
  }
  manager.onError = (url) => {
    // console.log(url)
  }
  const gltfLoader = new GLTFLoader(manager)
  gltfLoader.load('./box.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child['isMesh']) {
        child['geometry'].translate(0, 0.5, 0)
        const { array } = child['geometry'].attributes.position
        bufArrays.push(array)
      }
    })
  })
  gltfLoader.load('./box1.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child['isMesh']) {
        child['geometry'].scale(0.5, 0.5, 0.5)
        const { array } = child['geometry'].attributes.position
        bufArrays.push(array)
      }
    })
  })
  gltfLoader.load('./sphere.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child['isMesh']) {
        child['geometry'].translate(1, 0, 0)
        const { array } = child['geometry'].attributes.position
        bufArrays.push(array)
      }
    })
  })

  // 创建点
  geometry = new THREE.BufferGeometry()
  geometry['tween'] = []
  const vertices = []
  for (let i = 0; i < 26016; i++) {
    const position = THREE.MathUtils.randFloat(-4, 4)
    geometry['tween'].push(new TWEEN.Tween({ position }).easing(TWEEN.Easing.Exponential.In))
    vertices.push(position)
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.032,
      map: new THREE.TextureLoader().load('./white-dot.png'),
      alphaTest: 0.1,
      opacity: 0.5,
      transparent: true,
      depthTest: true
    })
  )
  scene.add(points)

  threeModel.controls = new OrbitControls(threeModel.camera, threeModel.renderer.domElement)
  threeModel.controls.update()
  instance.value.appendChild(threeModel.renderer.domElement)
  render()
  window.addEventListener('resize', onWindowResize, false)
  // threeModel.geometry = new THREE.BoxGeometry(1, 1, 1)
}
onMounted(() => {
  _initBase()
})
</script>
<style lang="scss" scoped>
.point_model {
}
</style>
