<!--
 * @Author: 王志任
 * @Date: 2019-01-28 19:48:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-08-05 17:33:07
 * @Description: file content
 * @autoAdd: true
 -->
<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible.sync="visible"
    @closed="close"
    :close-on-click-modal="false"
  >
    <img width="100%" :src="imgUrl" alt />
  </el-dialog>
</template>
<script>

export default {
  name: 'imgDialog',
  props: {
  },
  data() {
    return {
      imgUrl: '',
      visible: false,
    };
  },
  computed: {},
  created() {},
  methods: {
    show(dialogImageUrl) {
      this.visible = true;
      this.imgUrl = dialogImageUrl;
    },
    close() {
      this.imgUrl = '';
      this.visible = false;
    },
  },
};
</script>