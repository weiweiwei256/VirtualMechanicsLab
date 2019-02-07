<template>
  <div id='running-watcher'>
    <el-select v-model="selectObject" placeholder="请选择物体">
    </el-select>
    <div ref='echarts' class='echarts-style'></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Render, Engine, Runner, Common } from 'matter-js'
import echarts from 'echarts'
export default {
  data: function () {
    return {
      selectObject: '',
      watchFlag: false,
      watcher: undefined,
      watchEcharts: undefined,
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        // dataZoom: [
        //   {
        //     // 这个dataZoom组件，默认控制x轴。
        //     type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        //     start: 0,
        //     end: 100
        //   }
        // ],
        legend: {
          data: ['销量', '2016']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          },
          {
            type: 'bar',
            name: '2016',
            data: [95.8, 89.4, 91.2, 76.9]
          },
          {
            type: 'line',
            name: '2017',
            data: [97.7, 83.1, 92.5, 78.1]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'render',
      'world'
    ])
  },
  watch: {
  },
  methods: {
    handleWatch: function () {
      if (this.watchFlag) {
        this.watcher = setInterval(() => {
          let body = this.world.bodies[0]
          console.log('id:' + body.id);
          console.log(' body.velocity:', body.velocity.x, body.velocity.y);
        }, 300);
      } else {
        clearInterval(this.watcher)
      }
    }
  },
  mounted: function () {
    this.watchEcharts = echarts.init(this.$refs.echarts, null, { renderer: 'svg' })
    this.watchEcharts.setOption(this.option)
  }
}
</script>

<style scoped>
.echarts-style {
  position: absolute;
  top: 40px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>
