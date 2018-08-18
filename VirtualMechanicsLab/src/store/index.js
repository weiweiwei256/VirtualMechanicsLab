import Vue from 'vue';
import Vuex from 'vuex';
import * as types from '@/modules-constant.js';
import { Engine, Render, World, Bodies, Events, MouseConstraint, Composite, Bounds, Vertices } from 'matter-js';
import defaultScene from '@/store/default.scene';
import matterDeCodec from './matter-decodec';
import sceneCodec from './scene-codec';
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: function() {
    return {
      // file data
      fileName: 'default.scene',
      sceneData: defaultScene,
      // editor data
      editorGraph: null,
      editorSelectionCell: null,
      // running data
      runningRender: null
    };
  },
  getters: {
    fileName: state => {
      return state.fileName;
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
    [types.SAVE_SCENE]: (state, { fileName, sceneData }) => {
      state.fileName = fileName;
      state.sceneData = sceneData;
    }
  },
  actions: {
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
      let sceneData = context.getters.sceneData;
      for (let i = 0; i < sceneData.bodies.length; i++) {
        let bodyData = sceneData.bodies[i];
        let bodyObject = null;
        switch (bodyData.type) {
          case 'rectangle':
            bodyObject = Bodies.rectangle(bodyData.x, bodyData.y, bodyData.width, bodyData.height, bodyData.options);
            break;
          default:
            console.error('unknown body type' + bodyData.type);
        }
        if (bodyObject) {
          World.addBody(engine.world, bodyObject);
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
      // console.log('world', engine.world);
      // console.log('World', World);
      // console.log('runningRender', runningRender);
      // console.log('Render', Render);
      // console.log('engine', engine);
      // console.log('Engine', Engine);
    },
    [types.INIT_SCENE_EDITOR]: context => {
      let graph = new mxGraph();
      context.commit(types.SET_EDITOR_GRAPH, graph);
      sceneCodec.decode(context.getters.sceneData, graph.getModel());
      graph.getSelectionModel().addListener(mxEvent.CHANGE, (sender, evt) => {
        let cell = graph.getSelectionCell();
        context.commit(types.SET_EDITOR_SELECTION_CELL, cell);
      });
      // 从value中获取展示名
      graph.convertValueToString = function(cell) {
        return cell.value.label;
      };
      graph.valueForCellChanged = function(cell, newValue) {
        cell.value.label = newValue;
      };
      console.log('model', graph.model);
    }
  }
});
