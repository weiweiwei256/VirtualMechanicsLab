<template>
  <div id="scene-editor"
       style="height:100%">
    <div id='scene-running-toolbar'>
      <el-button type="primary"
                 title="保存"
                 @click='saveSceneData'
                 icon="el-icon-document"></el-button>
      <el-button type="primary"
                 title='删除'
                 @click='deleteBody'
                 icon="el-icon-delete"></el-button>
      <el-button type="primary"
                 title='撤销'
                 @click='undo'
                 icon="el-icon-d-arrow-left"></el-button>
      <el-button type="primary"
                 title='恢复'
                 @click='redo'
                 icon="el-icon-d-arrow-right"></el-button>
    </div>
    <el-row style="height:100%">
      <el-col style="height:100%"
              :span="4">
        <div id="gscene-editor-palette"></div>
        <div id='scene-editor-outline'></div>
        <div id="property"></div>
      </el-col>
      <el-col style="height:100%"
              :span="20">
        <div id="graph-container"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import sceneCodec from '@/store/scene-codec.js'
export default {
  name: "scene-editor",
  data: function () {
    return {
      vertices: [], //图源数组
      edges: [] //线数组
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
    initToolBar: function () {
      let tbContainer = document.getElementById("gscene-editor-palette");
      let toolbar = new mxToolbar(tbContainer);
      toolbar.enabled = false;
      let vertex = new mxCell({ label: 'rectangle' }, new mxGeometry(0, 0, 80, 80), "");
      vertex.type = 'rectangle'
      vertex.setVertex(true);
      let funct = (graph, evt, cell) => {
        graph.stopEditing(false);

        let pt = graph.getPointForEvent(evt);
        let vertexClone = graph.getModel().cloneCell(vertex);
        vertexClone.geometry.x = pt.x;
        vertexClone.geometry.y = pt.y;

        graph.setSelectionCells(graph.importCells([vertexClone], 0, 0, cell)); // 第二个第三个数字 是拖动创建结束时 相对鼠标的偏移位置
      };

      // Creates the image which is used as the drag icon (preview)
      let img = toolbar.addMode(
        null,
        "/static/mxgraph/src/images/rectangle.gif",
        funct
      );
      mxUtils.makeDraggable(img, this.editorGraph, funct);
    }
  },
  mounted () {
    this.initToolBar();
    this.editorGraph.init($("#graph-container")[0]) // 数据与渲染分离
    this.editorGraph.view.refresh();
  },
};
</script>

<style scoped>
#graph-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: default;
  background: url('/static/mxgraph/src/images/grid.gif');
}
</style>
