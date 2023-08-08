<template>
  <div class="car_model">
    <div ref="dom"></div>
    <div class="bu">
      <div class="title">修改车身颜色</div>
      <div
        v-for="(item, index) in colors"
        :key="index"
        @click="() => changeColor(item)"
        :style="{ background: item }"
        class="item"
      ></div>
    </div>
    <Loading :number="progress"></Loading>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import TWEEN from 'three-tween'
import { TWEEN } from './utils/tween'
import * as THREE from 'three'
import {
  initCamera,
  initControls,
  initScene,
  addGrid,
  addAxes,
  initRender,
  addLight,
  target,
  easeOutCirc,
  initialCameraPosition
} from './utils/car_model'
import { Mt_Body } from './utils/MaterialAndAction'
import { GLBs, tweenCollection } from './utils/dict'
import { loadGLTFModel } from './utils/util'
const progress = ref('50')
const dom = ref<HTMLElement>()
let req = null
let models = []
let frame = 0
const colors = ref(['#D24A57', '#1537c6', '#c61531', '#4df009', '#0dedfc', '#4f0ad3'])
const setupTweenDoor = (door, status) => {
  const { from, to } = door.rotateDirection[status]

  if (status == 'open') {
    door.status = 'close'
  }
  if (status == 'close') {
    door.status = 'open'
  }
  // TWEEN.removeAll()
  let lastLocation = null
  if (tweenCollection[door.name].tween) {
    lastLocation = { value: tweenCollection[door.name].from.value }
    tweenCollection[door.name].tween.stop()
  } else {
    lastLocation = { value: from.value }
  }
  tweenCollection[door.name].tween = new TWEEN.Tween(lastLocation)
    .to(to, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(function (lastLocation) {
      door.outer.rotation[door.rotateDirection.rotateAxis] = THREE.MathUtils.degToRad(
        lastLocation.value
      )
      tweenCollection[door.name].from.value = lastLocation.value
    })
    .onComplete(() => {
      tweenCollection[door.name] = {
        tween: null,
        from: { value: null },
        to: { value: null }
      }
    })
    .start()
}
const changeColor = (color: string) => {
  Mt_Body.color.set(color)
}
const initData = async (progress: any) => {
  const scene = initScene()
  addLight(scene)
  const camera = initCamera()
  const renderer = initRender(dom.value)
  const controls = initControls(camera, renderer)
  // addGrid(scene)
  // addAxes(scene)
  Promise.all(
    GLBs.map((item) =>
      loadGLTFModel(scene, item, renderer, {
        receiveShadow: false,
        castShadow: false
      })
    )
  ).then((res) => {
    progress.value ='100'
    models = res
    animate()
  })
  const animate = () => {
    req = requestAnimationFrame(animate)

    frame = frame <= 100 ? frame + 1 : frame

    if (frame <= 100) {
      const p = initialCameraPosition
      const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20

      // camera.position.y = 10
      camera.position.y = 2.5
      camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
      camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
      camera.lookAt(target)
    } else {
      controls.update()
    }

    TWEEN.update()

    renderer.render(scene, camera)
  }
  animate()
  const setupTweenCarIn = (model) => {
    const { x: cx, y: cy, z: cz } = camera.position
    const { x: tocx, y: tocy, z: tocz } = model.carInCameraPosition

    setupTweenCamera(
      { cx, cy, cz, ox: 0, oy: 0, oz: 0 },
      { cx: tocx, cy: tocy, cz: tocz, ox: 0, oy: tocy, oz: 0.3 }
    )

    function setupTweenCamera(source, target) {
      const carTween = new TWEEN.Tween(source).to(target, 2000).easing(TWEEN.Easing.Quadratic.Out)
      carTween.onUpdate(function (that) {
        camera.position.set(that.cx, that.cy, that.cz)
        controls.target.set(that.ox, that.oy, that.oz)
      })
      carTween.start()
    }
  }

  // 事件绑定
  const pickupObjects = (event) => {
    const container = dom.value
    if (container) {
      const scW = container.clientWidth
      const scH = container.clientHeight
      const offsetLeft = container.offsetLeft
      const offsetTop = container.offsetTop

      let mouse = new THREE.Vector2()
      mouse.x = ((event.clientX - offsetLeft) / scW) * 2 - 1
      mouse.y = -((event.clientY - offsetTop) / scH) * 2 + 1
      //使用射线
      let raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)

      let intersects = raycaster.intersectObjects(scene.children)
      if (intersects.length > 0) {
        if (
          intersects[0].object.name.includes('Door') ||
          intersects[0].object.name.includes('Trunk')
        ) {
          let doorName = intersects[0].object.name.split('_')[0]
          let door = models.find((item) => item.name === doorName)
          if (door && door.outer && door.status) {
            setupTweenDoor(door, door.status)
          }
        }
        if (intersects[0].object.name.includes('INT')) {
          controls.autoRotate = false
          let INT = models.find((item) => item.name === 'INT')
          setupTweenCarIn(INT)
        }
      }
    }
  }
  window.addEventListener('click', pickupObjects, false) // 监听单击拾取对象初始化球体
}

onUnmounted(() => {
  cancelAnimationFrame(req)
  // renderer.domElement.remove()
  // renderer.dispose()
})
onMounted(() => {
  initData(progress)
})
</script>
<style lang="scss" scoped>
.car_model {
  .bu {
    position: fixed;
    right: 20px;
    top: 20px;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: right;
    }
    .item {
      display: inline-block;
      margin-right: 20px;
      width: 30px;
      height: 30px;
      margin-bottom: 20px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
