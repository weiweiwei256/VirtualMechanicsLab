<template>
  <div id="scene-editor">
    <div id='editor-main' style="height:100%">
      <div id='editor-left' style="width:100px;height:100%;float:left;position:relative">
        <scene-palette></scene-palette>
        <scene-outline ref='outline'></scene-outline>
      </div>
      <div id='editor-content' style='width:calc(100% - 100px);height:100%;float:right'>
        <div id="graph-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import ScenePalette from './palette/ScenePalette.vue'
import SceneOutline from './outline/SceneOutline.vue'
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
    ...mapActions({
      initSceneEditor: types.INIT_SCENE_EDITOR,
    }),
  },
  beforeMount: function () {
    this.initSceneEditor();
  },
  mounted () {
    $("#graph-container")[0].style.cursor = 'pointer';
    this.editorGraph.init($("#graph-container")[0]) // 数据与渲染分离
    this.editorGraph.view.refresh();
    this.$refs.outline.outlineInit();
  },
  components: {
    ScenePalette,
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
