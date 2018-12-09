<template>
  <div id='running-watcher'>
    <span>view x:</span>
    <el-slider v-model="viewPort.max.x" :max='1920'></el-slider>
    <span>view y:</span>
    <el-slider v-model="viewPort.max.y" :max='1080'></el-slider>
    <el-switch v-model="watchFlag" @change='handleWatch'>watch</el-switch>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Render, Engine, Runner, Common } from 'matter-js'
export default {
  data: function () {
    return {
      watchFlag: false,
      watcher: undefined,
      viewPort: {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      },
    }
  },
  computed: {
    ...mapGetters([
      'runningRender',
      'world'
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
  methods: {
    handleWatch: function () {
      if (this.watchFlag) {
        this.watcher = setInterval(() => {
          let body = this.world.bodies[0]
          console.log('id:' + body.id);
          console.log(' body.velocity:', body.velocity.x, body.velocity.y);
        }, 300);
      } else {
        clearInterval(this.watcher)
      }
    }
  },
}
</script>

<style>
</style>
