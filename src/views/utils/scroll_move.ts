import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
export const createScens = (progress:any) => {
  const canvas = document.querySelector('canvas.webgl')
  const scrollMOveINstance = document.getElementsByClassName('scroll_move')
  const dowC = scrollMOveINstance[0]
  let donut: THREE.Group
  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  /**
   * Scroll
   */
  let scrollY = 0
  let currentSection = 0
  const transformDonut = [
    {
      rotationZ: 0.45,
      positionX: 1.5
    },
    {
      rotationZ: -0.45,
      positionX: -1.5
    },
    {
      rotationZ: 0.0314,
      positionX: 0
    },
    {
      rotationZ: 0.0314,
      positionX: 0
    }
  ]
  const scene = new THREE.Scene()
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
    donut = gltf.scene
    const radius = 8.5
    donut.position.x = 1.5
    donut.rotation.x = Math.PI * 0.2
    donut.rotation.z = Math.PI * 0.15
    donut.scale.set(radius, radius, radius)
    scene.add(donut)
  })

  // 添加阴影
  const textureLoader = new THREE.TextureLoader()
  const alphaShadow = textureLoader.load('./simpleShadow.jpg')
  const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0x000000,
      opacity: 0.5,
      alphaMap: alphaShadow
    })
  )

  sphereShadow.rotation.x = -Math.PI * 0.5
  sphereShadow.position.y = -1
  sphereShadow.position.x = 1.5
  scene.add(sphereShadow)

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

  dowC.addEventListener('scroll', () => {
    scrollY = dowC.scrollTop
    const newSection = Math.round(scrollY / sizes.height)

    if (newSection != currentSection) {
      currentSection = newSection
      if (donut) {
        gsap.to(donut.rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          z: transformDonut[currentSection].rotationZ
        })
        gsap.to(donut.position, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: transformDonut[currentSection].positionX
        })

        gsap.to(sphereShadow.position, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: transformDonut[currentSection].positionX - 0.2
        })
      }
    }
  })
  /**
   * 添加相机
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
  camera.position.z = 5
  scene.add(camera)

  /**
   * 渲染器
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  /**
   * Animate
   */
  const clock = new THREE.Clock()
  let lastElapsedTime = 0

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    if (donut) {
      donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1
      sphereShadow.material.opacity = (1 - Math.abs(donut.position.y)) * 0.3
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
}
