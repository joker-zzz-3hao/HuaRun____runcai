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
  props: {
    mainData: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      mainDataY: [],
      mainDataX: [],
    };
  },
  mounted() {
    this.init();
    this.initCount();
  },
  methods: {
    checkData() {
      this.mainDataX = this.mainData.map((item) => item.okrProgress);
      this.mainDataY = this.mainData.map((item) => item.orgName);
    },
    init() {
      const that = this;
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
          data: that.mainDataY,
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            barWidth: 20,
            data: that.mainDataX,
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