<!--
  功能：
  作者：王志任
  时间：2020年12月02日 15:22:31
  备注：
-->
<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :title="dicTitle"
    :close-on-click-modal="false"
    width="70%"
  >
    jajj
  </el-dialog>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      dicTitle: '',
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>