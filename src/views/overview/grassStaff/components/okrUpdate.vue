<template>
  <div class="okrSchedule">
    <div id="okrUpdate"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrUpdate',
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById('okrUpdate'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2020-13'],
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: [10, 39, 40, 50, 100, 20, 20],
          name: '邮件营销',
          type: 'line',
          stack: '总量',
        }],
      };

      myChart.setOption(option);
    },
  },
};
</script>
<style  scoped>
#okrUpdate {
  width: 100%;
  height: 400px;
}
</style>