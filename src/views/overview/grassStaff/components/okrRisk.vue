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
        xAxis: {
          type: 'category',
          data: ['2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2020-13'],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
            // 这里重新定义就可以
            formatter(value) {
              const texts = [];
              if (value === 0 || value === '0') {
                texts.push('无风险');
              } else if (value === 1 || value === '1') {
                texts.push('风险可控');
              } else if (value === 2 || value === '2') {
                texts.push('无风险');
              }
              return texts;
            },
          },
        },
        series: [{
          data: ['失控', '风险可控', '无风险'],
          name: '邮件营销',
          type: 'line',
          stack: '总量',
        }],
      };

      myChart.setOption(option);
    },
  },
};
</script>
<style  scoped>
#okrRiskTotal {
  width: 100%;
  display: block;
  height: 400px;
}
</style>