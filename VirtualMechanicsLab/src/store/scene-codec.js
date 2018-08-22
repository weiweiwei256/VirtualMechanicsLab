import * as types from '@/modules-constant.js';
let SceneCodec = {
  /**
   *将jsonData解码到model
   *
   * @param {*} jsonData
   * @param {*} model
   */
  decode(jsonData, model) {
    // 1.0 将全局信息设置到model
    for (let i in jsonData) {
      if (!(jsonData[i] instanceof Object)) {
        model[i] = jsonData[i];
      }
    }
    // 2.0 将物体设置为mxCell
    let parentCell = model.root.children[0];
    for (let i in jsonData.bodies) {
      let mxCell = new window.mxCell();
      let { type } = jsonData.bodies[i];
      let { x, y, radius, width, height, options } = jsonData.bodies[i];
      let geometry;
      switch (type) {
        case types.RECTANGLE:
          geometry = new window.mxGeometry(x - width / 2, y - height / 2, width, height);
          mxCell.style = 'shape=rectangle';
          break;
        case types.CIRCLE:
          geometry = new window.mxGeometry(x - radius, y - radius, 2 * radius, 2 * radius);
          mxCell.style = 'shape=ellipse';
          break;
        default:
          console.error('unknown body type' + type);
      }
      mxCell.geometry = geometry;
      mxCell.vertex = true;
      mxCell.type = type;
      mxCell.value = options;
      parentCell.insert(mxCell);
    }
    model.setRoot(model.root);
  },

  encode(model) {
    let jsonData = { name: '', description: '', bodies: [] };
    // 获取全局属性
    let newModel = new window.mxGraphModel();
    for (let i in model) {
      if (!(model[i] instanceof Object) && model[i] != newModel[i] && i != 'nextId') {
        jsonData[i] = model[i];
      }
    }
    for (let i in model.root.children[0].children) {
      let mxCell = model.root.children[0].children[i];
      let { geometry, value, type } = mxCell;
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
        default:
          console.error('unknown body type' + type);
      }
      jsonData.bodies.push(body);
    }
    return jsonData;
  }
};
export default SceneCodec;
