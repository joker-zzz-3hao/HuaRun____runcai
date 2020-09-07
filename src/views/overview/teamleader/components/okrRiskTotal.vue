<template>
  <div class="okrRiskTotal">
    <div id="okrRiskTotal" @click="dialogVisible=true"></div>
    <div class="countAll">
      <ul>
        <li class="count" v-for="(item,index) in tableData" :key="index">
          <em>{{item.count}}</em>
          <em>总数量(个)</em>
          <el-progress :percentage="item.ratio" :show-text="false"></el-progress>
        </li>
      </ul>
    </div>
    <el-dialog
      title="okr列表"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :modal="false"
    >
      <el-table :data="mainData" style="width: 100%">
        <el-table-column prop="userName" label="负责人" width="180"></el-table-column>
        <el-table-column prop="months" label="周期" width="180"></el-table-column>
        <el-table-column prop="address" label="OKR状态"></el-table-column>
        <el-table-column prop="updateProgressCount" label="当前进度">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.ratio"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
    mainData: {
      type: [Object, Array, String],
    },
  },
  data() {
    return {
      dialogVisible: false,
      aroundData: [],
      okrdata: [],
    };
  },
  mounted() {
    this.cheMainData();
    console.log(this.tableData);
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
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
              normal: {
                color(params) {
                  // 自定义颜色
                  const colorList = [
                    '#FFBC20', '#4CCD79', '#FB4C59',
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
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
    },
  },
};
</script>
<style  scoped>
#okrRiskTotal {
  width: 164px;
  display: inline-block;
  height: 164px;
}
.countAll {
  display: inline-block;
}
.countAll ul li {
  display: inline-block;
  background: #ffffff;
  border-radius: 4px;
  border-radius: 4px;
}
.count {
  width: 284px;
  height: 100px;
}
</style>