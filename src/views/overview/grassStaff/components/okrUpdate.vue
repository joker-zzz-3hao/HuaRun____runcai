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
      const myChart = echarts.init(document.getElementById('okrUpdate'));
      const option = {
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<div>更新次数${params.value}</div>`;
          },
        },
        xAxis: {
          type: 'category',
          data: that.mainDataX,
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
        },
        series: [{
          data: that.mainDataY,
          name: 'okr更新次数',
          type: 'line',
          stack: '总量',
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