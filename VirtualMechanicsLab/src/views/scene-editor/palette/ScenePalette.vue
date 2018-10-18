<template>
  <div id="scene-editor-palette">
    <div id='object-palette'>
      <p style='text-align:center'>物体列表</p>
      <palette-item icon='icon-rectangle' :type='types.RECTANGLE' name='矩形'></palette-item>
      <palette-item icon='icon-circle' :type='types.CIRCLE' name='圆形'></palette-item>
      <palette-item icon='icon-left-bottom-triangle' :type='types.TRIANGLE' name='直角三角形'></palette-item>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import paletteItem from './paletteItem.vue'
export default {
  name: 'scene-palette',
  data: function () {
    return {
      types: types
    }
  },
  components: {
    paletteItem
  }
}
</script>

<style scoped>
.object-container {
  display: flex;
  flex-direction: column;
}
.iconfont {
  font-size: 40px;
}
</style>
