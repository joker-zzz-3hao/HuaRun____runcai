<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
    width="1000px"
    :modal="true"
    :modal-append-to-body="true"
    @closed="closed"
  >
    <div slot="title" class="check-title">请输入驳回原因</div>
    <el-form :model="formData" ref="dataForm" class="tl-form">
      <el-form-item
        prop="remark"
        label="驳回原因"
        :rules="[
          {
            trigger: 'blur',
            message: '驳回原因',
            required: true,
          },
        ]"
      >
        <el-input
          placeholder="请输入驳回原因，200字符以内"
          v-model="formData.remark"
          class="tl-input"
          maxlength="200"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="tl-btn amt-bg-slip" @click="submit"
        >确认提交</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'assessRefuse',
  data() {
    return {
      visible: false,
      formData: { remark: '' },
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$refs.dataForm.resetFields();
    },
    closed() {
      this.$emit('update:exist', false);
    },
    submit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log(this.formData.remark, 4);
          this.$emit('success', this.formData.remark, 4);
          this.close();
        }
      });
    },
  },

};
</script>

<style>
</style>