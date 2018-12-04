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
