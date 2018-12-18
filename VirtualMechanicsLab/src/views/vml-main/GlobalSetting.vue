<template>
  <el-dialog title="设置" :visible.sync="showSetting" width="30%" center>
    <span>需要注意的是内容是默认不居中的</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSetting">取 消</el-button>
      <el-button type="primary" @click="saveSetting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as types from '@/modules-constant.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'global-setting',
  data: function () {
    return {}
  },
  computed: {
    ...mapGetters(['showSetting'])
  },
  methods: {
    ...mapMutations({
      'setShowSetting': types.SET_SHOW_SETTING
    }),
    cancelSetting: function () {
      this.setShowSetting(false)
    },
    saveSetting: function () {
      this.setShowSetting(false)
    }
  }
}
</script>

<style>
</style>

