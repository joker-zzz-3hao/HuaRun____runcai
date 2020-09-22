<template>
  <div class="team-view">
    <div class="cont-area">
      <tl-org-page :periodId="periodId"></tl-org-page>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR当前进度</em>
            <span v-show="testModel">(示例数据)</span>
          </div>
        </div>
        <div class="card-panel-body">
          <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
        </div>
      </div>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR进度更新榜</em>
            <span v-show="testModel">(示例数据)</span>
          </div>
        </div>
        <div class="card-panel-body">
          <tl-okr-update :mainData="mainData"></tl-okr-update>
        </div>
      </div>
      <div class="tl-card-panel">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR风险状态统计</em>
            <span>部门成员的OKR风险状态总数，点击可以查看对应的OKR列表</span>
            <span v-show="testModel">(示例数据)</span>
          </div>
        </div>
        <div class="card-panel-body">
          <tl-okr-risk-total
            :tableData="tableData"
            :mainData="mainData"
            :periodId="periodId"
            :setOrgId="setOrgId"
          ></tl-okr-risk-total>
        </div>
      </div>
      <tl-weeking></tl-weeking>
    </div>
    <tl-period @getPeriod="getPeriod" :showBack="true"></tl-period>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Server from '../server';
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import okrRiskTotal from './components/okrRiskTotal';
import weeking from './components/weeking';
import periodcom from '../component/period';
import orgPage from '../component/orgPage';
import { teamData } from '../testData';

const server = new Server();
export default {
  name: 'teamleader',
  components: {
    'tl-okr-schedule': okrSchedule,
    'tl-okr-update': okrUpdate,
    'tl-okr-risk-total': okrRiskTotal,
    'tl-weeking': weeking,
    'tl-period': periodcom,
    'tl-org-page': orgPage,
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  data() {
    return {
      server,
      orgUser: [],
      tableData: [],
      periodId: '',
      mainData: [],
      orgId: '',
      orgTable: [],
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.orgId = this.$route.query.id;
    } else {
      this.orgId = this.setOrgId;
    }
    // this.getqueryMyOkr();
  },
  methods: {
    checkName(name) {
      return name.substring(0, 1);
    },
    getokrData() {
      this.server.okrData({
        periodId: this.periodId,
        orgId: this.orgId,
      }).then((res) => {
        this.mainData = res.data;
      });
    },
    getokrRisk() {
      if (!this.periodId) {
        this.tableData = this.testModel ? teamData.roundData.data : [];
        return false;
      }
      this.server.okrRisk({
        periodId: this.periodId,
        orgId: this.orgId,
      }).then((res) => {
        this.tableData = this.testModel ? teamData.roundData.data : res.data;
      });
    },
    // eslint-disable-next-line no-shadow
    getPeriod(periodId) {
      this.periodId = periodId;
      this.getokrRisk();
      this.getokrData();
    },

  },
};
</script>