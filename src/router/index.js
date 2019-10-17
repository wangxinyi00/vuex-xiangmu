import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '', // 默认子路由
          component: Home
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }

  ]
})
export default router
