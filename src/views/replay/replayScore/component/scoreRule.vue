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
    <div slot="title" class="check-title">评分说明</div>
    <dl class="check-item">
      <dt>
        <em>150分制评分模型：</em>
      </dt>
      <dd>
        <em>
          125-150 持续超越期望
          明显超出组织期望：在各方面均超越所在岗位层级的职责和绩效期望，取得杰出的成果，绩效明显高于他人，是员工的绩效标杆。
          100-124 超越期望
          在各方面均显著超越绩效目标；具体表现有：在规定的时间之前完成任务，并且完成任务的数量、质量显著超出规定的标准。
          80-99 达到期望
          整体达到并且部分超越绩效目标；具体表现有：严格按照规定的时间要求完成任务，部分工作在数量、质量上明显超出规定的标准，超过预期目标。
          61-79 部分达到期望
          一部分工作低于绩效目标，但能完成大部分的绩效目标；具体表现有：有些工作未能在规定的时间范围内达到数量、质量等预期目标。
          50-60 未达到期望
          绩效不能被接受，远未达成绩效目标；具体表现有：时常存在关键职责未履行的情况，绩效合同中的指标和工作任务基本未完成。</em
        >
      </dd>
    </dl>
    <dl class="check-item">
      <dt>
        <em>150分制评分模型：</em>
      </dt>
      <dd>
        <em>
          125-150 持续超越期望
          明显超出组织期望：在各方面均超越所在岗位层级的职责和绩效期望，取得杰出的成果，绩效明显高于他人，是员工的绩效标杆。
          100-124 超越期望
          在各方面均显著超越绩效目标；具体表现有：在规定的时间之前完成任务，并且完成任务的数量、质量显著超出规定的标准。
          80-99 达到期望
          整体达到并且部分超越绩效目标；具体表现有：严格按照规定的时间要求完成任务，部分工作在数量、质量上明显超出规定的标准，超过预期目标。
          61-79 部分达到期望
          一部分工作低于绩效目标，但能完成大部分的绩效目标；具体表现有：有些工作未能在规定的时间范围内达到数量、质量等预期目标。
          50-60 未达到期望
          绩效不能被接受，远未达成绩效目标；具体表现有：时常存在关键职责未履行的情况，绩效合同中的指标和工作任务基本未完成。</em
        >
      </dd>
    </dl>
  </el-dialog>
</template>

<script>
export default {
  name: 'scoreRule',
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