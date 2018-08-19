let demoGraphModel = new window.mxGraphModel();
let demoCell = new window.mxCell();
let utility = {
  /**
   *
   *获取对象中有用的属性。 过滤：方法，默认属性，系统分配属性
   * @param {*} obj 带遍历对象
   * @param {string} [type='']  对象类型名
   * @param {*} [ignores=[]] 系统分配和不关注属性
   * @returns
   */
  getObjUsefulProperty(obj, type = '', ignores = []) {
    let propertyMap = new Map();
    let demoObject = {};
    switch (type) {
      case 'mxGraphModel':
        demoObject = demoGraphModel;
        break;
      case 'mxCell':
        demoObject = demoCell;
        break;
      case '':
        break;
      default:
        console.log('unknown obj type:' + type);
    }
    for (let i in obj) {
      if (!(obj[i] instanceof Function) && obj[i] != demoObject[i] && !ignores.includes(i)) {
        propertyMap.set(i, obj[i]);
      }
    }
    return propertyMap;
  }
};
export default utility;
