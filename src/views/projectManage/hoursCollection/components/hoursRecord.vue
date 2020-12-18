<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog"
  >
  <div>
    <div> 人力成本5000元人民币 </div>
    <div>内部顾问成本{{setData.insideBudget}}元人民币，外部顾问成本{{setData.outerConsultBudget}}元人民币</div>
<div>确认补录工时吗?</div>
<div>确认无误后该项目已确认人力成本将发生变化</div>
  <div class="operating-box">
  <el-button

        type="primary"
        class="tl-btn amt-bg-slip"
        @click="showhoursRecord"
        >确定</el-button
      >
      <el-button
      @click="close"
        plain
        class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
  </div>
  </div>
  </el-dialog>
</template>

<script>

import CONST from '../../const';

export default {
  name: 'hoursRecord',

  data() {
    return {
      CONST,
      visible: false,
      popoverVisible: false,
      loading: false,
      timeSheet: 0.5,
      confirmSheet: 0.5,
      info: {},
      remark: '',
      editRemark: '',
      setData: [],
    };
  },

  computed: {},
  mounted() {

  },
  methods: {
    show(data) {
      this.setData = data;
      this.visible = true;
    },

    approval() {
      this.$xconfirm({
        title: '工时确认后将不可再更改，请确认',
        content: '',
      }).then(() => {
        this.server.approvaledTimeSheetList({
          projectId: this.info.projectId,
          timeSheet: this.timeSheet,
          remark: this.remark,
          sourceId: this.info.sourceId,
          sourceType: this.info.sourceType,
          projectApprovalId: this.info.projectApprovalId,
        }).then((res) => {
          if (res.code == '200') {
            this.$emit('success');
            this.close();
          }
        });
      });
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>
