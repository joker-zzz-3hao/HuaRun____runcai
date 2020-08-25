<template>
  <div class="okrSchedule">
    <div id="okrSchedule"></div>
    <div id="okrCountUpdate"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrSchedule',
  data() {
    return {

    };
  },
  mounted() {
    this.init();
    this.initCount();
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById('okrSchedule'));
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['行云', '行云', '行云', '行云', '行云', '行云'],
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            barWidth: 20,
            data: [10, 30, 60, 70, 90, 100],
          },
        ],
      };

      myChart.setOption(option);
    },
    initCount() {
      const myChart = echarts.init(document.getElementById('okrCountUpdate'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['捷云', '捷云', '捷云', '捷云', '捷云', '捷云', '捷云', '捷云'],
        },
        yAxis: [
          {
            type: 'value',
            show: false,
          },
        ],
        series: [{
          // eslint-disable-next-line max-len
          data: [20, 100, 50, 80, 70, 90, 30, 20],
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
  width: 50%;
  height: 400px;
}
#okrCountUpdate {
  width: 50%;
  height: 400px;
}

.okrSchedule {
  display: flex;
  flex-direction: row;
}
</style>