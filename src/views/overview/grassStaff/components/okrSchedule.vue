<template>
  <div id="okr-schedule-staff"></div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import Server from '../../server';
import { userData } from '../../testData';

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
  computed: {
    ...mapState('common', {
      testModel: (state) => state.testModel,

    }),
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
      //  this.mainDataX.unshift('');
      this.mainDataY = this.mainData.map((item) => item.okrProgress);
      //  this.mainDataY.unshift(0);
      this.mainDataBar = this.testModel ? userData.mainDataY.map((item) => item) : this.mainDataY;
      this.init();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okr-schedule-staff'));
      const option = {
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<div>更新进度${params.value}%</div>`;
          },
        },
        xAxis: {
          type: 'category',
          data: that.testModel ? userData.mainDataX : that.mainDataX,
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
          symbol: 'circle',
          symbolSize: 0,
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
          data: that.testModel ? userData.mainDataY : that.mainDataY,
          itemStyle: {
            color: '#3F7DFF',
          },

        }, {
          type: 'bar',
          barWidth: '10',
          itemStyle: {
            normal: { barBorderRadius: 5, color: '#3f7dff' },
          },

          data: that.testModel ? userData.mainDataY : that.mainDataY,
        }],
      };

      myChart.setOption(option);
      if (that.testModel) {
        return false;
      }
      // const checkData = that.testModel ? userData.mainDataY : that.mainDataY;
      // myChart.on('mousemove', 'series.line', (params) => {
      //   option.series[1].data[params.dataIndex] = checkData[params.dataIndex] + 20;
      //   myChart.setOption(option);
      // });
      // myChart.on('mouseout', 'series.line', (params) => {
      //   option.series[1].data[params.dataIndex] = 0;
      //   myChart.setOption(option);
      // });
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
#okr-schedule-staff {
  width: 100%;
  min-height: 400px;
}
</style>