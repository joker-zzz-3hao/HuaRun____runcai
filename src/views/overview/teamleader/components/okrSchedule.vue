<template>
  <div class="okrSchedule">
    <div id="okrSchedule"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { teamData } from '../../testData';

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
      testModel: false,
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
          data: that.testModel ? teamData.mainDataX : that.mainDataX,
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
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
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
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
        ],
        series: [{
          // eslint-disable-next-line max-len
          data: that.testModel ? teamData.mainDataY : that.mainDataY,
          type: 'bar',
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
#okrSchedule {
  width: 100%;
  height: 400px;
}
</style>