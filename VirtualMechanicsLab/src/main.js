import Vue from 'vue';
import App from './App';
import router from './router';
import { store } from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/SceneGraph.js';
import '@/shapes';
/* eslint-disable no-unused-vars */
Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router: router,
  template: '<App/>',
  components: { App },
  strict: false
});
