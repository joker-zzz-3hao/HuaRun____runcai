<template>
  <div id="okr-update"></div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import { teamData } from '../../testData';

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
  computed: {
    ...mapState('common', {
      testModel: (state) => state.testModel,
    }),
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
      const myChart = echarts.init(document.getElementById('okr-update'));
      let endLength;
      if (that.mainDataX.length > 9) {
        endLength = (100 / that.mainDataX.length).toFixed(2) * 9;
      } else {
        endLength = 100;
      }
      const option = {
        xAxis: {
          type: 'category',
          data: that.testModel ? teamData.mainDatapreX : that.mainDataX,
          axisLabel: {
            interval: 0,
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
            min: 0,
            splitLine: {
              show: false,
            },
            axisLabel: {
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
          bottom: -2, // 右边的距离
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
          end: that.testModel ? 100 : endLength,
          handleStyle: {
            borderRadius: '20',
            background: '#F4F6F8',
          },
        }],
        series: [{
          // eslint-disable-next-line max-len
          data: that.testModel ? teamData.mainDatapreY : that.mainDataY,
          type: 'bar',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#F4F6F8',
          },
          itemStyle: {
            normal: { barBorderRadius: 5, color: '#3F7DFF' },
          },
        }],
      };

      myChart.setOption(option);
      myChart.resize();
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