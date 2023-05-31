import { createRouter, createWebHistory } from 'vue-router'
import ConnectionView from '../views/ConnectionView.vue'
import AddConnectionView from '../views/AddConnectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AddConnectionView,
      props: { name: "new" }
    },
    {
      path: '/connections/:name',
      name: 'ConnectionView',
      component: ConnectionView,
      props: route => ({ name: route.params.name })
    }
  ]
})

export default router
