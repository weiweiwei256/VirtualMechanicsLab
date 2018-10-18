<template>
  <div id="vml-workbench">
    <vml-header></vml-header>
    <div id='main-workbench'>
      <scene-editor class='flex-item'></scene-editor>
      <scene-running class='flex-item'></scene-running>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapActions } from 'vuex'
import VmlHeader from './vml-header/VmlHeader'
import SceneEditor from './scene-editor/SceneEditor.vue'
import SceneRunning from './scene-running/SceneRunning.vue'
export default {
  name: 'vml-workbench',
  data: function () {
    return {
    }
  },
  methods: {
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR,
      initSceneRunning: types.INIT_SCENE_RUNNING,
    }),
  },
  beforeMount: function () {
    this.initSceneEditor();
    this.initSceneRunning();
  },

  components: {
    VmlHeader,
    SceneEditor,
    SceneRunning,
  }
}
</script>
<style scoped>
#vml-workbench {
  position: relative;
  height: 100%;
  width: 100%;
}
#main-workbench {
  width: 100%;
  position: absolute;
  bottom: 0px;
  top: 30px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  /* 自左至右 */
  flex-direction: row;
  /* 不换行 */
  flex-wrap: nowrap;
  /* 对齐方式 */
  justify-content: space-around;
}
.flex-item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
</style>
