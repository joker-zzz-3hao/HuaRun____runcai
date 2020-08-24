<template>
  <div class="okrSchedule">
    <div id="okrUpdate"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrUpdate',
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById('okrUpdate'));
      const option = {
        xAxis: {
          type: 'category',
          data: ['马', '为', '丁', '撒', '比', '腾', '王', '丁', '的', '额', '娃', '是', '磊', '特', '尔', '化', '王', 'aa', '菲', '出', '唱', 'vf', '周', 's', '景', '索', '头'],
        },
        yAxis: [
          {
            type: 'value',
            show: true,
          },
        ],
        series: [{
          // eslint-disable-next-line max-len
          data: [20, 100, 50, 80, 70, 90, 30, 20, 100, 50, 80, 70, 90, 30, 10, 100, 50, 80, 70, 100, 30, 20, 100, 50, 80, 70, 90, 30],
          type: 'bar',
          barWidth: 20,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)',
          },

        }],
      };

      myChart.setOption(option);
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