import Vue from 'vue';
import Vuex from 'vuex';
import * as types from '@/modules-constant.js';
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
} from 'matter-js';
import defaultScene from '@/common/scenes/default.scene';
import defaultSetting from './default-setting.json';
import sceneCodec from './scene-codec';

let storage = window.localStorage;
let setting = Object.assign(
  {},
  defaultSetting,
  storage.getItem(types.SETTING) !== null ? JSON.parse(storage.getItem(types.SETTING)) : {}
);
Vue.use(Vuex);
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
    };
  },
  getters: {
    setting: state => {
      return state.setting;
    },
    sceneName: state => {
      return state.sceneName;
    },
    sceneDescription: state => {
      return state.sceneDescription;
    },
    editorGraph: state => {
      return state.editorGraph;
    },
    editorSelectionCell: state => {
      return state.editorSelectionCell;
    },
    sceneData: state => {
      return state.sceneData;
    },
    runningRender: state => {
      return state.runningRender;
    },
    engine: state => {
      return state.runningRender.engine;
    },
    world: state => {
      return state.runningRender.engine.world;
    }
  },
  mutations: {
    [types.SET_RUNNING_RENDER]: (state, runningRender) => {
      state.runningRender = runningRender;
    },
    [types.SET_EDITOR_GRAPH]: (state, graph) => {
      state.editorGraph = graph;
    },
    [types.SET_EDITOR_SELECTION_CELL]: (state, cell) => {
      state.editorSelectionCell = cell;
    },
    [types.SET_SCENE_DESCRIPTION]: (state, description) => {
      state.sceneDescription = description;
    },
    [types.SET_SCENE]: (state, { sceneName = state.sceneName, sceneData }) => {
      state.sceneName = sceneName;
      state.sceneDescription = sceneData.description;
      state.sceneData = sceneData;
    }
  },
  actions: {
    [types.RELOAD_SCENE_EDITOR]: context => {
      let graph = context.getters.editorGraph;
      graph.removeCells(graph.model.root.children[0].children); //清空已有物体
      sceneCodec.decode(context.getters.sceneData, graph.model);
      // 监听graph事件 并将修改值同步到 cell.value
      graph.addListener(mxEvent.MOVE_CELLS, (graph, event) => {
        let {
          properties: {
            cells: [cell],
            dx,
            dy
          }
        } = event;
        let geometry = cell.value.geometry;
        geometry.x += dx;
        geometry.y += dy;
      });
      graph.addListener(mxEvent.CELLS_RESIZED, (graph, event) => {
        let {
          properties: {
            cells: [cell],
            bounds: [mxGeometry]
          }
        } = event;
        let { x, y, width, height } = mxGeometry;
        let type = cell.value.general.type;
        let geometry = cell.value.geometry;
        switch (type) {
          case types.RECTANGLE:
            geometry.x = x + width / 2;
            geometry.y = y + height / 2;
            geometry.width = width;
            geometry.height = height;
            break;
          case types.CIRCLE:
            let radius = Math.min(mxGeometry.width, mxGeometry.height) / 2;
            mxGeometry.width = radius * 2;
            mxGeometry.height = radius * 2;
            geometry.x += radius;
            geometry.y += radius;
            geometry.radius = radius;
            break;
        }
      });
    },
    [types.INIT_SCENE_EDITOR]: context => {
      let graph = new mxGraph();
      context.commit(types.SET_EDITOR_GRAPH, graph);
      context.dispatch(types.RELOAD_SCENE_EDITOR);
      graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender, evt) => {
        let cell = graph.getSelectionCell();
        cell && context.commit(types.SET_EDITOR_SELECTION_CELL, cell);
      });
      // 从value中获取展示名
      graph.convertValueToString = function(cell) {
        return cell.value.label;
      };
      graph.valueForCellChanged = function(cell, newValue) {
        cell.value.label = newValue;
      };
    },
    [types.RELOAD_SCENE_RUNNING]: context => {
      Common._nextId = 0;
      Common._seed = 0;
      let world = context.getters.world;
      let engine = context.getters.engine;
      World.clear(world, false);
      let sceneData = context.getters.sceneData;
      let bodiesForce = new Map();
      for (let i = 0; i < sceneData.bodies.length; i++) {
        let { general, geometry, physics, condition, style } = sceneData.bodies[i];
        let type = general.type;
        let bodyObject = null;
        switch (type) {
          case types.RECTANGLE:
            var { x, y, width, height } = geometry;
            bodyObject = Bodies.rectangle(x, y, width, height, physics);
            break;
          case types.CIRCLE:
            var { x, y, radius } = geometry;
            bodyObject = Bodies.circle(x, y, radius, physics);
            break;
          default:
            console.error('unknown body type' + type);
        }
        if (bodyObject) {
          condition && condition.velocity && Body.setVelocity(bodyObject, condition.velocity);
          condition && condition.force && bodiesForce.set(bodyObject, condition.force);
          World.addBody(world, bodyObject);
        }
      }
      //选中事件绑定
      Events.on(engine, 'beforeUpdate', function(event) {
        bodiesForce.forEach((force, body) => {
          Body.applyForce(body, body.position, force);
        });
      });
    },
    [types.INIT_SCENE_RUNNING]: context => {
      let engine = Engine.create();
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
      });
      context.commit(types.SET_RUNNING_RENDER, runningRender);
      context.dispatch(types.RELOAD_SCENE_RUNNING);
    },

    [types.SAVE_SCENE]: (context, sceneName = context.getters.sceneName) => {
      let sceneData = sceneCodec.encode(context.getters.editorGraph.getModel());
      sceneData.description = context.getters.sceneDescription;
      context.commit(types.SET_SCENE, { sceneName, sceneData });
      storage.setItem(sceneName, JSON.stringify(sceneData, null, 2));
    },
    [types.DELETE_SCENE]: (context, sceneName) => {
      storage.removeItem(sceneName);
    },
    [types.SAVE_SETTING]: context => {
      let setting = context.getters.setting;
      setting.activeSceneName = context.getters.sceneName;
      storage.setItem(types.SETTING, JSON.stringify(setting));
    }
  }
});
window.onbeforeunload = () => {
  // store.dispatch(types.SAVE_SETTING);
};
export default store;
