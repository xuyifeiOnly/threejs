<template>
  <div class="scroll_move">
    <canvas class="webgl"></canvas>
    <section class="one">
      <div class="container">
        <div class="hero">
          <h2>Abs are Cool.</h2>
          <h3>But have you ever tried donuts?</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque aliquid culpa,
            <br />
            providentvoluptatem excepturi id in quasi ea hic voluptate dicta amet explicabo <br />
            expedita ratione velit modi. Nisiquaerat illum amet quisquam iusto perferendis <br />
            ducimus aspernatur quia, repellendus beatae fugiat!
          </p>
        </div>
      </div>
    </section>

    <section class="two">
      <div class="container">
        <div class="hero">
          <h2>How we do</h2>
          <h3>Experiment width tasty <br />donuts recipe everytime</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque aliquid culpa,
            <br />
            providentvoluptatem excepturi id in quasi ea hic voluptate dicta amet explicabo <br />
            expedita ratione velit modi. Nisiquaerat illum amet quisquam iusto perferendis <br />
            ducimus aspernatur quia, repellendus beatae fugiat!
          </p>
        </div>
      </div>
    </section>

    <section class="three">
      <h1>HAPPY DONUT.</h1>
    </section>
       <Loading :number="progress"></Loading>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createScens } from './utils/scroll_move'
const progress = ref('')
onMounted(() => {
  createScens(progress)
})
</script>
<style lang="scss" scoped>
.scroll_move {
  scroll-snap-type: y mandatory;
  background: #ffc0cb;
  position: relative;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  body.loaded {
    overflow: auto;
  }

  .webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
  }

  section {
    height: 100vh;
    width: 100vw;
    scroll-snap-align: start;
    position: relative;
  }

  section .container {
    max-width: 1360px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0 15px;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    justify-content: flex-start;
  }

  section.one .container {
    grid-template-areas: 'content ..';
  }

  section.two .container {
    grid-template-areas: '.. content';
  }

  .hero {
    width: 100%;
    height: 100%;
    margin-bottom: 50px;

    grid-area: content;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
  }

  h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 90px;
    line-height: 100px;
    font-weight: 700;
    height: 100px;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    font-size: 60px;
    font-weight: 600;
    line-height: 70px;
    font-family: inherit;
    display: block;
    width: 100%;
  }

  h3 {
    font-size: 50px;
    font-weight: 400;
    line-height: 60px;
    margin-bottom: 30px;
    display: block;
    width: 100%;
  }

  p {
    font-size: 16px;
    line-height: 26px;
    font-weight: 300;
    display: block;
    width: 100%;
  }
}
</style>
