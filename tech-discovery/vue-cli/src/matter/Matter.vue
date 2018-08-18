<template>
  <div id="matter-container">
    <div id='matter-render'>

    </div>
    <div id='operation'>
      <el-button @click='handleAdd'>add object</el-button>
      <span>view x:</span>
      <el-slider v-model="viewPort.max.x"
                 :max='1920'></el-slider>
      <span>view y:</span>
      <el-slider v-model="viewPort.max.y"
                 :max='1080'></el-slider>
    </div>
  </div>
</template>

<script>
import { Engine, Render, World, Bodies, Events, MouseConstraint, Composite, Bounds, Vertices } from 'matter-js'
export default {
  name: 'Matter',
  data: function () {
    return {
      engine: null,
      render: null,
      renderDom: null,
      viewPort: {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      }
    }
  },
  watch: {
    viewPort: {
      handler: function () {
        Render.lookAt(this.render, this.viewPort);
      },
      deep: true
    }
  },
  methods: {
    handleAdd: function () {
    }
  },
  mounted () {
    this.renderDom = $('#matter-render')[0]
    console.log([this.renderDom])
    this.engine = Engine.create();
    this.render = Render.create({
      element: this.renderDom,
      engine: this.engine
    });
    let boxA = Bodies.rectangle(400, 200, 80, 80);
    let boxB = Bodies.rectangle(450, 50, 80, 80);
    let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    World.add(this.engine.world, [boxA, boxB, ground]);
    //选中监听  暂只支持选中body  
    // TODO: 1. 由于element渲染后 元素大小改变导致鼠标位置不准  matter-render放在前面  寻找更好solution
    //       2. 视野改变未加入的事件中 得自己处理  
    //         先通过树选中
    Events.on(MouseConstraint.create(this.engine), 'mousedown', (event) => {
      let mousePosition = event.mouse.mousedownPosition
      let bodies = Composite.allBodies(this.engine.world)
      for (let i = 0; i < bodies.length; i++) {
        let body = bodies[i]
        if (
          Bounds.contains(body.bounds, mousePosition) &&
          Vertices.contains(body.vertices, mousePosition)
        ) {
          console.log(body)
        }
      }
    })
    Render.lookAt(this.render, this.viewPort);
    // 渲染运行
    Engine.run(this.engine);
    Render.run(this.render);
  },
}
</script>

<style scoped>
</style>
