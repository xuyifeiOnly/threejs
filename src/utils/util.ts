import type { RouterProps } from '@/models/index'
export const routerList = (): Array<RouterProps> => {
  const modules = import.meta.glob('../views/*.vue')
  const reg = /([^/]+)\.vue$/
  const list: Array<RouterProps> = []
  Object.keys(modules).forEach((it) => {
    const temp = it.match(reg)
    if (temp) {
      const name = temp[1]
      list.push({
          name,
          path: `/${name}`,
          component: modules[it]
      })
    }
  })
  return list
}
