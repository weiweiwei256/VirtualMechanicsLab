<template>
  <div id='outline'></div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'editor-outline',
  computed: {
    ...mapGetters(['editorGraph'])
  },
  methods: {
    outlineInit: function () {
      new mxOutline(this.editorGraph, $('#outline')[0]);
    }
  },
  mounted: function () {
  }
}
</script>

<style>
#outline {
  position: absolute;
  width: 98px;
  height: 98px;
  bottom: 0px;
  border-style: groove;
}
</style>
