/// <reference types="vite/client" />

declare module 'three/addons/loaders/GLTFLoader' {
  // 在这里添加你需要的类型定义
  export * from 'three/examples/jsm/loaders/GLTFLoader'
}

declare module 'three/addons/controls/OrbitControls' {
  // 在这里添加你需要的类型定义
  export * from 'three/examples/jsm/controls/OrbitControls'
}

declare module 'three/addons/loaders/DRACOLoader' {
  // 在这里添加你需要的类型定义
  export * from 'three/examples/jsm/loaders/DRACOLoader'
}


// declare module 'three/examples/jsm/libs/tween.module.min.js' {
//   // 在这里添加你需要的类型定义
//   export * from 'three/examples/jsm/libs/tween.module.min.js'
// }