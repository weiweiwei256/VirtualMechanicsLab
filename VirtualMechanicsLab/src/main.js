import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/SceneGraph.js'
import '@/common/SceneMatter.js'
import '@/common/hotkey.js'
import '@/shapes'
/* eslint-disable no-unused-vars */
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
import VueContextMenu from 'vue-contextmenu'
import 'vue-contextmenu/style/css/font-awesome.min.css'
Vue.use(VueContextMenu)
new Vue({
  el: '#app',
  store,
  router: router,
  template: '<App/>',
  components: { App },
  strict: false
})
