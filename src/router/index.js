import Vue from 'vue'
import Router from 'vue-router'
import desktop from '@/components/desktop'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'desktop',
      component: desktop
    }
  ]
})
