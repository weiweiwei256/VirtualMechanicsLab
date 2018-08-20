/**
 * 重写mxGraph方法  以适应SceneEditor需求
 *
 */

mxCell.prototype.getAttribute = function(name, defaultValue) {
  var cellValue = this.getValue();
  return cellValue[name] || defaultValue;
};
mxCell.prototype.setAttribute = function(name, value) {
  var cellValue = this.getValue();
  cellValue[name] = value;
};
