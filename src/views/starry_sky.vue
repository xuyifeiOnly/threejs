<template>
  <div class="starry_sky">
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Particle } from './utils/starry.sky'
const canvas = ref()
const init = function () {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const particleNum = 100
  const lineDistance = 120
  const colorRGB = '254, 250, 224'
  let particles = []
  let interactionParticle = null

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min
  }

  function createParticles() {
    for (let i = 0; i < particleNum; i++) {
      let size = getRandomArbitrary(2, 4)
      let x = Math.random() * canvas.width
      let y = Math.random() * canvas.height
      let velocityX = getRandomArbitrary(-1, 1)
      let color = `rgba(${colorRGB}, ${1 - size / 4})`
      particles.push(new Particle(x, y, velocityX, velocityX, size, color, ctx, canvas))
    }
  }

  function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((particle) => particle.update())
    connect()
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i]
        const p2 = particles[j]
        let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
        if (distance < lineDistance) {
          ctx.strokeStyle = `rgba(${colorRGB}, ${1 - distance / lineDistance})`
          ctx.beginPath()
          ctx.lineWidth = 0.8
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
  }

  function bindEvents() {
    canvas.addEventListener('mouseout', (e) => {
      interactionParticle.x = null
      interactionParticle.y = null
    })
    canvas.addEventListener('mouseover', (e) => {
      if (!interactionParticle) {
        interactionParticle = new Particle(e.x, e.y, 0, 0, 2, `rgba(${colorRGB}, 1)`, ctx, canvas)
        particles.push(interactionParticle)
      }
    })
    canvas.addEventListener('mousemove', (e) => {
      interactionParticle.x = e.x
      interactionParticle.y = e.y
    })
  }

  bindEvents()
  createParticles()
  animate()
}
onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
.starry_sky {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/sky-night.jpeg') no-repeat center center;
  background-size: cover;
  #canvas {
    position: relative;
    display: block;
    width: 100vw;
    height: 100vh;
  }
  //   opacity: 0.5;
}
</style>
