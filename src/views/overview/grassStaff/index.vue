<template>
  <div class="staff-view">
    <el-tag
      v-show="testModel"
      type="success"
      style="margin-bottom: 10px; width: 100%"
      size="medium"
      :hit="true"
      >该周期暂无内容。以下为示例数据内容，润才提供综合数据视图，多种维度可视化报告，帮助管理者与个人关注目标的合理性与团队能力</el-tag
    >
    <div class="cont-area">
      <tl-org-page :periodId="periodId"></tl-org-page>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR当前进度数据</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
      </div>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>进度更新次数趋势</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <tl-okr-update :mainData="mainData"></tl-okr-update>
      </div>

      <tl-okr-risk-total :okrData="okrData"></tl-okr-risk-total>

      <tl-period @getPeriod="getPeriod" :showBack="true"></tl-period>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import okrRiskTotal from './components/okrRiskTotal';
import period from '../component/period';
import orgPage from '../component/orgPage';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'overview',
  components: {
    'tl-org-page': orgPage,
    'tl-okr-schedule': okrSchedule,
    'tl-okr-update': okrUpdate,
    'tl-okr-risk-total': okrRiskTotal,
    'tl-period': period,
  },
  data() {
    return {
      periodId: '',
      server,
      CONST,
      mainData: [],
      userWeek: [],
      calendarId: '',
      dateTime: '',
      okrData: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  methods: {
    // 切换周期修改主页数据
    getPeriod(periodId) {
      this.periodId = periodId;
      this.getokrStatistics();
      this.riskStatistics();
    },
    // 获去普通员工okr进度与更新统计
    getokrStatistics() {
      const form = {
        periodId: this.periodId,
        orgId: this.$route.query.orgId ? this.$route.query.orgId : this.userInfo.orgId,
      };
      // eslint-disable-next-line no-unused-expressions
      this.$route.query.id ? form.user = this.$route.query.id : form.user = '';
      this.server.okrStatistics(form).then((res) => {
        this.mainData = res.data;
      });
    },
    riskStatistics() {
      if (!this.periodId) {
        return false;
      }
      this.server.riskStatistics({
        periodId: this.periodId,
        personOrOrg: 'person',
        userId: this.$route.query.userId,
      }).then((res) => {
        if (res.code == 200) {
          this.okrData = res.data;
        }
      });
    },
  },
};
</script>
<style  scoped>
.el-tag.el-tag--success.is-hit {
  border-color: #f5c28e;
}

.el-tag.el-tag--success {
  background-color: #f6eee4;
  border-color: #f5c28e;
  color: #d99328;
}
</style>