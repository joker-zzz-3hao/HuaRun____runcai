<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod" :showBack="true"></tl-period>
    <div class="create">
      <em v-if="$route.query.name">{{decodeURI($route.query.name)}}</em>
      <em v-else>{{userInfo.userName}}</em>
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
      <tl-okr-risk :okrData="okrData"></tl-okr-risk>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrSchedule from './components/okrSchedule';
import okrUpdate from './components/okrUpdate';
import okrRisk from './components/okrRisk';
import period from '../component/period';
import Server from '../server';

const server = new Server();
export default {
  name: 'overview',
  components: {
    'tl-okr-schedule': okrSchedule,
    'tl-okr-update': okrUpdate,
    'tl-okr-risk': okrRisk,
    'tl-period': period,
  },
  data() {
    return {
      period: '',
      server,
      mainData: {},
      userWeek: [],
      calendarId: '',
      dateTime: '',
      okrData: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    // eslint-disable-next-line no-shadow
    getPeriod(period) {
      this.period = period;
      this.getokrStatistics();
      this.riskStatistics();
    },
    getokrStatistics() {
      this.server.okrStatistics({
        periodId: this.period,
        user: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
        userId: '',
      }).then((res) => {
        this.mainData = res.data;
      });
    },
    riskStatistics() {
      this.server.riskStatistics({
        periodId: this.period,
        orgId: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
        personOrOrg: 'org',
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