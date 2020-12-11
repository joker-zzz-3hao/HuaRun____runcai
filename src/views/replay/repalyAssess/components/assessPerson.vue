<template>
<el-dialog
    :append-to-body="true"
    :visible="visible"
    @closed="closed"
    :before-close="close"
    :close-on-click-modal="false"
  >
  <div>请输入驳回原因</div>
  <el-input
  type="textarea"
  :rows="2"
  placeholder="请输入内容"
  v-model="textarea">
</el-input>
   <div>
      <el-button  type="primary" class="tl-btn amt-bg-slip">确认提交</el-button>
      <el-button  plain class="tl-btn amt-border-fadeout" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'assessPerson',
  data() {
    return {
      visible: false,
      textarea: '',
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },

};
</script>

<style>
</style>