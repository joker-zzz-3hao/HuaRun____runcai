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
      this.mainDataY = this.mainData.map((item) => item.updateProgressCount);
      this.mainDataX = this.mainData.map((item) => item.userName);
      this.init();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrUpdate'));
      const option = {
        xAxis: {
          type: 'category',
          data: that.mainDataX,
          axisLabel: {
            interval: 0,
            formatter(value) {
              // x轴的文字改为竖版显示
              const str = value.split('');
              return str.join('\n');
            },
          },
        },
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<div>更新次数${params.value}次</div>`;
          },
        },
        yAxis: [
          {
            type: 'value',
            show: true,
            max: 100,
            min: 0,
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