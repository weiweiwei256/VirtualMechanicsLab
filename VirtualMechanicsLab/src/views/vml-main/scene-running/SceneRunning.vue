<template>
  <div id='scene-running'>
    <div id='scene-running-toolbar' v-show='true'>
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
    <vue-context-menu :contextMenuData="contextMenuData" @sceneReset="sceneReset" @sceneStart="sceneStart" @scenePause="scenePause">
    </vue-context-menu>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import '@/common/decomp.js'
import { Render, Engine, Body, Events, Runner, Bounds } from 'matter-js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'scene-running',
  data: function () {
    return {
      renderDom: undefined,
      runner: Runner.create(),
      // 记录碰撞瞬间的数据
      collisionMap: new Map(),
      collisionPosition: {},
      collisionVelocity: {},
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
            fnHandler: 'sceneReset', // Binding events(绑定事件)
            icoName: 'fa fa-home fa-fw',
            btnName: '同步场景' // The name of the menu option (菜单名称)
          },
          {
            fnHandler: 'sceneStart',
            btnName: '开始场景'
          },
          {
            fnHandler: 'scenePause',
            btnName: '暂停场景'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'render',
      'engine',
      'renderScale'
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
  },
  mounted () {
    this.renderDom = $('#scene-running-render')[0]
    this.renderDom.style.cursor = 'pointer';
    this.initSceneRunning(this.renderDom);
    this.reloadSceneRunning();
    this.renderScene();
    // 由于matter引擎导致即使进行完全弹性碰撞
    Events.on(this.engine, 'collisionStart', event => {
      console.error('-------------------------collisionStart--------------------------------')
      // let contacts = event.pairs[0].activeContacts;
      // let collisionX = 0;
      // let collisionY = 0;
      // for (let j = 0; j < contacts.length; j++) {
      //   let { x, y } = contacts[j].vertex
      //   collisionX += x;
      //   collisionY += y;
      // }
      // this.collisionPosition = { x: collisionX / contacts.length, y: collisionY / contacts.length };
      // console.log(this.collisionPosition)
      console.log(event.pairs[0].bodyA.label)
      console.log(event.pairs[0].bodyB.label)
      let { x, y } = event.pairs[0].bodyA.velocity;
      this.collisionMap.set(event.pairs[0].bodyA.label, { x, y })
    })
    Events.on(this.engine, 'collisionEnd', event => {
      console.error('-------------------------collisionEnd--------------------------------')
      console.log(event.pairs[0].bodyA.label)
      console.log(event.pairs[0].bodyB.label)
      let { x, y } = this.collisionMap.get(event.pairs[0].bodyA.label)
      // Body.setVelocity(event.pairs[0].bodyA, { x: 0, y: y * -1 })
      this.collisionMap.delete(event.pairs[0].bodyA.label)
    })
    this.renderDom.addEventListener("mousedown", (event) => {
      this.dragFlag = true;
      this.originX = event.offsetX;
      this.originY = event.offsetY;
    }, true);
    this.renderDom.addEventListener("mousemove", (event) => {
      if (this.dragFlag) {
        let translate = {
          x: (this.originX - event.offsetX) * this.renderScale,
          y: (this.originY - event.offsetY) * this.renderScale
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
  position: absolute;
  top: 19px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
