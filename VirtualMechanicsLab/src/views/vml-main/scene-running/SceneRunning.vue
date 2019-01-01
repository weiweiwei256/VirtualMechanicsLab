<template>
  <div id='scene-running'>
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
import { Render, Engine, Runner, Common, Bounds } from 'matter-js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'scene-running',
  data: function () {
    return {
      renderDom: undefined,
      runner: Runner.create(),
      scale: 1,
      dragFlag: false,
      originX: 0,
      originY: 0,
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
      'render',
      'engine',
    ])
  },
  methods: {
    ...mapActions({
      initSceneRunning: types.INIT_SCENE_RUNNING,
    }),
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
      Runner.stop(this.runner);
      this.reloadSceneRunning();
    },
    renderScene: function () {
      // 设置matter尺寸。
      this.renderDom.appendChild(this.render.canvas);
      Render.lookAt(this.render, {
        min: { x: 0, y: 0 },
        max: { x: this.renderDom.clientWidth, y: this.renderDom.clientHeight }
      });
      Render.run(this.render);
    },
    handleAdd: function () {
    }
  },
  mounted () {
    this.renderDom = $('#scene-running-render')[0]
    this.renderDom.style.cursor = 'pointer';
    this.initSceneRunning(this.renderDom);
    this.reloadSceneRunning();
    this.renderScene();
    this.renderDom.addEventListener("mousewheel", (event) => {
      let scaleFactor = event.wheelDelta * 0.002;
      this.scale += scaleFactor;
      this.render.bounds.max.x = this.render.bounds.min.x + this.render.options.width * this.scale;
      this.render.bounds.max.y = this.render.bounds.min.y + this.render.options.height * this.scale;
    }, true);
    this.renderDom.addEventListener("mousedown", (event) => {
      this.dragFlag = true;
      this.originX = event.offsetX;
      this.originY = event.offsetY;
    }, true);
    this.renderDom.addEventListener("mousemove", (event) => {
      if (this.dragFlag) {
        let translate = {
          x: (this.originX - event.offsetX) * this.scale,
          y: (this.originY - event.offsetY) * this.scale
        }
        Bounds.translate(this.render.bounds, translate);
        this.originX = event.offsetX;
        this.originY = event.offsetY;
      }
    }, true);
    this.renderDom.addEventListener("mouseup", (event) => {
      this.dragFlag = false;
    }, true);
  },
}
</script>

<style>
#scene-running-render {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
