class MyCircle extends mxShape {
  paintVertexShape(c, x, y, w, h) {
    let radius = Math.min(w, h);
    c.ellipse(x, y, radius, radius);
    c.fillAndStroke();
  }
}
mxCellRenderer.registerShape('MyCircle', MyCircle);
export default MyCircle;
