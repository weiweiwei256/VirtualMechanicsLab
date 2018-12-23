<template>
  <div id="vml-workbench">
    <GlobalSetting></GlobalSetting>
    <vml-header id='top-workbench'></vml-header>
    <div id='main-workbench'>
      <scene-editor style='float:left;width:50%;height:100%'></scene-editor>
      <scene-running style='float:right;width:50%;height:100%'></scene-running>
    </div>
    <div id='bottom-workbench'>
      <EditorProperty style='float:left;width:50%'></EditorProperty>
      <RunningWatcher style='float:right;width:50%'></RunningWatcher>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import GlobalSetting from './vml-main/GlobalSetting'
import VmlHeader from './vml-header/VmlHeader'
import SceneEditor from './vml-main/scene-editor/SceneEditor.vue'
import SceneRunning from './vml-main/scene-running/SceneRunning.vue'
import EditorProperty from './vml-bottom/EditorProperty.vue'
import RunningWatcher from './vml-bottom/RunningWatcher'
export default {
  name: 'vml-workbench',
  data: function () {
    return {
    }
  },
  components: {
    GlobalSetting,
    VmlHeader,
    EditorProperty,
    SceneEditor,
    SceneRunning,
    RunningWatcher
  }
}
</script>
<style scoped>
#top-workbench {
  background-color: #3399cc;
  height: 30px;
  text-align: center;
}
#vml-workbench {
  position: relative;
  height: 100%;
  width: 100%;
}
#main-workbench {
  width: 100%;
  position: absolute;
  bottom: 240px;
  top: 30px;
}
#bottom-workbench {
  position: absolute;
  height: 240px;
  width: 100%;
  bottom: 0px;
}
</style>
