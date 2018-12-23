<template>
  <div id='running-watcher'>
    <!-- <el-switch v-model="watchFlag" @change='handleWatch'>watch</el-switch> -->
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
    }
  },
  computed: {
    ...mapGetters([
      'render',
      'world'
    ])
  },
  watch: {
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
