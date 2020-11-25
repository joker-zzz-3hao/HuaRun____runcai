<!--
  功能：
  作者：王志任
  时间：2020年11月24日 15:55:47
  备注：
-->
<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :before-close="close"
    @closed="closed"
    :visible.sync="visible"
    custom-class="custom-drawer supporting-values"
    class="tl-drawer"
  >
    ffff
  </el-drawer>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      visible: false,
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:showProject', false);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
