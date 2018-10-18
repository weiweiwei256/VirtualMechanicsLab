<template>
  <div id="scene-editor">
    <!-- <div id='scene-running-toolbar'>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="删除" placement="top">
        <i class="iconfont icon-delete" @click='deleteBody'></i>
      </el-tooltip>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="撤销" placement="top">
        <i class="iconfont icon-chexiao" @click='undo'></i>
      </el-tooltip>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="恢复" placement="top">
        <i class="iconfont icon-redo" @click='redo'></i>
      </el-tooltip>
    </div> -->
    <div id='editor-main' style="height:70%">
      <div id='editor-left' style="width:100px;height:100%;float:left;position:relative">
        <scene-palette></scene-palette>
        <scene-outline ref='outline'></scene-outline>
      </div>
      <div id='editor-content' style='width:calc(100% - 100px);height:100%;float:right'>
        <div id="graph-container"></div>
      </div>
    </div>
    <div id='editor-property' style="height:30%">
      <scene-property></scene-property>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import sceneCodec from '@/store/scene-codec.js'
import ScenePalette from './palette/ScenePalette.vue'
import SceneOutline from './outline/SceneOutline.vue'
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
    this.$refs.outline.outlineInit();
  },
  components: {
    ScenePalette,
    SceneProperty,
    SceneOutline
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
