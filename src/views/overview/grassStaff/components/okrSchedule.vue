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
      mainDataX: [],
      mainDataY: [],
    };
  },
  props: {
    mainData: {
      type: [Object, Array],
    },
  },
  mounted() {
    this.getmainData();
  },
  methods: {
    getmainData() {
      this.mainDataX = this.mainData.map((item) => item.months);
      this.mainDataY = this.mainData.map((item) => item.okrProgress);
      this.init();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrSchedule'));
      const option = {
        xAxis: {
          type: 'category',
          data: that.mainDataX,
        },

        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 100,
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
          data: that.mainDataY,
          type: 'bar',
          barWidth: 20,

        }],
      };

      myChart.setOption(option);
    },
  },
  watch: {
    mainData: {
      handler() {
        this.getmainData();
      },
      deep: true,
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