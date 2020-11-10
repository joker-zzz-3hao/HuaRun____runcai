<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :before-close="close"
    @closed="closed"
    class="tl-dialog check-judge"
    width="600px"
  >
    <div slot="title" class="check-title">撤回</div>
    <el-form :model="formData" ref="dataForm" class="tl-form">
      <el-form-item
        prop="remark"
        label="撤回原因"
        :rules="[
          {
            trigger: 'blur',
            message: '撤回原因不能为空',
            required: true,
          },
        ]"
      >
        <el-input
          placeholder="请输入撤回原因，200字符以内"
          v-model="formData.remark"
          class="tl-input"
          maxlength="200"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitRecall"
        :loading="loading"
        >确定</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'recallOkr',
  props: {
    server: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        approvalId: '',
        remark: '',
      },
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    show(id) {
      this.formData.approvalId = id;
      this.dialogVisible = true;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.dialogVisible = false;
    },
    summitRecall() {
      if (this.formData.approvalId) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.server.recall(this.formData).then((res) => {
              this.loading = false;
              if (res.code == 200) {
                this.$message.success('okr已撤回');
                this.$emit('success');
                this.close();
              }
            });
          }
        });
      } else {
        this.close();
      }
    },
  },
};
</script>

<style>
</style>