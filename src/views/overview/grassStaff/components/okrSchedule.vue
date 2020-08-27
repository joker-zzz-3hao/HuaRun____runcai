<template>
  <div class="okrSchedule">
    <div id="okrSchedule"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import Server from '../../server';

const server = new Server();
export default {
  name: 'okrSchedule',
  data() {
    return {
      server,
    };
  },
  mounted() {
  },
  methods: {

    init() {
      const myChart = echarts.init(document.getElementById('okrSchedule'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['2020-07', '2020-08', '2020-09', '2020-10', '2020-11'],
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
            },
            show: true,
          },
        ],
        series: [{
          // eslint-disable-next-line max-len
          data: [20, 100, 50, 80, 70],
          type: 'bar',
          barWidth: 20,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)',
          },

        }],
      };

      myChart.setOption(option);
    },
  },
};
</script>
<style  scoped>
#okrSchedule {
  width: 100%;
  height: 400px;
}
</style>