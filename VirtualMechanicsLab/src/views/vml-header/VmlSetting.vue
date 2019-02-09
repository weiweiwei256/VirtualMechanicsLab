<template>
  <div id='vml-setting'>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" title="设置" @close="dialogClose">
      <p>setting</p>
    </el-dialog>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'vml-setting',
  data: function () {
    return {
      dialogVisible: true
    }
  },
  methods: {
    dialogClose () {
      this.$emit('setting-close');
    }
  }
}
</script>

<style scoped>
</style>
