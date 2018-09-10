<template>
  <div id='scene-running' style="height:100%">
    <div id='scene-running-toolbar'>
      <el-tooltip effect="light" open-delay='500' hide-after='3000' content="开始" placement="top">
        <i class="iconfont icon-start" @click='sceneStart'></i>
      </el-tooltip>
      <el-tooltip effect="light" open-delay='500' hide-after='3000' content="暂停" placement="top">
        <i class="iconfont icon-zanting" @click='scenePause'></i>
      </el-tooltip>
      <el-tooltip effect="light" open-delay='500' hide-after='3000' content="刷新" placement="top">
        <i class="iconfont icon-restart" @click='sceneReset'></i>
      </el-tooltip>
    </div>
    <div id='scene-running-render'></div>
    <div id='operation'>
      <el-button @click='handleAdd'>add object</el-button>
      <span>view x:</span>
      <el-slider v-model="viewPort.max.x" :max='1920'></el-slider>
      <span>view y:</span>
      <el-slider v-model="viewPort.max.y" :max='1080'></el-slider>
    </div>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import '@/common/decomp.js'
import { Render, Engine, Runner, Common } from 'matter-js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'scene-running',
  data: function () {
    return {
      renderDom: undefined,
      runner: Runner.create(),
      viewPort: {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      }
    }
  },
  computed: {
    ...mapGetters([
      'runningRender',
      'engine',
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
    ...mapActions({
      initSceneRunning: types.INIT_SCENE_RUNNING
    }),
    sceneStart: function () {
      Runner.start(this.runner, this.engine);
    },
    scenePause: function () {
      Runner.stop(this.runner);
    },
    sceneReset: function () {
      // 回收全局常量
      Common._nextId = 0;
      Common._seed = 0;
      Render.stop(this.runningRender);
      Runner.stop(this.runner);
      this.runningRender.canvas.parentElement.removeChild(this.runningRender.canvas)
      this.initSceneRunning();
      this.renderScene();
    },
    renderScene: function () {
      // 设置matter尺寸。
      this.renderDom.appendChild(this.runningRender.canvas);
      Render.lookAt(this.runningRender, this.viewPort);
      // 在渲染之后调整大小
      this.runningRender.canvas.width = this.renderDom.clientWidth;
      this.runningRender.canvas.height = this.renderDom.clientHeight;
      Render.run(this.runningRender);
    },
    handleAdd: function () {
    }
  },
  mounted () {
    this.renderDom = $('#scene-running-render')[0]
    this.initSceneRunning();
    this.renderScene();
  },
}
</script>

<style>
</style>
