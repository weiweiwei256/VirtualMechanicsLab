import * as types from '@/modules-constant.js';
import defaultProperty from '@/common/default/default-property.json';
import defaultRectangle from './default/default-rectangle.json';
import defaultCircle from './default/default-circle.json';
import defaultTriangle from './default/default-triangle.json';
let utility = {
  getMxCell(type, body = {}) {
    let mxCell = new window.mxCell();
    switch (type) {
      case types.RECTANGLE:
        var { x, y, width, height, options } = Object.assign({}, defaultRectangle, body);
        mxCell.geometry = new window.mxGeometry(x - width / 2, y - height / 2, width, height);
        mxCell.style = 'shape=rectangle';
        mxCell.value = options;
        break;
      case types.CIRCLE:
        var { x, y, radius, options } = Object.assign({}, defaultCircle, body);
        mxCell.geometry = new window.mxGeometry(x - radius, y - radius, 2 * radius, 2 * radius);
        mxCell.style = 'shape=ellipse';
        mxCell.value = options;
        break;
      case types.TRIANGLE:
        var { x, y, width, height, direction, options } = Object.assign({}, defaultTriangle, body);
        mxCell.geometry = new window.mxGeometry(x, y, width, height);
        mxCell.style = 'shape=triangle';
        mxCell.direction = direction;
        mxCell.value = options;
        break;
      default:
        console.error('unknown body type:' + type);
    }
    // 与默认属性混合
    mxCell.value = Object.assign({}, defaultProperty, mxCell.value);
    mxCell.vertex = true;
    mxCell.type = type;
    return mxCell;
  }
};
export default utility;
