<template>
  <div class='palette-item' ref='item'>
    <el-tooltip effect="light" :open-delay='500' :hide-after='3000' :content="name" placement="right">
      <div>
        <i class='iconfont' style=" font-size: 60px;" :class="icon"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utility from '@/common/utility.js';
export default {
  name: 'palette-item',
  props: ['icon', 'type', 'name'],
  computed: {
    ...mapGetters(['editorGraph']),
    protoCell: function () {
      return utility.getMxCell(this.type)
    }
  },
  methods: {
    addPaletteItem: function (graph, evt, cell) {
      graph.stopEditing(false);
      var pt = graph.getPointForEvent(evt);
      var newCell = graph.getModel().cloneCell(this.protoCell);
      newCell.geometry.x = pt.x;
      newCell.geometry.y = pt.y;
      graph.setSelectionCells(graph.importCells([newCell], 0, 0, cell));
    }
  },
  mounted: function () {
    mxUtils.makeDraggable(this.$refs.item, this.editorGraph, this.addPaletteItem);
  },
}
</script>
