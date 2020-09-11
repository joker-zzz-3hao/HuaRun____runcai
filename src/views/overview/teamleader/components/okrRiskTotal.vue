<template>
  <div class="okrRiskTotal">
    <div class="echartLayout">
      <div id="okrRiskTotal"></div>
      <div id="okrRiskTotalbag"></div>
    </div>
    <div class="countAll">
      <ul>
        <li class="count" v-for="(item,index) in tableData" :key="index">
          <em>{{item.count}}</em>
          <div>总数量(个)</div>
          <el-progress :percentage="Number(item.ratio)" :show-text="false"></el-progress>
        </li>
      </ul>
    </div>
    <el-dialog
      title="okr列表"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :modal="false"
    >
      <el-table :data="okrData" style="width: 100%">
        <el-table-column prop="userName" label="负责人" width="180"></el-table-column>
        <el-table-column prop="okrDetailObjectKr" label="KR名称"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import Server from '../../server';

const server = new Server();
export default {
  name: 'okrRiskTotal',
  props: {
    tableData: {
      type: [Object, Array, String],
    },
    mainData: {
      type: [Object, Array, String],
    },
    periodId: [String, Number],
  },
  data() {
    return {
      server,
      dialogVisible: false,
      aroundData: [],
      okrData: [],
    };
  },
  mounted() {
    this.cheMainData();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  methods: {

    okrRiskUserInfo(riskCode) {
      this.dialogVisible = true;
      this.server.okrRiskUserInfo({
        periodId: this.periodId,
        orgId: this.setOrgId,
        riskCode,
      }).then((res) => {
        this.okrData = res.data;
      });
    },
    cheMainData() {
      this.aroundData = this.tableData.map((item) => ({ value: Number(item.ratio), name: `${item.ratio}%`, riskCode: item.riskCode }));
      console.log(this.aroundData);
      if (this.tableData.length == 0) {
        this.aroundData = [{ value: 0, name: '0%', riskCode: 0 }];
      }
      this.init();
      this.initBag();
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrRiskTotal'));
      const option = {
        title: {
          text: '100%',
          left: 'center',
          top: '50%',
          textStyle: {
            color: '#000',
            fontSize: 20,
            align: 'center',
          },
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: '总量',
            textAlign: 'center',
            fill: '#B6B6B6',
            fontSize: 14,
            fontWeight: 700,
          },
        },
        series: [
          {
            name: '风险统计',
            type: 'pie',
            radius: ['30%', '40%'],
            avoidLabelOverlap: false,
            labelLine: {
              show: false,
            },
            label: { normal: { show: true, padding: [0, -30] } },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
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
      if (myChart._$handlers.click) {
        myChart._$handlers.click.length = 0;
      }
      myChart.on('click', (param) => {
        console.log(param);
        that.okrRiskUserInfo(param.data.riskCode);
      });
    },
    initBag() {
      const that = this;
      const myChart2 = echarts.init(document.getElementById('okrRiskTotalbag'));
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
          {
            name: '风险统计',
            type: 'pie',
            avoidLabelOverlap: false,
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
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

      myChart2.setOption(option);
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
.echartLayout {
  position: relative;
  width: 300px;
  height: 300px;
}
#okrRiskTotal {
  width: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 400px;
  z-index: 9999;
}
#okrRiskTotalbag {
  position: absolute;
  width: 350px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  height: 350px;
  opacity: 0.1;
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