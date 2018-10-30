import Vue from 'vue';
import Vuex from 'vuex';
import * as types from '@/modules-constant.js';
import { Common, Engine, Render, World, Bodies, Events, MouseConstraint, Composite, Bounds, Vertices } from 'matter-js';
import sceneManager from '@/common/scene-manager.js';
import defaultSetting from './default-setting.json';
import sceneCodec from './scene-codec';

let storage = window.localStorage;
let setting = Object.assign(
  {},
  defaultSetting,
  storage.getItem(types.SETTING) !== null ? JSON.parse(storage.getItem(types.SETTING)) : {}
);
let sceneData = sceneManager.getScene(setting.activeSceneName);
Vue.use(Vuex);
const store = new Vuex.Store({
  state: function() {
    return {
      // file data
      setting,
      sceneName: setting.activeSceneName,
      sceneDescription: sceneData.description,
      sceneData,
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
    },
    [types.INIT_SCENE_EDITOR]: context => {
      let graph = new mxGraph();
      context.commit(types.SET_EDITOR_GRAPH, graph);
      context.dispatch(types.RELOAD_SCENE_EDITOR);
      graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender, evt) => {
        let cell = graph.getSelectionCell();
        context.commit(types.SET_EDITOR_SELECTION_CELL, cell);
        console.log('selectedCell', cell);
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
      for (let i = 0; i < sceneData.bodies.length; i++) {
        let { type, x, y, radius, width, height, direction, options } = sceneData.bodies[i];
        let bodyObject = null;
        switch (type) {
          case types.RECTANGLE:
            bodyObject = Bodies.rectangle(x, y, width, height, options);
            break;
          case types.CIRCLE:
            bodyObject = Bodies.circle(x, y, radius, options);
            break;
          case types.TRIANGLE:
            let vertices;
            switch (direction) {
              case 1:
                vertices = [{ x: 0, y: 0 }, { x: 0, y: height }, { x: width, y: height }];
                break;
              case 2:
                vertices = [{ x: width, y: 0 }, { x: 0, y: height }, { x: width, y: height }];
                break;
              case 3:
                vertices = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }];
                break;
              case 4:
                vertices = [{ x: 0, y: 0 }, { x: 0, y: height }, { x: width, y: 0 }];
                break;
            }
            let massCenter = Vertices.centre(vertices);
            bodyObject = Bodies.fromVertices(x + massCenter.x, y + massCenter.y, vertices, options);
            break;
          default:
            console.error('unknown body type' + type);
        }
        if (bodyObject) {
          World.addBody(world, bodyObject);
        }
      }
      //选中事件绑定
      Events.on(MouseConstraint.create(engine), 'mousedown', event => {
        let mousePosition = event.mouse.mousedownPosition;
        let bodies = Composite.allBodies(engine.world);
        for (let i = 0; i < bodies.length; i++) {
          let body = bodies[i];
          if (Bounds.contains(body.bounds, mousePosition) && Vertices.contains(body.vertices, mousePosition)) {
            console.log(body);
          }
        }
      });
    },
    [types.INIT_SCENE_RUNNING]: context => {
      // update scene data
      // context.commit(types.SET_SCENE, {
      //   sceneData: sceneCodec.encode(context.getters.editorGraph.getModel())
      // });
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
