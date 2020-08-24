<template>
  <div class="okrRiskTotal">
    <div id="okrRiskTotal"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrRiskTotal',
  data() {
    return {

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById('okrRiskTotal'));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 335, name: '50%' },
              { value: 310, name: '70%' },
              { value: 234, name: '20%' },
              { value: 135, name: '30%' },
              { value: 1548, name: '70%' },
            ],
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>
<style  scoped>
#okrRiskTotal {
  width: 400px;
  display: block;
  height: 400px;
}
</style>