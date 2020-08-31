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
      mainDataY: [],
      mainDataX: [],
    };
  },
  props: {
    mainData: {
      type: [Array, String, Object],
    },
  },
  mounted() {
    this.getmainData();
  },
  methods: {
    getmainData() {
      this.mainDataY = this.mainData.map((item) => item.okrProgressUpdateCount);
      this.mainDataX = this.mainData.map((item) => item.orgName);
      this.init();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrUpdate'));
      const option = {
        xAxis: {
          type: 'category',
          data: that.mainDataX,
        },
        yAxis: [
          {
            type: 'value',
            show: true,
            max: 100,
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
#okrUpdate {
  width: 100%;
  height: 400px;
}
</style>