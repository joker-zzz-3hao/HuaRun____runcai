<template>
  <div class="okrRiskTotal">
    <div id="okrRiskTotal"></div>
    <div class="model">
      <div>周报</div>
      <el-select placeholder="请选择">
        <el-option>2020年07月 第三周</el-option>
      </el-select>
      <el-table :data="tableData" :show-header="false" style="width: 100%">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desc" label="内容"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'okrRisk',
  data() {
    return {
      tableData: [
        {
          name: '第三周  07月20日～07月26日',
          desc: '本周心情：    平常',
          date: '提交时间：2020年7月26日 21:12  周五',
        },
        {
          name: '第三周  07月20日～07月26日',
          desc: '本周心情：    平常',
          date: '提交时间：2020年7月26日 21:12  周五',
        },
        {
          name: '第三周  07月20日～07月26日',
          desc: '本周心情：    平常',
          date: '提交时间：2020年7月26日 21:12  周五',
        },
      ],
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
          data: ['2020-7-10', '2020-7-11', '2020-7-12', '2020-7-13', '2020-7-14', '2020-7-15', '2020-7-16'],
        },
        yAxis: {
          min: 0,
          max: 4,
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value <= 1) {
                texts.push('无风险');
              } else if (value <= 2) {
                texts.push('风险可控');
              } else if (value <= 3) {
                texts.push('失控');
              }
              return texts;
            },
          },
        },
        series: [{
          name: '风险',
          type: 'line',
          data: [1, 3, 2, 3, 2, 1],
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
  width: 100%;
  display: block;
  height: 400px;
}
</style>