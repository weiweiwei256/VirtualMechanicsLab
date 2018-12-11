import Vue from 'vue'
import Vuex from 'vuex'
import * as types from '@/modules-constant.js'
import {
  Common,
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Events,
  MouseConstraint,
  Composite,
  Bounds,
  Vertices
} from 'matter-js'
import defaultScene from '@/common/scenes/default.scene'
import defaultProperty from '@/common/default/default-property.json'
import defaultSetting from './default-setting.json'
import sceneCodec from './scene-codec'

let storage = window.localStorage
let setting = Object.assign(
  {},
  defaultSetting,
  storage.getItem(types.SETTING) !== null ? JSON.parse(storage.getItem(types.SETTING)) : {}
)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: function() {
    return {
      // file data
      setting,
      sceneName: setting.activeSceneName,
      sceneDescription: defaultScene.description,
      sceneData: defaultScene,
      // editor data
      editorGraph: null,
      editorSelectionCell: null,
      // running data
      runningRender: null
    }
  },
  getters: {
    setting: state => {
      return state.setting
    },
    sceneName: state => {
      return state.sceneName
    },
    sceneDescription: state => {
      return state.sceneDescription
    },
    editorGraph: state => {
      return state.editorGraph
    },
    editorSelectionCell: state => {
      return state.editorSelectionCell
    },
    sceneData: state => {
      return state.sceneData
    },
    runningRender: state => {
      return state.runningRender
    },
    engine: state => {
      return state.runningRender.engine
    },
    world: state => {
      return state.runningRender.engine.world
    }
  },
  mutations: {
    [types.SET_RUNNING_RENDER]: (state, runningRender) => {
      state.runningRender = runningRender
    },
    [types.SET_EDITOR_GRAPH]: (state, graph) => {
      state.editorGraph = graph
    },
    [types.SET_EDITOR_SELECTION_CELL]: (state, cell) => {
      state.editorSelectionCell = cell
    },
    [types.SET_SCENE_DESCRIPTION]: (state, description) => {
      state.sceneDescription = description
    },
    [types.SET_SCENE]: (state, { sceneName = state.sceneName, sceneData }) => {
      state.sceneName = sceneName
      state.sceneDescription = sceneData.description
      state.sceneData = sceneData
    }
  },
  actions: {
    [types.RELOAD_SCENE_EDITOR]: context => {
      let graph = context.getters.editorGraph
      graph.getModel().setRoot(graph.getModel().createRoot()) //清空已有物体
      sceneCodec.decode(context.getters.sceneData, graph.model)
    },
    [types.INIT_SCENE_EDITOR]: context => {
      let graph = new mxGraph()
      graph.autoSizeCells = false
      context.commit(types.SET_EDITOR_GRAPH, graph)
      context.dispatch(types.RELOAD_SCENE_EDITOR)
      context.commit(types.SET_EDITOR_SELECTION_CELL, graph.model.root.children[0])
      // 双击编辑赋值
      graph.labelChanged = function(cell, newValue, trigger) {
        cell.value.general.label = newValue
        graph.cellLabelChanged(cell, cell.value, false) // 刷新显示
      }

      graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender, evt) => {
        let cell = graph.getSelectionCell()
        if (cell) {
          context.commit(types.SET_EDITOR_SELECTION_CELL, cell)
        } else {
          // 什么都没选中 则认为
          context.commit(types.SET_EDITOR_SELECTION_CELL, graph.model.root.children[0])
        }
      })

      // 监听graph事件 并将修改值同步到 cell.value
      graph.addListener(mxEvent.MOVE_CELLS, (graph, event) => {
        let {
          properties: {
            cells: [cell],
            dx,
            dy
          }
        } = event
        let geometry = cell.value.geometry
        geometry.x += dx
        geometry.y += dy
      })
      graph.addListener(mxEvent.CELLS_RESIZED, (graph, event) => {
        let {
          properties: {
            cells: [cell],
            bounds: [mxGeometry]
          }
        } = event
        let { x, y, width, height } = mxGeometry
        let type = cell.value.general.type
        let geometry = cell.value.geometry
        switch (type) {
          case types.RECTANGLE:
            geometry.x = x + width / 2
            geometry.y = y + height / 2
            geometry.width = width
            geometry.height = height
            break
          case types.CIRCLE:
            let radius = Math.min(mxGeometry.width, mxGeometry.height) / 2
            mxGeometry.width = radius * 2
            mxGeometry.height = radius * 2
            geometry.x += radius
            geometry.y += radius
            geometry.radius = radius
            break
        }
      })
      // 添加物体
      graph.addListener(mxEvent.CELLS_ADDED, (graph, event) => {
        context.dispatch(types.SAVE_SCENE)
      })
    },
    [types.INIT_SCENE_RUNNING]: context => {
      let engine = Engine.create()
      let runningRender = Render.create({
        engine: engine,
        options: {
          pixelRatio: 1,
          background: 'gray',
          wireframeBackground: 'blue',
          hasBounds: false,
          enabled: true,
          wireframes: false, //线框展示
          showSleeping: true,
          showDebug: false,
          showBroadphase: false,
          showBounds: false,
          showVelocity: false,
          showCollisions: false,
          showSeparations: false,
          showAxes: false,
          showPositions: false,
          showAngleIndicator: false,
          showIds: true,
          showShadows: false,
          showVertexNumbers: false,
          showConvexHulls: false,
          showInternalEdges: false,
          showMousePosition: false
        }
      })
      context.commit(types.SET_RUNNING_RENDER, runningRender)
      context.dispatch(types.RELOAD_SCENE_RUNNING)
    },
    [types.RELOAD_SCENE_RUNNING]: context => {
      Common._nextId = 0
      Common._seed = 0
      let world = context.getters.world
      let engine = context.getters.engine
      World.clear(world, false)
      let sceneData = context.getters.sceneData
      // 设置重力
      world.gravity = Object.assign({}, sceneData.gravity)
      let bodiesForce = new Map()
      for (let i = 0; i < sceneData.bodies.length; i++) {
        let body = undefined // 物体对象
        let { general, geometry, physics, condition, style } = sceneData.bodies[i]
        let type = general.type
        // 设置物理属性
        physics = Object.assign({ label: general.label }, defaultProperty.physics, physics)
        physics.inertia = Infinity
        switch (type) {
          case types.RECTANGLE:
            var { x, y, width, height } = geometry
            body = Bodies.rectangle(x, y, width, height, physics)
            break
          case types.CIRCLE:
            var { x, y, radius } = geometry
            body = Bodies.circle(x, y, radius, physics)
            break
          default:
            console.error('unknown body type' + type)
        }
        physics && physics.isStatic && Body.setStatic(body, physics)
        // 设置样式属性
        style = Object.assign({}, defaultProperty.style, style)
        body.render.fillStyle = style.fillColor
        body.render.fontColor = style.fontColor
        // body.render.
        // 设置条件属性
        body.condition && condition.velocity && Body.setVelocity(body, condition.velocity)
        condition && condition.force && bodiesForce.set(body, condition.force)
        World.addBody(world, body)
      }
      //选中事件绑定
      Events.on(engine, 'beforeUpdate', function(event) {
        bodiesForce.forEach((force, body) => {
          Body.applyForce(body, body.position, force)
        })
      })
    },

    [types.SAVE_SCENE]: (context, sceneName = context.getters.sceneName) => {
      let sceneData = sceneCodec.encode(context.getters.editorGraph.getModel())
      sceneData.description = context.getters.sceneDescription
      context.commit(types.SET_SCENE, { sceneName, sceneData })
      storage.setItem(sceneName, JSON.stringify(sceneData, null, 2))
    },
    [types.DELETE_SCENE]: (context, sceneName) => {
      storage.removeItem(sceneName)
    },
    [types.SAVE_SETTING]: context => {
      let setting = context.getters.setting
      setting.activeSceneName = context.getters.sceneName
      storage.setItem(types.SETTING, JSON.stringify(setting))
    }
  }
})
window.onbeforeunload = () => {
  // store.dispatch(types.SAVE_SETTING);
}
export default store
