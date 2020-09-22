<template>
  <div class="okrSchedule">
    <div>
      OKR当前进度
      <span v-show="testModel">(示例数据)</span>
    </div>
    <div id="okrSchedule"></div>
    <div>
      OKR进度更新次数
      <span v-show="testModel">(示例数据)</span>
    </div>
    <div id="okrCountUpdate"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import { mainData } from '../../testData';

export default {
  name: 'okrSchedule',
  props: {
    mainData: {
      type: [String, Object, Array],
      required: true,
    },
  },
  computed: {
    ...mapState('common', {
      testModel: (state) => state.testModel,

    }),
  },
  data() {
    return {
      mainDataY: [],
      mainDataX: [],
      mainDataYBar: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkData();
    });
  },
  methods: {
    checkData() {
      this.mainDataY = this.mainData.map((item) => item.okrProgress);
      this.mainDataX = this.mainData.map((item) => item.orgName);
      this.mainCount = this.mainData.map((item) => item.okrProgressUpdateCount);
      this.mainDataYBar = this.mainData.map(() => 0);
      this.init();
      this.initCount();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrSchedule'));
      const option = {
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<span>当前进度${params.value}%</span>`;
          },
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          boundaryGap: false,
          data: that.testModel ? mainData.mainDataX : that.mainDataX,
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
            formatter(value) {
              let ret = '';// 拼接加\n返回的类目项
              const maxLength = 4;// 每项显示文字个数
              const valLength = value.length;// X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
              if (rowN > 1)// 如果类目项的文字大于3,
              // eslint-disable-next-line brace-style
              {
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < rowN; i++) {
                  let temp = '';// 每次截取的字符串
                  const start = i * maxLength;// 开始截取的位置
                  const end = start + maxLength;// 结束截取的位置
                  // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = `${value.substring(start, end)}\n`;
                  ret += temp; // 拼接最终的字符串
                }
                return ret;
              }
              return value;
            },
          },
        },
        yAxis: {
          type: 'value',
          max: 100,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
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

        },
        series: [
          {
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
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
            data: that.testModel ? mainData.mainDataY : that.mainDataY,
            itemStyle: {
              color: '#3F7DFF',

            },

          },
          {
            type: 'bar',
            barWidth: '50',
            color: 'rgba(255,255,255,0.64)',
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,0.64)',
                shadowBlur: 400,
                shadowColor: 'rgba(0,0,0,0.50)',
              },
            },
            data: that.mainDataYBar,
          },
        ],
      };
      if (myChart._$handlers.mousemove) {
        myChart._$handlers.mousemove.length = 0;
      }
      if (myChart._$handlers.mouseout) {
        myChart._$handlers.mouseout.length = 0;
      }

      myChart.setOption(option);
      myChart.resize();
      window.addEventListener('resize', myChart.resize);
      if (that.testModel) {
        return false;
      }
      myChart.on('mousemove', 'series.line', (params) => {
        option.series[1].data[params.dataIndex] = that.mainDataY[params.dataIndex] + 20;
        myChart.setOption(option);
      });
      myChart.on('mouseout', 'series.line', (params) => {
        option.series[1].data[params.dataIndex] = 0;
        myChart.setOption(option);
      });
    },
    initCount() {
      const that = this;
      const myChartUpdate = echarts.init(document.getElementById('okrCountUpdate'));
      const option = {
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<span>更新次数${params.value}次</span>`;
          },
        },
        axisLine: {
          symbol: ['none', 'arrow'],

        },
        xAxis: {
          type: 'category',
          data: that.testModel ? mainData.mainDataX : that.mainDataX,
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
            // rotate: 40  ,//斜体展示
            formatter(value) {
              let ret = '';// 拼接加\n返回的类目项
              const maxLength = 4;// 每项显示文字个数
              const valLength = value.length;// X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
              if (rowN > 1)// 如果类目项的文字大于3,
              // eslint-disable-next-line brace-style
              {
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < rowN; i++) {
                  let temp = '';// 每次截取的字符串
                  const start = i * maxLength;// 开始截取的位置
                  const end = start + maxLength;// 结束截取的位置
                  // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = `${value.substring(start, end)}\n`;
                  ret += temp; // 拼接最终的字符串
                }
                return ret;
              }
              return value;
            },
          },
        },
        yAxis: [
          {
            splitLine: {
              show: false,
            },
            type: 'value',
            show: true,
            min: 0,
            axisLine: {
              lineStyle: {
                color: '#F4F6F8', // 颜色
                width: 1, // 粗细
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#879099', // 更改坐标轴文字颜色
                fontSize: 14, // 更改坐标轴文字大小
              },
            },
          },
        ],

        series: [{
          // eslint-disable-next-line max-len
          data: that.testModel ? mainData.mainCount : that.mainCount,
          type: 'bar',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#F4F6F8',
          },

          itemStyle: {
            emphasis: {
              barBorderRadius: 5,
            },
            normal: {
              barBorderRadius: 5,
              color: '#FFBC20',
              label: {
                show: false,
                position: 'top',
                textStyle: { // 数值样式
                  color: 'black',
                  fontSize: 12,

                },
                formatter(params) {
                  if (params.value == 0) {
                    return '';
                  }
                  return `${params.value}次`;
                },
              },
            },
          },
        }],
      };

      myChartUpdate.setOption(option);

      myChartUpdate.resize();

      window.addEventListener('resize', myChartUpdate.resize);
    },
  },
  watch: {
    mainData: {
      handler() {
        this.checkData();
      },
      deep: true,
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