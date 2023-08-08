import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { GLBs } from './dict'
export const target = new THREE.Vector3(-0.5, 0.5, 0)

export const initialCameraPosition = new THREE.Vector3(
  5 * Math.sin(0.2 * Math.PI),
  2.5,
  5 * Math.cos(0.2 * Math.PI)
)
export function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4))
}
// 初始化场景
export const initScene = (): THREE.Scene => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#ccc')
  return scene
}
export const initCamera = (): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.copy(initialCameraPosition)
  camera.lookAt(target)

  return camera
}
export const initRender = (dom: HTMLElement): THREE.WebGLRenderer => {
  const render = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  render.setPixelRatio(window.devicePixelRatio)
  render.outputEncoding = THREE.sRGBEncoding
  render.setSize(window.innerWidth, window.innerHeight)
  render.setClearColor('#000')
  dom.appendChild(render.domElement)
  return render
}

export const initControls = (
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
): OrbitControls => {
  const controls = new OrbitControls(camera, renderer.domElement)
    // controls.autoRotate = true
  controls.target = target
  //   controls.update()
  return controls
}
export const addLight = (scene: THREE.Scene) => {
  const light1 = new THREE.DirectionalLight(0xffffff, 0.2)
  light1.position.set(0, 0, 10)
  scene.add(light1)
  const light2 = new THREE.DirectionalLight(0xffffff, 0.2)
  light2.position.set(0, 0, -10)
  scene.add(light2)
  const light3 = new THREE.DirectionalLight(0xffffff, 0.2)
  light3.position.set(10, 0, 0)
  scene.add(light3)
  const light4 = new THREE.DirectionalLight(0xffffff, 0.2)
  light4.position.set(-10, 0, 0)
  scene.add(light4)

  const light5 = new THREE.DirectionalLight(0xffffff, 0.2)
  light5.position.set(0, 10, 0)
  scene.add(light5)
  const light6 = new THREE.DirectionalLight(0xffffff, 0.2)
  light6.position.set(5, 10, 0)
  scene.add(light6)
  const light7 = new THREE.DirectionalLight(0xffffff, 0.2)
  light7.position.set(0, 10, 5)
  scene.add(light7)
  const light8 = new THREE.DirectionalLight(0xffffff, 0.2)
  light8.position.set(0, 10, -5)
  scene.add(light8)
  const light9 = new THREE.DirectionalLight(0xffffff, 0.2)
  light9.position.set(-5, 10, 0)
  scene.add(light9)
}
//=======================公共方法====================
// 添加网格地面
export const addGrid = (scene: THREE.Scene) => {
  const gridHelper = new THREE.GridHelper(10, 10)
  gridHelper.material['opacity'] = 0.2
  gridHelper.material['transparent'] = true
  scene.add(gridHelper)
}
// 添加坐标系
export const addAxes = (scene: THREE.Scene) => {
  const axesHel = new THREE.AxesHelper(5)
  scene.add(axesHel)
}

//=====================模型处理和添加================
export const addModel = async () => {}
