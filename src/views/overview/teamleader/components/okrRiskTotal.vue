<template>
  <div class="okrRiskTotal">
    <div id="okrRiskTotal"></div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrRiskTotal',
  props: {
    tableData: {
      type: [Object, Array, String],
    },
  },
  data() {
    return {
      aroundData: [],
    };
  },
  mounted() {
    this.cheMainData();
  },
  methods: {
    cheMainData() {
      this.aroundData = this.tableData.map((item) => ({ value: item.count, name: item.ratio }));
      this.init();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrRiskTotal'));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
          {
            name: '风险统计',
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
            data: that.aroundData,
          },
        ],
      };

      myChart.setOption(option);
    },
  },
  watch: {
    tableData: {
      handler() {
        this.cheMainData();
      },
      deep: true,
      immediate: true,
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