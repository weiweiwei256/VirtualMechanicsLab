<template>
  <div id="scene-editor" style="height:100%">
    <div id='scene-running-toolbar'>
      <el-button type="primary" size="mini" title="保存" @click='saveSceneData' icon="el-icon-document"></el-button>
      <el-button type="primary" size="mini" title='删除' @click='deleteBody' icon="el-icon-delete"></el-button>
      <el-button type="primary" size="mini" title='撤销' @click='undo' icon="el-icon-d-arrow-left"></el-button>
      <el-button type="primary" size="mini" title='恢复' @click='redo' icon="el-icon-d-arrow-right"></el-button>
    </div>
    <el-row style="height:100%">
      <el-col style="height:100%" :span="4">
        <scene-palette></scene-palette>
        <scene-property></scene-property>
      </el-col>
      <el-col style="height:100%" :span="20">
        <div id="graph-container"></div>
      </el-col>
    </el-row>
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
    ...mapMutations({
      saveScene: types.SAVE_SCENE
    }),
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR
    }),
    saveSceneData: function () {
      this.saveScene({ fileName: this.fileName, sceneData: sceneCodec.encode(this.editorGraph.getModel()) })
    },
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
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: default;
  background: url('/static/imgs/grid.gif');
}
</style>
