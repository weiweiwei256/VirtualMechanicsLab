<template>
  <div id='scene-running' style="height:100%">
    <div id='scene-running-toolbar'>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="开始" placement="top">
        <i class="iconfont icon-start" @click='sceneStart'></i>
      </el-tooltip>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="暂停" placement="top">
        <i class="iconfont icon-zanting" @click='scenePause'></i>
      </el-tooltip>
      <el-tooltip effect="light" :open-delay='500' :hide-after='3000' content="刷新" placement="top">
        <i class="iconfont icon-restart" @click='sceneReset'></i>
      </el-tooltip>
    </div>
    <div id='scene-running-render' @contextmenu="showMenu"></div>
    <vue-context-menu :contextMenuData="contextMenuData" @savedata="savedata" @newdata="newdata">
    </vue-context-menu>
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
      },
      // contextmenu data (菜单数据)
      contextMenuData: {
        // the contextmenu name(@1.4.1 updated)
        menuName: 'demo',
        // The coordinates of the display(菜单显示的位置)
        axis: {
          x: null,
          y: null
        },
        // Menu options (菜单选项)
        menulists: [
          {
            fnHandler: 'savedata', // Binding events(绑定事件)
            icoName: 'fa fa-home fa-fw', // icon (icon图标 )
            btnName: 'Save' // The name of the menu option (菜单名称)
          },
          {
            fnHandler: 'newdata',
            icoName: 'fa fa-home fa-fw',
            btnName: 'New'
          }
        ]
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
    showMenu () {
      event.preventDefault()
      var x = event.clientX
      var y = event.clientY
      // Get the current location
      this.contextMenuData.axis = {
        x, y
      }
    },
    savedata () {
      alert(1)
    },
    newdata () {
      console.log('newdata!')
    },
    ...mapActions({
      reloadSceneRunning: types.RELOAD_SCENE_RUNNING
    }),
    sceneStart: function () {
      Runner.start(this.runner, this.engine);
    },
    scenePause: function () {
      Runner.stop(this.runner);
    },
    sceneReset: function () {
      this.reloadSceneRunning();
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
    this.reloadSceneRunning();
    this.renderScene();
  },
}
</script>

<style>
</style>
