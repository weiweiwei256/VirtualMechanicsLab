// let demoGraphModel = new window.mxGraphModel();
// let demoCell = new window.mxCell();
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
  // getCenterOfGravityPoint(mPoints) {
  //   let area = 0.0; //多边形面积
  //   let Gx = 0.0,
  //     Gy = 0.0; // 重心的x、y
  //   for (let i = 1; i <= mPoints.length; i++) {
  //     let iLat = mPoints[i % mPoints.length].x;
  //     let iLng = mPoints[i % mPoints.length].y;
  //     let nextLat = mPoints[i - 1].x;
  //     let nextLng = mPoints[i - 1].y;
  //     let temp = (iLat * nextLng - iLng * nextLat) / 2.0;
  //     area += temp;
  //     Gx += (temp * (iLat + nextLat)) / 3.0;
  //     Gy += (temp * (iLng + nextLng)) / 3.0;
  //   }
  //   Gx = Gx / area;
  //   Gy = Gy / area;
  //   return { x: Gx, y: Gy };
  // }
};
export default utility;
// [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
