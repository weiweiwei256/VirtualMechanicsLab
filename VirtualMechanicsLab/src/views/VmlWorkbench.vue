<template>
  <div class="vml-workbench" style="height:100%:width:100%">
    <vml-header></vml-header>
    <div id='main-workbench'>
      <el-row style="height:100%">
        <el-col style="height:100%" :span="12">
          <scene-editor></scene-editor>
        </el-col>
        <el-col style="height:100%" :span="12">
          <scene-running></scene-running>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapActions } from 'vuex'
import VmlHeader from './vml-header/VmlHeader'
import SceneEditor from './scene-editor/SceneEditor.vue'
import SceneRunning from './SceneRunning.vue'
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
<style>
#main-workbench {
  position: absolute;
  top: 30px;
  bottom: 0px;
  width: 100%;
}
</style>
