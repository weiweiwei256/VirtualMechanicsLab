import * as types from '@/modules-constant.js';
import utility from '@/common/utility.js';
let SceneCodec = {
  /**
   *将jsonData解码到model
   *
   * @param {*} jsonData
   * @param {*} model
   */
  decode(jsonData, model) {
    let parentCell = model.root.children[0];
    for (let i in jsonData.bodies) {
      let mxCell = utility.generateCellData(jsonData.bodies[i].general.type, jsonData.bodies[i]);
      parentCell.insert(mxCell);
    }
    model.setRoot(model.root);
  },

  encode(model) {
    let jsonData = { bodies: [] };
    // 获取全局属性
    let newModel = new window.mxGraphModel();
    for (let i in model) {
      if (!(model[i] instanceof Object) && model[i] != newModel[i] && i != 'nextId') {
        jsonData[i] = model[i];
      }
    }
    for (let i in model.root.children[0].children) {
      let mxCell = model.root.children[0].children[i];
      let { geometry, value, type, direction } = mxCell;
      let { x, y, width, height } = geometry;
      let body = {};
      body.options = value;
      body.type = type;
      switch (type) {
        case types.RECTANGLE:
          body.x = x + width / 2;
          body.y = y + height / 2;
          body.width = width;
          body.height = height;
          break;
        case types.CIRCLE:
          let radius = width / 2;
          body.x = x + radius;
          body.y = y + radius;
          body.radius = radius;
          break;
        case types.TRIANGLE:
          body.x = x;
          body.y = y;
          body.width = width;
          body.height = height;
          body.direction = direction;
          break;
        default:
          console.error('unknown body type:' + type);
      }
      jsonData.bodies.push(body);
    }
    return jsonData;
  }
};
export default SceneCodec;
