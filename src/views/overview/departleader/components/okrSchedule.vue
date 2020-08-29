<template>
  <div class="okrSchedule">
    <div id="okrSchedule"></div>
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
      require: true,
    },
  },
  data() {
    return {
      mainDataY: [],
      mainDataX: [],
    };
  },
  mounted() {
    this.checkData();
  },
  methods: {
    checkData() {
      this.mainDataX = this.mainData.map((item) => item.okrProgress);
      this.mainDataY = this.mainData.map((item) => item.orgName);
      this.mainCount = this.mainData.map((item) => item.okrChangeCount);
      this.init();
      this.initCount();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrSchedule'));
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
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
      immediate: true,
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