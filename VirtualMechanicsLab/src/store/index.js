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
  Mouse,
  MouseConstraint,
  Composite,
  Bounds,
  Vertices
} from 'matter-js'
import defaultScene from '@/common/scenes/default.scene'
import defaultProperty from '@/common/default/default-property.json'
import defaultSetting from './default-setting.json'
import sceneCodec from '@/common/scene-codec'
import BodyToolHandler from '@/common/BodyToolHandler'
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
      showSetting: false, // global setting dialog show flag
      sceneName: setting.activeSceneName,
      sceneDescription: defaultScene.description,
      sceneData: defaultScene,
      // editor data
      editorGraph: null,
      selectionCell: null,
      // running data
      render: null,
      renderScale: 1
    }
  },
  getters: {
    setting: state => {
      return state.setting
    },
    showSetting: state => {
      return state.showSetting
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
    selectionCell: state => {
      return state.selectionCell
    },
    sceneData: state => {
      return state.sceneData
    },
    render: state => {
      return state.render
    },
    engine: state => {
      return state.render.engine
    },
    world: state => {
      return state.render.engine.world
    },
    renderScale: state => {
      return state.renderScale
    }
  },
  mutations: {
    [types.SET_SHOW_SETTING]: (state, flag) => {
      state.showSetting = flag
    },
    [types.SET_RENDER]: (state, render) => {
      state.render = render
    },
    [types.SET_RENDER_SCALE]: (state, renderScale) => {
      state.renderScale = renderScale
    },
    [types.SET_EDITOR_GRAPH]: (state, graph) => {
      state.editorGraph = graph
    },
    [types.SET_EDITOR_SELECTION_CELL]: (state, cell) => {
      state.selectionCell = cell
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
      // 拖动
      graph.panningHandler.useLeftButtonForPanning = true
      graph.setPanning(true)
      graph.setTooltips(true)
      graph.getTooltip = function(state) {
        return state.cell.value.general.des
      }
      graph.createHandler = function(state) {
        if (state != null && this.model.isVertex(state.cell)) {
          return new BodyToolHandler(state)
        }
        return mxGraph.prototype.createHandler.apply(this, arguments)
      }
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
          console.log(cell)
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
            let oldRadius = geometry.radius
            let radius = Math.min(mxGeometry.width, mxGeometry.height) / 2
            let dradius = radius - oldRadius
            mxGeometry.width = radius * 2
            mxGeometry.height = radius * 2
            geometry.x += dradius
            geometry.y += dradius
            geometry.radius = radius
            break
        }
      })
      // 添加物体同步数据
      graph.addListener(mxEvent.CELLS_ADDED, (graph, event) => {
        context.dispatch(types.SAVE_SCENE)
      })
      // 删除物体同步数据
      graph.addListener(mxEvent.CELLS_REMOVED, (graph, event) => {
        context.dispatch(types.SAVE_SCENE)
      })

      graph.popupMenuHandler.autoExpand = true

      // 右键菜单设置
      graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        if (cell != null) {
          menu.addItem('delete', null, function() {
            graph.removeCells([cell])
          })
        } else {
          // menu.addItem('设置', null, function() {
          // context.commit(types.SET_SHOW_SETTING, true)
          // })
        }
      }
    },
    [types.INIT_SCENE_RUNNING]: (context, renderDom) => {
      let engine = Engine.create()
      let render = Render.create({
        engine: engine,
        canvas: null,
        options: {
          width: renderDom.clientWidth,
          height: renderDom.clientHeight,
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
      context.commit(types.SET_RENDER, render)
      context.dispatch(types.RELOAD_SCENE_RUNNING)
    },
    [types.RELOAD_SCENE_RUNNING]: context => {
      Common._nextId = 0
      Common._seed = 0
      let render = context.getters.render
      let world = context.getters.world
      let engine = context.getters.engine
      World.clear(world, false)
      // 1.0 初始化matter信息
      let sceneData = context.getters.sceneData
      // 1.1 设置环境参数:重力
      world.gravity = Object.assign({}, sceneData.global.gravity)
      // 1.2 设置物体信息
      let bodiesForce = new Map()
      for (let i = 0; i < sceneData.bodies.length; i++) {
        let body = undefined // 物体对象
        let { general, geometry, physics, condition, style } = sceneData.bodies[i]
        let type = general.type
        // 1.2.1 设置物理属性
        physics = Object.assign({ label: general.label }, defaultProperty.physics, physics)
        // 1.2.2 设置所有物体是否可旋转
        if (!sceneData.global.allowRotate) {
          physics.inertia = Infinity
        }
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
        if (physics && physics.isStatic) {
          Body.setStatic(body, true)
          body.restitution = physics.restitution
        }
        // 1.2.3 设置样式属性
        style = Object.assign({}, defaultProperty.style, style)
        body.render.fillStyle = style.fillColor
        body.render.fontColor = style.fontColor

        // 1.2.4 设置条件属性
        condition && condition.velocity && Body.setVelocity(body, condition.velocity)
        condition && condition.force && bodiesForce.set(body, condition.force)
        World.addBody(world, body)
      }

      // 1.2.5 循环设置每个物体的恒力
      Events.on(engine, 'beforeUpdate', function(event) {
        bodiesForce.forEach((force, body) => {
          Body.applyForce(body, body.position, force)
        })
      })
      // 2.0 matter视野变换
      let mouse = Mouse.create(render.canvas)
      let mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      })
      Events.on(mouseConstraint, 'mousedown', function(event) {
        var mousePosition = event.mouse.position
        console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y)
      })
      Events.on(mouseConstraint, 'mousewheel', function(event) {
        console.log(event.mouse)
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
    },
    [types.HANDLE_HOTKEY]: (context, hotKey) => {
      let editorGraph = context.getters.editorGraph
      let renderScale = context.getters.renderScale
      let render = context.getters.render

      switch (hotKey.toString()) {
        case ['Ctrl', 'wheel', 'up'].toString():
          editorGraph.zoomIn()
          break
        case ['Ctrl', 'wheel', 'down'].toString():
          editorGraph.zoomOut()
          break
        case ['Alt', 'wheel', 'up'].toString():
          renderScale /= 1.2
          context.commit(types.SET_RENDER_SCALE, renderScale)
          render.bounds.max.x = render.bounds.min.x + render.options.width * renderScale
          render.bounds.max.y = render.bounds.min.y + render.options.height * renderScale
          break
        case ['Alt', 'wheel', 'down'].toString():
          renderScale *= 1.2
          context.commit(types.SET_RENDER_SCALE, renderScale)
          render.bounds.max.x = render.bounds.min.x + render.options.width * renderScale
          render.bounds.max.y = render.bounds.min.y + render.options.height * renderScale
          break
        case ['Shift', 'wheel', 'up'].toString():
          editorGraph.zoomIn()
          renderScale /= 1.2
          context.commit(types.SET_RENDER_SCALE, renderScale)
          render.bounds.max.x = render.bounds.min.x + render.options.width * renderScale
          render.bounds.max.y = render.bounds.min.y + render.options.height * renderScale
          break
        case ['Shift', 'wheel', 'down'].toString():
          editorGraph.zoomOut()
          renderScale *= 1.2
          context.commit(types.SET_RENDER_SCALE, renderScale)
          render.bounds.max.x = render.bounds.min.x + render.options.width * renderScale
          render.bounds.max.y = render.bounds.min.y + render.options.height * renderScale
          break
        case ['Ctrl', 'x'].toString():
          mxClipboard.cut(editorGraph)
          break
        case ['Ctrl', 'c'].toString():
          mxClipboard.copy(editorGraph)
          break
        case ['Ctrl', 'v'].toString():
          mxClipboard.paste(editorGraph)
          break
        default:
          console.warn('unknwn hotkey:' + hotKey.toString())
      }
    }
  }
})
window.onbeforeunload = () => {
  // store.dispatch(types.SAVE_SETTING);
}
export default store
