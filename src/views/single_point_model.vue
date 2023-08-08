<template>
  <div class="single_point_model">
    <div ref="instance"></div>
    <!-- <button class="fix_btn" @click="ceshi">点击</button> -->
    <Loading :number="progress"></Loading>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TWEEN from 'three-tween'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
var scene: THREE.Scene
const instance = ref<HTMLDivElement>(null)
var camera: THREE.PerspectiveCamera
var renderer: THREE.WebGLRenderer
var points: THREE.Points
var geometry: THREE.BufferGeometry
var controls: OrbitControls
let donut: THREE.Group
var bufArrays = []
var colors = []
let animateDone = false
const progress = ref('')
const ceshi = () => {
  console.log(camera.position)
}
const clock = new THREE.Clock()
const render = () => {
  if (animateDone) {
    if (donut) {
      const elapsedTime = clock.getElapsedTime()
      donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1
      // donut.rotation.z += 0.03
    }
  }
  //   points.rotation.x += 0.0003
  //   points.rotation.y += 0.001
  //   points.rotation.z += 0.002
  TWEEN.update()
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

const transition = () => {
  let k = 0
  return new Promise((resolve) => {
    // j是模型场景的定点
    for (let i = 0, j = bufArrays.length; i < j; i++) {
      const item = geometry['tween'][i]
      // 表示从某个位置到另外一个位置
      item
        .to({ position: bufArrays[i] }, THREE.MathUtils.randFloat(1000, 4000)) // 变化时长
        .onUpdate(function () {
          geometry.attributes.position['array'][i] = this.position
          geometry.attributes.position.needsUpdate = true
        })
        .onComplete(() => {
          k += 1
          if (k == j) {
            resolve(true)
          }
        })
        .start()
    }
  })
}
const initData = async () => {
  let width = window.innerWidth
  let height = window.innerHeight
  let rate = width / height
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#666')
  // threeModel.scene.background = new THREE.Color(0x000)
  // 添加相机
  camera = new THREE.PerspectiveCamera(45, rate, 0.1, 80)

  camera.position.set(2.6320291531248485, 1.1848475651323458, 5.2600911384215445)
  camera.lookAt(0, 0, 0)

  //  添加渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  //   renderer.setClearColor('transparent')
  //   const axesHel = new THREE.AxesHelper(5)
  //   scene.add(axesHel)
  // 添加模型
  const manager = new THREE.LoadingManager(
    () => {
      // 加载完成
    },
    (url: string, loaded: number, total: number) => {
      // 加载进度
      progress.value = ((loaded / total) * 100).toFixed(2)
    }
  )
  const gltfLoader = new GLTFLoader(manager)
  gltfLoader.load('./donut/scene.gltf', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child['isMesh']) {
        // child['geometry'].translate(0, 0.5, 0)
        const { array } = child['geometry'].attributes.position
        //   for (let i = 0; i < 26016; i++) {
        //     const position = THREE.MathUtils.randFloat(-4, 4)
        //     geometry['tween'].push(new TWEEN.Tween({ position }).easing(TWEEN.Easing.Exponential.In))
        //     vertices.push(position)
        //   }
        if (child.name === 'Object_6') {
          array.forEach((it) => {
            bufArrays.push(it)
            colors.push(Math.random())
          })
        }
      }
    })

    geometry = new THREE.BufferGeometry()
    geometry['tween'] = []
    const vertices = []
    for (let i = 0; i < bufArrays.length; i++) {
      const position = THREE.MathUtils.randFloat(-4, 4)
      geometry['tween'].push(new TWEEN.Tween({ position }).easing(TWEEN.Easing.Exponential.In))
      vertices.push(position)
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        // color: THREE.BufferAttribute(colors,3),
        size: 0.044,
        // color: new THREE.BufferAttribute(new Float32Array(colors), 3),
        // map: new THREE.TextureLoader().load('./white-dot.png'),
        // alphaTest: 0.1,
        // opacity: 0.5,
        transparent: false,
        depthTest: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      })
    )
    // points.rotateX(1)
    const radius = 8.5
    points.rotateX(1)
    // points.rotation.x = Math.PI * 0.2
    // points.rotation.z = Math.PI * 0.15
    points.scale.set(radius, radius, radius)
    scene.add(points)
    donut = gltf.scene

    donut.rotateX(1)
    // donut.position.x = 1.5
    // donut.rotation.x = Math.PI * 0.2
    // donut.rotation.z = Math.PI * 0.15
    donut.scale.set(radius, radius, radius)
    transition().then((res) => {
      scene.add(donut)
      scene.remove(points)
      animateDone = true
    })
  })
  // 添加灯光
  /**
   * Light
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 2, 0)

  directionalLight.castShadow = true
  scene.add(directionalLight)
  // 创建点
  //   geometry = new THREE.BufferGeometry()
  //   geometry['tween'] = []
  //   const vertices = []
  //   for (let i = 0; i < 26016; i++) {
  //     const position = THREE.MathUtils.randFloat(-4, 4)
  //     geometry['tween'].push(new TWEEN.Tween({ position }).easing(TWEEN.Easing.Exponential.In))
  //     vertices.push(position)
  //   }
  //   geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
  //   points = new THREE.Points(
  //     geometry,
  //     new THREE.PointsMaterial({
  //       size: 0.032,
  //       map: new THREE.TextureLoader().load('./white-dot.png'),
  //       alphaTest: 0.1,
  //       opacity: 0.5,
  //       transparent: true,
  //       depthTest: true
  //     })
  //   )
  //   scene.add(points)

  // 渲染到页面
  controls = new OrbitControls(camera, renderer.domElement) // 本质是改变相机的参数

  controls.update()
  instance.value.appendChild(renderer.domElement)
  render()
}
onMounted(() => {
  initData()
})
</script>
<style lang="scss" scoped>
.single_point_model {
}
</style>
