import { createRouter, createWebHashHistory } from 'vue-router'
import { routerList } from '@/utils/index'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    ...routerList(),
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

export default router
