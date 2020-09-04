<template>
  <div class="okrSchedule">
    <div id="okrSchedule"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrSchedule',
  props: {
    mainData: {
      type: [Array, String, Object],
    },
  },
  data() {
    return {
      mainDataY: [],
      mainDataX: [],
    };
  },
  mounted() {
    this.getmainData();
  },
  methods: {
    getmainData() {
      this.mainDataY = this.mainData.map((item) => item.okrProgress);
      this.mainDataX = this.mainData.map((item) => item.userName);
      this.init();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrSchedule'));
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
            return `<div>当前进度${params.value}%</div>`;
          },
        },
        yAxis: [
          {
            type: 'value',
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