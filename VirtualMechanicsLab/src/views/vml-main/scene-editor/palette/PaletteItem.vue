<template>
  <div class='palette-item' ref='item'>
    <el-tooltip effect="light" :open-delay='500' :hide-after='3000' :content=" name" placement="right">
      <div style="text-align:center;">
        <i class='iconfont' style=" font-size: 60px;" :class="icon"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js';
import defaultRectangle from '@/common/default/default-rectangle.json'
import defaultCircle from '@/common/default/default-circle.json'
export default {
  name: 'palette-item',
  props: ['icon', 'type', 'name'],
  computed: {
    ...mapGetters(['editorGraph']),
  },
  methods: {
    ...mapActions({
      saveScene: types.SAVE_SCENE,
    }),
    addPaletteItem: function (graph, evt, cell) {
      graph.stopEditing(false);
      let { x, y } = graph.getPointForEvent(evt);
      let newCellData;
      switch (this.type) {
        case types.RECTANGLE:
          newCellData = utility.deepClone(defaultRectangle);
          break;
        case types.CIRCLE:
          newCellData = utility.deepClone(defaultCircle);
          break;
      }
      newCellData.geometry.x = x;
      newCellData.geometry.y = y;
      var newCell = utility.generateCellData(this.type, newCellData);
      graph.setSelectionCells(graph.importCells([newCell], 0, 0, cell));
      this.saveScene();
    }
  },
  mounted: function () {
    mxUtils.makeDraggable(this.$refs.item, this.editorGraph, this.addPaletteItem);
  },
}
</script>
