<template>
  <div class="home">
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

export default {
  name: 'overview',
  components: {
    'tl-okr-schedule': okrSchedule,
    'tl-okr-update': okrUpdate,
    'tl-okr-risk': okrRisk,
  },
  data() {
    return {

    };
  },
  methods: {

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