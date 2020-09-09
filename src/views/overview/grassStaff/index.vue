<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod" :showBack="true"></tl-period>
    <div class="create">
      <em v-if="$route.query.name">{{decodeURI($route.query.name)}}</em>
      <em v-else>{{userInfo.userName}}</em>
      <tl-org-page :periodId="periodId"></tl-org-page>
    </div>
    <div class="create">
      <div>OKR当前进度数据</div>
      <tl-okr-schedule :mainData="mainData"></tl-okr-schedule>
    </div>
    <div class="create">
      <div>进度更新次数趋势</div>
      <tl-okr-update :mainData="mainData"></tl-okr-update>
    </div>
    <div class="create">
      <div>OKR风险状态统计</div>
      <tl-okr-risk-total :okrData="okrData"></tl-okr-risk-total>
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
    }),
  },
  methods: {
    // eslint-disable-next-line no-shadow
    getPeriod(periodId) {
      this.periodId = periodId;
      this.getokrStatistics();
      this.riskStatistics();
    },
    getokrStatistics() {
      const form = {
        periodId: this.periodId,
      };
      // eslint-disable-next-line no-unused-expressions
      this.$route.query.id ? form.user = this.$route.query.id : form.user = '';
      this.server.okrStatistics(form).then((res) => {
        this.mainData = res.data;
      });
    },
    riskStatistics() {
      this.server.riskStatistics({
        periodId: this.periodId,
        personOrOrg: 'person',
        userId: this.$route.query.id,
      }).then((res) => {
        this.okrData = res.data;
      });
    },
  },
};
</script>
<style  scoped>
.create {
  width: 100%;
  height: 400px;
  background: white;
}
</style>