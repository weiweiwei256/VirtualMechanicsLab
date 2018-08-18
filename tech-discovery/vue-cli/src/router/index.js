import Vue from 'vue'
import Router from 'vue-router'
import Matter from '@/matter/Matter.vue'
import FlowEditor from '@/floweditor/FlowEditor.vue'
import XMLFlow from '@/xml-flow/XMLFlow.vue'
import JsonFlow from '@/json-flow/JsonFlow.vue'
import UploadDownload from '@/upload-download/UploadDownload.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Matter',
      component: Matter
    },
    {
      path: '/FlowEditor',
      component: FlowEditor
    },
    {
      path: '/XMLFlow',
      component: XMLFlow
    },
    {
      path: '/jsonflow',
      component: JsonFlow
    },
    {
      path: '/UploadDownload',
      component: UploadDownload
    }
  ]
})
