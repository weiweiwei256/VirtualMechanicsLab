<template>
  <div id='running-watcher'>
    <el-form :model="watcherData" :inline="true">
      <el-form-item label="物体名称:">
        <el-select v-model="watcherData.bodyLabel" placeholder="请选择物体">
          <el-option v-for="item in bodiesList" :key="item.label" :label="item.label" :value='item.value'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据类型:">
        <el-select v-model="watcherData.dataType" placeholder="请选择物体">
          <el-option v-for="item in dataTypeOption" :key="item.label" :label="item.label" :value='item.value'></el-option>
        </el-select>
      </el-form-item>

    </el-form>

    <div ref='echarts' class='echarts-style'></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Render, Engine, Runner, Events } from 'matter-js'
import echarts from 'echarts'
export default {
  data: function () {
    return {
      watcherData: {
        bodyLabel: '',
        dataType: 'a-t'
      },
      dataTypeOption: [
        {
          value: 'a-t',
          label: 'a-t图'
        }, {
          value: 'v-t',
          label: 'v-t图'
        }, {
          value: 'x-t',
          label: 'x-t图'
        }
      ],
      watchFlag: false,
      watcher: undefined,
      watchEcharts: undefined,
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        dataZoom: [
          {
            // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,
            end: 100
          }
        ],
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
      'sceneData',
      'engine',
      'render',
      'world'
    ]),
    bodiesList: function () {
      let labelList = [];
      this.sceneData.bodies.forEach(body => {
        let { general: { label } } = body
        labelList.push({ label, value: label })
      })
      return labelList;
    }
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
  beforeMount: function () {
    console.log(this.bodiesList)
  },
  mounted: function () {
    this.watchEcharts = echarts.init(this.$refs.echarts, null, { renderer: 'svg' })
    this.watchEcharts.setOption(this.option)
    console.log(this.world)
    Events.on(this.engine, 'afterTick', (event) => {
      // console.log(this.engine.timing.timestamp)
    })
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
