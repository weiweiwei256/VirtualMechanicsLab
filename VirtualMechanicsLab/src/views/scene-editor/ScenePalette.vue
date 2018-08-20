<template>
  <div id="scene-editor-palette"></div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'scene-palette',
  computed: {
    ...mapGetters(['editorGraph'])
  },
  mounted: function () {
    let toolbar = new window.mxToolbar($('#scene-editor-palette')[0]);
    toolbar.enabled = false;
    let mxCell = new window.mxCell({ label: 'rectangle' }, new mxGeometry(0, 0, 80, 80), "round=1");
    mxCell.type = 'rectangle'
    mxCell.setVertex(true);
    let funct = (graph, evt, cell) => {
      graph.stopEditing(false);
      let pt = graph.getPointForEvent(evt);
      let vertexClone = graph.getModel().cloneCell(mxCell);
      vertexClone.geometry.x = pt.x;
      vertexClone.geometry.y = pt.y;
      graph.setSelectionCells(graph.importCells([vertexClone], 0, 0, cell)); // 第二个第三个数字 是拖动创建结束时 相对鼠标的偏移位置
    };

    // Creates the image which is used as the drag icon (preview)
    let img = toolbar.addMode(
      "rectangle",
      "./static/imgs/rectangle.gif",
      funct
    );
    mxUtils.makeDraggable(img, this.editorGraph, funct);
  }
}
</script>

<style>
</style>
