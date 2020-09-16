<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="50%"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
  >
    <div slot="title">
      <div>考核指标衡量办法</div>
    </div>
    <div>
      <!-- 考核指标 -->
      <div>
        <span>考核指标：</span>
        <em>{{checkjudgeData.checkQuota}}</em>
      </div>
      <!-- 衡量办法 -->
      <div>
        <span>衡量办法：</span>
        <em>{{checkjudgeData.judgeMethod}}</em>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'checkJudge',
  props: {
    checkjudgeData: {
      type: Object,
      defalut() {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
</style>