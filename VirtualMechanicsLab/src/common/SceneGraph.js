/**
 * 重写mxGraph方法  以适应SceneEditor需求
 *
 */
import MyCircle from '@/shapes/MyCircle';
mxCell.prototype.getAttribute = function(name, defaultValue) {
  let cellValue = this.getValue();
  return cellValue[name] || defaultValue;
};
mxCell.prototype.setAttribute = function(name, value) {
  let cellValue = this.getValue();
  cellValue[name] = value;
};
mxVertexHandler.prototype.singleSizer = true;
mxVertexHandler.prototype.createCustomHandles = function() {
  if (this.state.style['shape'] == 'MyCircle') {
    let firstHandle = new mxHandle(this.state);
    firstHandle.getPosition = function(bounds) {
      return new mxPoint(bounds.getCenterX(), bounds.y + 5);
    };

    firstHandle.setPosition = function(bounds, pt) {
      let pos2 = Math.max(
        0,
        Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'pos2', MyCircle.prototype.defaultPos2)))
      );

      this.state.style['pos1'] = Math.round(Math.max(0, Math.min(pos2, pt.y - bounds.y)));
    };

    firstHandle.execute = function() {
      this.copyStyle('pos1');
    };

    firstHandle.ignoreGrid = true;
    return [firstHandle];
  }
};
