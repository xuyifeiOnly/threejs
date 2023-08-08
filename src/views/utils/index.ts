import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'

const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}
export const createScene = (canvas: HTMLCanvasElement) => {
  const raycaster = new THREE.Raycaster() // 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
  const scene = new THREE.Scene() // 创建一个场景
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000) // 创建一个相机
  camera.position.z = 50
  //场景配置
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  // 相机控制器
  const controls = new OrbitControls(camera, renderer.domElement)

  // 创建一个线性几何体，并添加到场景
  const planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )
  const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true
  })
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  scene.add(planeMesh)
  // 创建星空场景
  const starGeometry = new THREE.BufferGeometry()
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
  })

  const starVerticies = []
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = (Math.random() - 0.5) * 2000
    starVerticies.push(x, y, z)
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVerticies, 3))

  const stars = new THREE.Points(starGeometry, starMaterial)
  // 添加星空场景
  scene.add(stars)

  function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(
      world.plane.width,
      world.plane.height,
      world.plane.widthSegments,
      world.plane.heightSegments
    )

    // vertice position randomization
    // console.log(planeMesh.geometry.attributes.position);
    const { array } = planeMesh.geometry.attributes.position as any
    const randomValues = []
    for (let i = 0; i < array.length; i++) {
      if (i % 3 === 0) {
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]
        array[i] = x + (Math.random() - 0.5) * 3
        array[i + 1] = y + (Math.random() - 0.5) * 3
        array[i + 2] = z + (Math.random() - 0.5) * 3
      }
      randomValues.push(Math.random() * Math.PI * 2)
    }

    ;(planeMesh.geometry.attributes.position as any).randomValues = randomValues
    ;(planeMesh.geometry.attributes.position as any).originalPosition = (
      planeMesh.geometry.attributes.position as any
    ).array
    // console.log(planeMesh.geometry)
    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
      colors.push(0, 0.19, 0.4)
    }

    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
  }
  generatePlane()
  // 添加灯光
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, -1, 1)
  scene.add(light)

  const backLight = new THREE.DirectionalLight(0xffffff, 1)
  backLight.position.set(0, 0, -1)
  scene.add(backLight)
  const mouse = {
    x: 1,
    y: 1
  }
  let frame = 0
  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    raycaster.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), camera)

    // 改变位置
    frame += 0.01
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position as any
    for (let i = 0; i < array.length; i += 3) {
      // x
      array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01

      // y
      array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001
    }

    planeMesh.geometry.attributes.position.needsUpdate = true
    // 计算物体和射线的焦点 改变颜色
    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {
      const { color } = (intersects[0].object as any).geometry.attributes

      // vertice 1
      color.setX(intersects[0].face.a, 0.1)
      color.setY(intersects[0].face.a, 0.5)
      color.setZ(intersects[0].face.a, 1)

      // vertice 2
      color.setX(intersects[0].face.b, 0.1)
      color.setY(intersects[0].face.b, 0.5)
      color.setZ(intersects[0].face.b, 1)

      // vertice 3
      color.setX(intersects[0].face.c, 0.1)
      color.setY(intersects[0].face.c, 0.5)
      color.setZ(intersects[0].face.c, 1)
      ;(intersects[0].object as any).geometry.attributes.color.needsUpdate = true

      const initialColor = {
        r: 0,
        g: 0.19,
        b: 0.4
      }

      const hoverColor = {
        r: 0.1,
        g: 0.5,
        b: 1
      }

      gsap.to(hoverColor, {
        r: initialColor.r,
        g: initialColor.g,
        b: initialColor.b,
        duration: 1,
        onUpdate: () => {
          // vertice 1
          color.setX(intersects[0].face.a, hoverColor.r)
          color.setY(intersects[0].face.a, hoverColor.g)
          color.setZ(intersects[0].face.a, hoverColor.b)

          // vertice 2
          color.setX(intersects[0].face.b, hoverColor.r)
          color.setY(intersects[0].face.b, hoverColor.g)
          color.setZ(intersects[0].face.b, hoverColor.b)

          // vertice 3
          color.setX(intersects[0].face.c, hoverColor.r)
          color.setY(intersects[0].face.c, hoverColor.g)
          color.setZ(intersects[0].face.c, hoverColor.b)
          color.needsUpdate = true
        }
      })
    }
  }
  animate()
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
  })

  return {
    camera
  }
}
