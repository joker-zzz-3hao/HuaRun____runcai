<template>
  <div>
    <div class="tl-card-panel">
      <div class="card-panel-inside">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR当前进度</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <div class="card-panel-body">
          <div id="okrSchedule"></div>
        </div>
      </div>
    </div>
    <div class="tl-card-panel">
      <div class="card-panel-inside">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR进度更新次数</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <div class="card-panel-body">
          <div id="okrCountUpdate"></div>
        </div>
      </div>
    </div>
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
    //  this.mainData.sort((a, b) => a.okrProgress - b.okrProgress);
      this.mainDataY = this.mainData.map((item) => item.okrProgress);
      this.mainDataX = this.mainData.map((item) => item.orgName);
      // this.mainDataY.unshift(0);
      // this.mainDataX.unshift('');
      this.mainCount = this.mainData.map((item) => item.okrProgressUpdateCount);
      // eslint-disable-next-line max-len
      this.mainDataYBar = this.testModel ? mainData.mainDataY.map((item) => item) : this.mainData.map((item) => item.okrProgress);
      // eslint-disable-next-line no-unused-expressions
      // this.testModel ? '' : this.mainDataYBar.unshift(0);
      this.init();
      this.initCount();
    },
    init() {
      const that = this;
      // eslint-disable-next-line no-unused-vars
      let endLength;
      if (that.mainDataX.length > 9) {
        endLength = (100 / that.mainDataX.length).toFixed(2) * 9;
      } else {
        endLength = 100;
      }

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

        dataZoom: [{
          type: 'slider', // slider表示有滑动块的，inside表示内置的
          // startValue: 8,//可用于设置开始显示的柱子的长度
          // endValue: 1,//可用于设置结束显示的柱子的长度
          show: that.mainDataX.length > 9 && !that.testModel,
          xAxisIndex: [0],
          handleSize: 0, // 滑动条的 左右2个滑动条的大小
          height: 12, // 组件高度
          left: '0%', // 左边的距离
          right: '0%', // 右边的距离
          bottom: -3, // 右边的距离
          borderColor: '#F4F4F4',
          fillerColor: '#E7E7E7',
          backgroundColor: '#F4F4F4', // 两边未选中的滑动条区域的颜色
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          handleColor: '#FFBC20',
          // eslint-disable-next-line no-dupe-keys
          start: 0,
          // eslint-disable-next-line no-dupe-keys
          end: endLength,
          handleStyle: {
            borderRadius: '20',
            background: '#F4F6F8',
          },
        }],
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
            // formatter(value) {
            //   let ret = '';// 拼接加\n返回的类目项
            //   const maxLength = 4;// 每项显示文字个数
            //   const valLength = value.length;// X轴类目项的文字个数
            //   const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
            //   if (rowN > 1)// 如果类目项的文字大于3,
            //   // eslint-disable-next-line brace-style
            //   {
            //     // eslint-disable-next-line no-plusplus
            //     for (let i = 0; i < rowN; i++) {
            //       let temp = '';// 每次截取的字符串
            //       const start = i * maxLength;// 开始截取的位置
            //       const end = start + maxLength;// 结束截取的位置
            //       // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            //       temp = `${value.substring(start, end)}...`;
            //       ret = temp; // 拼接最终的字符串
            //     }
            //     return ret;
            //   }
            //   return value;
            // },
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
            data: that.testModel ? mainData.mainDataY : that.mainDataY,
            itemStyle: {
              color: '#3F7DFF',

            },

          },
          {
            type: 'bar',
            barWidth: '10',
            itemStyle: {
              emphasis: {
                barBorderRadius: 5,
              },
              normal: {
                barBorderRadius: 5,
                color: '#3f7dff',
                label: {
                  show: false,
                  position: 'top',
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 12,

                  },

                },
              },
            },

            data: that.mainDataYBar,
          },
        ],
      };

      myChart.setOption(option);
      myChart.resize();
      window.addEventListener('resize', myChart.resize);
    },
    initCount() {
      const that = this;
      const myChartUpdate = echarts.init(document.getElementById('okrCountUpdate'));
      let endLength;
      if (that.mainDataX.length > 9) {
        endLength = (100 / that.mainDataX.length).toFixed(2) * 9;
      } else {
        endLength = 100;
      }
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
            // formatter(value) {
            //   let ret = '';// 拼接加\n返回的类目项
            //   const maxLength = 4;// 每项显示文字个数
            //   const valLength = value.length;// X轴类目项的文字个数
            //   const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
            //   if (rowN > 1)// 如果类目项的文字大于3,
            //   // eslint-disable-next-line brace-style
            //   {
            //     // eslint-disable-next-line no-plusplus
            //     for (let i = 0; i < rowN; i++) {
            //       let temp = '';// 每次截取的字符串
            //       const start = i * maxLength;// 开始截取的位置
            //       const end = start + maxLength;// 结束截取的位置
            //       // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            //       temp = `${value.substring(start, end)}...`;
            //       ret = temp; // 拼接最终的字符串
            //     }
            //     return ret;
            //   }
            //   return value;
            // },
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
        dataZoom: [{
          type: 'slider', // slider表示有滑动块的，inside表示内置的
          // startValue: 8,//可用于设置开始显示的柱子的长度
          // endValue: 1,//可用于设置结束显示的柱子的长度
          show: that.mainDataX.length > 9 && !that.testModel,
          xAxisIndex: [0],
          handleSize: 0, // 滑动条的 左右2个滑动条的大小
          height: 12, // 组件高度
          left: '0', // 左边的距离
          right: '0', // 右边的距离
          bottom: -3, // 右边的距离
          borderColor: '#F4F4F4',
          fillerColor: '#E7E7E7',
          backgroundColor: '#F4F4F4', // 两边未选中的滑动条区域的颜色
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          handleColor: '#FFBC20',
          // eslint-disable-next-line no-dupe-keys
          start: 0,
          // eslint-disable-next-line no-dupe-keys
          end: endLength,
          handleStyle: {
            borderRadius: '20',
            background: '#F4F6F8',
          },
        }],
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