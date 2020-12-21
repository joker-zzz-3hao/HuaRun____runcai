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
    <div> 人力成本{{setData.insideBudget+setData.outerConsultBudget}}元人民币 </div>
    <div>内部顾问成本{{setData.insideBudget}}元人民币，外部顾问成本{{setData.outerConsultBudget}}元人民币</div>
<div>确认补录工时吗?</div>
<div>确认无误后该项目已确认人力成本将发生变化</div>
  <div class="operating-box">
  <el-button

        type="primary"
        class="tl-btn amt-bg-slip"
        @click="approval"
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
import Server from '../../server';

const server = new Server();
export default {
  name: 'hoursRecord',

  data() {
    return {
      server,
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
  props: ['selection'],
  computed: {},
  mounted() {

  },
  methods: {
    show(data) {
      this.setData = data;
      this.visible = true;
    },

    approval() {
      const selection = this.selection.map((item) => ({
        projectId: item.projectId || this.$route.query.projectId,
        supplementUser: item.userId || item.userName,
        userLevel: item.userLevel,
        userPost: item.userPost,
        userType: item.belongingType || item.projectUserType,
        userCompany: item.userCompany,
        supplementTime: item.supplementTime,
        supplementTimeBegin: item.time[0],
        supplementTimeEnd: item.time[1],
        supplementContent: item.supplementContent,
        projectUserId: item.projectUserId,
        supplementUserType: item.userId ? 1 : 2,
      }));

      this.server.addSupplementTime(selection).then((res) => {
        if (res.code == '200') {
          this.$emit('success');
          this.close();
        }
      });
    },
    close() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>
