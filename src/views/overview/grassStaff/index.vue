<template>
  <div class="home">
    <tl-period @getPeriod="getPeriod"></tl-period>
    <div class="create">
      <em>陆涛</em>
    </div>
    <div class="create">
      <div>OKR当前进度数据</div>
      <tl-okr-schedule></tl-okr-schedule>
    </div>
    <div class="create">
      <div>进度更新次数趋势</div>
      <tl-okr-update></tl-okr-update>
    </div>
    <div class="create">
      <div>OKR风险状态统计</div>
      <tl-okr-risk></tl-okr-risk>
    </div>
  </div>
</template>

<script>
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
    };
  },
  methods: {
    // eslint-disable-next-line no-shadow
    getPeriod(period) {
      this.period = period;
      this.getokrStatistics();
    },
    getokrStatistics() {
      this.server.okrStatistics({
        periodId: this.period,
      }).then((res) => {
        console.log(res);
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