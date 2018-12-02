class MyCircle extends mxShape {
  paintVertexShape(c, x, y, w, h) {
    c.ellipse(x, y, w, h);
    c.fillAndStroke();
  }
}
mxCellRenderer.registerShape('MyCircle', MyCircle);
export default MyCircle;
