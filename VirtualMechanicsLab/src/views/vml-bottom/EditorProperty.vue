<template>
  <div id="scene-editor-property">
    <el-tabs v-if='isRootCell' value="sceneInfo" style='margin-left: 6px;margin-top: 3px'>
      <el-tab-pane label="场景信息" name="sceneInfo">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="场景名称：">
            <el-input v-model="cellData.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="场景描述：">
            <el-input v-model="cellData.description" placeholder="请输入描述" type="textarea" :rows="5"></el-input>
          </el-form-item>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="全局属性" name="globalProperty">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="重力方向x：">
            <el-input-number v-model="cellData.global.gravity.x" style='width:100%' :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="重力方向y：">
            <el-input-number v-model="cellData.global.gravity.y" style='width:100%' :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="允许旋转：">
            <el-switch v-model="cellData.global.allowRotate">
            </el-switch>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-if='!isRootCell' v-model="activeTabName" style='margin-left: 6px;margin-top: 3px'>
      <el-tab-pane label="通用属性" name="generalProperty">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="物体名称：">
            <el-input v-model="cellData.general.label" placeholder="请输入名称" @change="updateLabel"></el-input>
          </el-form-item>
          <el-form-item label="物体描述：">
            <el-input v-model="cellData.general.des" placeholder="请输入描述" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="几何属性" name="geometryProperty">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="重心x：">
            <el-input-number v-model="cellData.geometry.x" style='width:100%' @change="updateGemotry" :step="5"></el-input-number>
          </el-form-item>
          <el-form-item label="重心y：">
            <el-input-number v-model="cellData.geometry.y" style='width:100%' @change="updateGemotry" :step="5"></el-input-number>
          </el-form-item>
          <el-form-item v-if='cellType==types.RECTANGLE' label="宽度：">
            <el-input-number v-model="cellData.geometry.width" style='width:100%' @change="updateGemotry" :min="0" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item v-if='cellType==types.RECTANGLE' label="高度：">
            <el-input-number v-model="cellData.geometry.height" style='width:100%' @change="updateGemotry" :min="0" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item v-if='cellType==types.CIRCLE' label="半径：">
            <el-input-number v-model="cellData.geometry.radius" style='width:100%' @change="updateGemotry" :min="0" :step="1"></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="物理属性" name="physicalProperty">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="是否静止：">
            <el-switch v-model="cellData.physics.isStatic">
            </el-switch>
          </el-form-item>
          <el-form-item label="质量：">
            <el-input-number v-model="cellData.physics.mass" style='width:100%' :min="0" :step="1" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="摩擦力：">
            <el-slider v-model="cellData.physics.friction" :max='1' :step='0.1' show-input></el-slider>
          </el-form-item>
          <el-form-item label="恢复系数：">
            <el-slider v-model="cellData.physics.restitution" :max='1' :step='0.1' show-input></el-slider>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="条件属性" name="initialCondition">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="初始速度x：">
            <el-input-number v-model="cellData.condition.velocity.x" style='width:100%' :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="初始速度y：">
            <el-input-number v-model="cellData.condition.velocity.y" style='width:100%' :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="所受恒力x：">
            <el-input-number v-model="cellData.condition.force.x" style='width:100%' :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="所受恒力y：">
            <el-input-number v-model="cellData.condition.force.y" style='width:100%' :step="1"></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式属性" name="styleProperty">
        <el-form :model="cellData" label-width="80px" label-position="right">
          <el-form-item label="填充颜色：">
            <el-color-picker ref='colorPick' v-model="cellData.style.fillColor" @change='updateStyle'></el-color-picker>
          </el-form-item>
          <el-form-item label="字体颜色：">
            <el-color-picker v-model="cellData.style.fontColor" @change='updateStyle'></el-color-picker>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'scene-property',
  data: function () {
    return {
      types,
      activeTabName: 'generalProperty',
    }
  },
  computed: {
    ...mapGetters({ selectionCell: 'selectionCell', graph: 'editorGraph' }),
    isRootCell: function () {
      return this.selectionCell.id == '1';
    },
    cellData: function () {
      return this.selectionCell.value;
    },
    cellType: function () {
      return this.cellData.general.type;
    },
  },
  methods: {
    updateLabel: function () {
      this.graph.cellLabelChanged(this.selectionCell, this.selectionCell.value, false)
    },
    updateGemotry: function () {
      let newGeometry;
      switch (this.selectionCell.value.general.type) {
        case types.RECTANGLE:
          var { x, y, width, height } = this.selectionCell.value.geometry;
          newGeometry = new window.mxGeometry(x - width / 2, y - height / 2, width, height);
          break;
        case types.CIRCLE:
          var { x, y, radius } = this.selectionCell.value.geometry;
          newGeometry = new window.mxGeometry(x - radius, y - radius, 2 * radius, 2 * radius);
          break;
        default:
      }
      this.graph.getModel().setGeometry(this.selectionCell, newGeometry)
    },
    updateStyle: function () {
      let style = this.graph.getModel().getStyle(this.selectionCell)
      style = mxUtils.setStyle(style, 'fillColor', this.selectionCell.value.style.fillColor)
      style = mxUtils.setStyle(style, 'fontColor', this.selectionCell.value.style.fontColor)
      this.graph.getModel().setStyle(this.selectionCell, style)
    }
  },
}
</script>

<style>
#scene-editor-property /deep/ .el-form-item {
  margin-bottom: 5px;
}
#scene-editor-property /deep/ .el-form-item__label {
  padding-right: 0px;
  height: 100%;
}
#scene-editor-property /deep/ .el-form-item__content {
  margin-right: 10px;
  height: 100%;
}
</style>
