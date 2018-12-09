// 重写原有方法
import { Render } from 'matter-js'
Render.bodyIds = function(render, bodies, context) {
  var c = context,
    i,
    j

  for (i = 0; i < bodies.length; i++) {
    if (!bodies[i].render.visible) continue

    var parts = bodies[i].parts
    for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
      var part = parts[j]
      c.font = '12px Arial'
      c.fillStyle = part.render.fontColor
      c.textAlign = 'center'
      c.fillText(part.label, part.position.x, part.position.y)
    }
  }
}
