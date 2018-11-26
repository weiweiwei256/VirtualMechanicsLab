<template>
  <div id='running-watcher'>
    <span>view x:</span>
    <el-slider v-model="viewPort.max.x" :max='1920'></el-slider>
    <span>view y:</span>
    <el-slider v-model="viewPort.max.y" :max='1080'></el-slider>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Render, Engine, Runner, Common } from 'matter-js'
export default {
  data: function () {
    return {
      viewPort: {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      },
    }
  },
  computed: {
    ...mapGetters([
      'runningRender',
    ])
  },
  watch: {
    viewPort: {
      handler: function () {
        Render.lookAt(this.runningRender, this.viewPort);
      },
      deep: true
    }
  },
}
</script>

<style>
</style>
