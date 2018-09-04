<template>
  <div id="scene-editor" style="height:100%">
    <div id='scene-running-toolbar'>
      <i class="iconfont icon-delete" title='删除' @click='deleteBody'></i>
      <i class="iconfont icon-chexiao" title='撤销' @click='undo'></i>
      <i class="iconfont icon-redo" title='恢复' @click='redo'></i>
    </div>
    <el-row style="height:70%">
      <el-col style="height:100%" :span="4">
        <scene-palette></scene-palette>
      </el-col>
      <el-col style="height:100%" :span="20">
        <div id="graph-container"></div>
      </el-col>
    </el-row>
    <scene-property></scene-property>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import sceneCodec from '@/store/scene-codec.js'
import ScenePalette from './ScenePalette.vue'
import SceneProperty from './SceneProperty.vue'
export default {
  name: "scene-editor",
  data: function () {
    return {
    };
  },
  computed: {
    ...mapGetters(['fileName', 'editorGraph', 'sceneData'])
  },
  methods: {
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR
    }),
    deleteBody: function () {
      console.log('delete')
    },
    undo: function () {
      console.log('undo')
    },
    redo: function () {
      console.log('redo')
    },
  },
  mounted () {
    this.editorGraph.init($("#graph-container")[0]) // 数据与渲染分离
    this.editorGraph.view.refresh();
  },
  components: {
    ScenePalette,
    SceneProperty
  }
};
</script>

<style scoped>
#graph-container {
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
  cursor: default;
  background: url('/static/imgs/grid.gif');
}

</style>
