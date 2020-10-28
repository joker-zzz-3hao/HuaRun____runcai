<template>
  <div>
    <div id="echartsdiv" :style="{width: '300px', height: '120px'}"></div>
  </div>
</template>

<script>
export default {
  name: '',
  mounted() {
    this.myEcharts();
  },
  methods: {
    myEcharts() {
      const option = {
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            roseType: 'angle',
            data: [
              { value: 235, name: '视频广告' },
              { value: 274, name: '联盟广告' },
              { value: 310, name: '邮件营销' },
              { value: 335, name: '直接访问' },
              { value: 400, name: '搜索引擎' },
            ],
          },
        ],
      };
      const myChart = this.$echarts.init(document.getElementById('echartsdiv'));
      myChart.setOption(option);
    },
  },
};
</script>

<style>
</style>