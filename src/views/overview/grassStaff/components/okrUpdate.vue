<template>
  <div class="okrSchedule">
    <div id="okrUpdate"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { userData } from '../../testData';

export default {
  name: 'okrUpdate',
  data() {
    return {
      testModel: true,
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
      this.mainDataY = this.mainData.map((item) => item.updateProgressCount);
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
          data: that.testModel ? userData.mainpreDataX : that.mainDataX,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        yAxis: {
          type: 'value',
          min: 0,
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        series: [{
          data: that.testModel ? userData.mainpreDataY : that.mainDataY,
          name: 'okr更新次数',
          type: 'bar',
          stack: '总量',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#F4F6F8',
          },
          itemStyle: {
            normal: { color: '#FFBC20' },
          },
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
  min-height: 400px;
}
</style>