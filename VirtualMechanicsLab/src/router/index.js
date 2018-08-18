import Vue from 'vue'
import Router from 'vue-router'
import VmlWorkbench from '@/views/VmlWorkbench.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: VmlWorkbench
    }
  ]
})
