import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'
import { addMaterialAndAction } from './MaterialAndAction'
export function loadGLTFModel(
  scene,
  glb,
  refRenderer,
  options = { receiveShadow: true, castShadow: true }
) {
  const name = glb.name

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    const DRACOloader = new DRACOLoader()

    DRACOloader.setDecoderPath('./draco/')
    loader.setDRACOLoader(DRACOloader)
    loader.load(
      glb.path,
      (gltf) => {
        const { outer, obj } = addMaterialAndAction(gltf, name, refRenderer, options)
        outer ? scene.add(outer) : scene.add(obj)
        resolve(obj)
      },
      function (event:ProgressEvent){
        // console.log(event);
      },
      function (error) {
        reject(error)
      }
    )
  })
}
