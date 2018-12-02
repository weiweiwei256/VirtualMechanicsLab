import * as types from '@/modules-constant.js';
import defaultProperty from '@/common/default/default-property.json';
import defaultRectangle from './default/default-rectangle.json';
import defaultCircle from './default/default-circle.json';
import defaultTriangle from './default/default-triangle.json';
let utility = {
  generateCellData(type, body = {}) {
    let mxCell = new window.mxCell();
    mxCell.vertex = true;
    mxCell.value = body;
    // 物理属性混合
    mxCell.value.physics = Object.assign({}, defaultProperty, mxCell.value.physics);
    let { general, geometry, physics, condition, style } = body;
    switch (type) {
      case types.RECTANGLE:
        var { x, y, width, height } = geometry;
        mxCell.geometry = new window.mxGeometry(x - width / 2, y - height / 2, width, height);
        mxCell.style = 'shape=rectangle';
        break;
      case types.CIRCLE:
        var { x, y, radius } = geometry;
        mxCell.geometry = new window.mxGeometry(x - radius, y - radius, 2 * radius, 2 * radius);
        mxCell.style = 'shape=MyCircle';
        break;
      default:
        console.error('unknown body type:' + type);
    }
    return mxCell;
  }
};
export default utility;
