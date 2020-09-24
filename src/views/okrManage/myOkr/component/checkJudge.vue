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
    <div slot="title" class="check-title">考核指标与衡量办法</div>
    <dl class="check-item">
      <dt>
        <em>考核指标</em>
      </dt>
      <dd>
        <em>{{checkjudgeData.checkQuota}}</em>
      </dd>
    </dl>
    <dl class="check-item">
      <dt>
        <em>衡量办法</em>
      </dt>
      <dd>
        <em>{{checkjudgeData.judgeMethod}}</em>
      </dd>
    </dl>
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