<template>
  <div id="scene-editor" style="">
    <div id='scene-running-toolbar'>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="删除" placement="top">
        <i class="iconfont icon-delete" @click='deleteBody'></i>
      </el-tooltip>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="撤销" placement="top">
        <i class="iconfont icon-chexiao" @click='undo'></i>
      </el-tooltip>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="恢复" placement="top">
        <i class="iconfont icon-redo" @click='redo'></i>
      </el-tooltip>
    </div>
    <el-row style="height:70%">
      <el-col style="height:100%" :span="4">
        <scene-palette></scene-palette>
        <p>缩略图</p>
        <div id='outline'></div>
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
    ...mapGetters(['sceneName', 'editorGraph', 'sceneData'])
  },
  methods: {
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
    new mxOutline(this.editorGraph, $('#outline')[0]);
  },
  components: {
    ScenePalette,
    SceneProperty
  }
};
</script>

<style scoped>
#scene-editor {
  overflow: hidden;
  height: 100%;
}
#graph-container {
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
  cursor: default;
  background: url('/static/imgs/grid.gif');
}
</style>
