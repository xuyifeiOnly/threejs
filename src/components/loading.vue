<template>
  <div class="loading_svg" v-if="showL">
    <div class="box">
      <div class="box-inner">
        <div class="inner" :style="{ bottom: `calc(-128% + ${number}%)` }" id="box">
          <!-- 添加svg波浪 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            viewBox="0 0 600 140"
            class="box-waves"
          >
            <path
              d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            viewBox="0 0 600 140"
            class="box-waves"
          >
            <path
              d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            viewBox="0 0 600 140"
            class="box-waves"
          >
            <path
              d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"
            ></path>
          </svg>
        </div>
      </div>
      <div id="percentText" class="box-text">{{ number }}%</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const props = defineProps({
  number: {
    type: String
  }
})
const showL = ref(true)
watch(
  () => props.number,
  (nv) => {
    if (Number(nv) >= 100) {
      showL.value = false
    }
  }
)
onMounted(() => {})
</script>
<style lang="scss">
.loading_svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;

  .box {
  }
  .box-inner {
    width: 200px;
    height: 200px;
    box-shadow: 0 2px 7px 0 #238fdb;
    border-radius: 50%;
    position: relative;
    border: 2px solid transparent;
    background: linear-gradient(#021f40, #021f40);
    background-origin: border-box;
    background-clip: content-box, border-box;
    /* 溢出隐藏 */
    overflow: hidden;
  }
  .inner {
    width: 100%;
    height: 100%;
    position: absolute;
    background: #a0edff;
    /* 添加底部距离 */
    // bottom: calc(-128% + var(--per));
  }
  .box-waves {
    position: absolute;
    left: 0;
    bottom: 100%;
    width: 200%;
    stroke: none;
  }
  .box-waves:nth-child(1) {
    fill: var(--wave1);
    transform: translate(-50%, 0);
    z-index: 3;
    /* svg重合有一条线条，将边距设置为负的 */
    margin-bottom: -2px;
    /* 添加动画 */
    animation: wave-move1 1.5s infinite linear;
  }
  .box-waves:nth-child(2) {
    fill: var(--wave2);
    // fill: red;
    transform: translate(0, 0);
    z-index: 2;
    animation: wave-move2 3s infinite linear;
  }
  .box-waves:nth-child(3) {
    fill: var(--wave3);
    // fill: red;
    transform: translate(-50%, 0);
    z-index: 1;
    /* 添加动画 */
    animation: wave-move1 3s infinite linear;
  }
  @keyframes wave-move1 {
    100% {
      transform: translate(0, 0);
    }
  }
  @keyframes wave-move2 {
    100% {
      transform: translate(-50%, 0);
    }
  }
  .box-text {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    color: #7eedff;
    text-align: center;
    margin: 30px auto;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    padding: 0;
    margin: 0;
  }
}
</style>
