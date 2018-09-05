<template>
  <div id="scene-editor-property">
    <el-input placeholder="请输入名称" v-model="label" @blur="modifyAttribute('label')">
      <template slot="prepend">名称：</template>
    </el-input>
    <el-row>
      <el-col :span="4">
        <p>静止:</p>
      </el-col>
      <el-col :span="20">
        <el-switch v-model="isStatic" @change="modifyAttribute('isStatic')">
        </el-switch>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <p>质量:</p>
      </el-col>
      <el-col :span="20">
        <el-input-number v-model="mass" @change="modifyAttribute('mass')" :min="0" :step="1" :precision="2" controls-position="right"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <p>摩擦力:</p>
      </el-col>
      <el-col :span="20">
        <el-input-number v-model="friction" @change="modifyAttribute('friction')" :min="0" :max="1" :step="0.1" :precision="2" controls-position="right"></el-input-number>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <p>恢复系数:</p>
      </el-col>
      <el-col :span="20">
        <el-input-number v-model="restitution" @change="modifyAttribute('restitution')" :min="0" :max="1" :step="0.1" :precision="2" controls-position="right"></el-input-number>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as types from '@/modules-constant.js'
import utility from '@/common/utility.js'
import defaultProperty from '@/common/default/default-property.json'
import { mapGetters, mapMutations, mapActions } from 'vuex'
let options = defaultProperty.options;
export default {
  name: 'scene-property',
  data: function () {
    return {
      label: "Body",
      isStatic: false,
      mass: 1,
      friction: 0.1,
      restitution: 0,
    }
  },
  computed: {
    ...mapGetters({ selectionCell: 'editorSelectionCell', graph: 'editorGraph' })
  },
  watch: {
    selectionCell: function (newCell, oldCell) {
      // reset
      this.label = options.label;
      this.isStatic = options.isStatic;
      this.mass = options.mass;
      this.friction = options.friction;
      this.restitution = options.restitution;
      if (newCell) {
        let value = newCell.value;
        this.label = value.label || this.label
        this.isStatic = value.isStatic || this.isStatic
        this.mass = value.mass || this.mass
        this.friction = value.friction || this.friction
        this.restitution = value.restitution || this.restitution
      }
    }
  },
  methods: {
    modifyAttribute: function (attrName) {
      let oldValue = this.selectionCell.getAttribute(attrName, options[attrName]);
      let newValue = this[attrName]
      if (newValue != oldValue) {
        this.graph.getModel().beginUpdate();
        try {
          let edit = new mxCellAttributeChange(
            this.selectionCell, attrName,
            newValue);
          this.graph.getModel().execute(edit);
        }
        finally {
          this.graph.getModel().endUpdate();
        }
      }
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style>
</style>
