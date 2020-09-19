<template>
  <div class="okrSchedule">
    <div id="okrUpdate"></div>
  </div>
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
      const myChart = echarts.init(document.getElementById('okrUpdate'));
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
            normal: { color: '#3F7DFF' },
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