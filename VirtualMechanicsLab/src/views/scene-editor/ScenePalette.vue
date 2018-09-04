<template>
  <div id="scene-editor-palette"></div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'scene-palette',
  data: function () {
    return {
      toolbar: null,
    }
  },
  computed: {
    ...mapGetters(['editorGraph'])
  },
  methods: {
    addVertex: function (icon, w, h, style) {
      var vertex = new mxCell({ label: types.RECTANGLE, vertices: [{ "x": 0, "y": 0 }, { "x": 25, "y": 50 }, { "x": 50, "y": 0 }] }, new mxGeometry(0, 0, w, h), style);
      vertex.setVertex(true);
      this.addToolbarItem(vertex, icon);
    },
    addToolbarItem: function (prototype, image) {
      var funct = function (graph, evt, cell) {
        graph.stopEditing(false);

        var pt = graph.getPointForEvent(evt);
        var vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;

        graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));  // 第二个第三个数字 是拖动创建结束时 相对鼠标的偏移位置
      }

      var img = this.toolbar.addMode(null, image, funct);
      mxUtils.makeDraggable(img, this.editorGraph, funct);
    }
  },

  mounted: function () {
    this.toolbar = new window.mxToolbar($('#scene-editor-palette')[0]);
    this.addVertex('/static/imgs/rectangle.gif', 100, 40, '');
    this.addVertex('/static/imgs/rounded.gif', 100, 40, 'shape=rounded');
    this.addVertex('/static/imgs/triangle.gif', 40, 40, 'shape=triangle');
  }
}
</script>

<style>
</style>
