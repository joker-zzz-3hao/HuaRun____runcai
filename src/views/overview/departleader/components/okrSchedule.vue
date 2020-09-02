<template>
  <div class="okrSchedule">
    <div>OKR当前进度</div>
    <div id="okrSchedule"></div>
    <div>OKR进度更新次数</div>
    <div id="okrCountUpdate"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrSchedule',
  props: {
    mainData: {
      type: [String, Object, Array],
      required: true,
    },
  },
  data() {
    return {
      mainDataY: [],
      mainDataX: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkData();
    });
  },
  methods: {
    checkData() {
      this.mainDataX = this.mainData.map((item) => item.okrProgress);
      this.mainDataY = this.mainData.map((item) => item.orgName);
      this.mainCount = this.mainData.map((item) => item.okrProgressUpdateCount);
      this.init();
      this.initCount();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrSchedule'));
      const option = {
        tooltip: {
          trigger: 'item',
          position: 'right',
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
          type: 'value',
          boundaryGap: [0, 0.01],
          max: 100,
          splitNumber: 10,
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %',
          },
        },
        yAxis: {
          type: 'category',
          data: that.mainDataY,
        },
        series: [
          {
            type: 'bar',
            barWidth: 20,
            data: that.mainDataX,

          },
        ],
      };

      myChart.setOption(option);
    },
    initCount() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrCountUpdate'));
      const option = {

        axisLine: {

          symbol: ['none', 'arrow'],
        },
        xAxis: {
          type: 'category',
          data: that.mainDataY,

        },
        yAxis: [
          {
            type: 'value',
            show: false,
          },
        ],
        series: [{
          // eslint-disable-next-line max-len
          data: that.mainCount,
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            normal: {
              label: {
                show: true,
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

      myChart.setOption(option);
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