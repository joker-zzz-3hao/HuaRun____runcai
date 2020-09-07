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
          boundaryGap: false,
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

        yAxis: [
          {
            type: 'value',
            min: 0,
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
            show: true,
          },
        ],
        series: [{
          type: 'line',
          smooth: true,
          symbolSize: 10,

          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1, [{
                  offset: 0,
                  color: '#3F7DFF',
                },
                {
                  offset: 1,
                  color: 'rgba(100,178,237,0.1)',
                },
                ],
              ),
            },
          },
          data: that.mainDataY,
          itemStyle: {
            color: '#3F7DFF',
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