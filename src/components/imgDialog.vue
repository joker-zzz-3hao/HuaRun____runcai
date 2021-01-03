<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible.sync="visible"
    @closed="close"
    :close-on-click-modal="true"
    :append-to-body="true"
    :modal-append-to-body="false"
    class="tl-dialog"
    custom-class="custom-drawer img-dialog"
  >
    <el-scrollbar>
      <img :src="imgUrl" alt />
    </el-scrollbar>
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
