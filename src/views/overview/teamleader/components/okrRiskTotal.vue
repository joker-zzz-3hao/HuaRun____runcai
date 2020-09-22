<template>
  <div class="okrRiskTotal">
    <div class="echartLayout">
      <div id="okrRiskTotal"></div>
      <div id="okrRiskTotalbag"></div>
    </div>
    <div class="countAll">
      <ul>
        <li
          class="count"
          v-popover:popover4
          v-for="(item,index) in tableData"
          :key="index"
          @click="okrRiskUserInfo(item.riskCode);"
        >
          <em>{{item.count}}</em>
          <div class="test">{{item.riskName}}(个)</div>
          <el-progress :percentage="Number(item.ratio)" :show-text="false"></el-progress>
        </li>
      </ul>
    </div>
    <el-popover ref="popover4" placement="right" trigger="click" v-model="visible">
      <el-table :data="okrData" style="width: 100%">
        <el-table-column prop="userName" label="负责人" width="180"></el-table-column>
        <el-table-column prop="okrDetailObjectKr" label="KR名称"></el-table-column>
      </el-table>
    </el-popover>
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
      visible: false,
    };
  },
  mounted() {
    this.cheMainData();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
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
        this.visible = true;
      });
    },
    cheMainData() {
      this.aroundData = this.tableData.map((item) => ({ value: Number(item.ratio), name: `${item.ratio}%`, riskCode: item.riskCode }));

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
      myChart.resize();
      window.addEventListener('resize', myChart.resize);
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
            label: {
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
      myChart2.resize();
      window.addEventListener('resize', myChart2.resize);
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
  display: inline-block;
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
  background: #ffffff;
  box-shadow: 0 6px 16px 0 rgba(0, 11, 84, 0.04);
  border-radius: 4px;
  border-radius: 4px;
}
.countAll ul li {
  display: inline-block;
  background: #ffffff;
  border-radius: 4px;
  border-radius: 4px;
  width: 280px;
  margin-right: 40px;
  height: 144px;
}

.countAll ul li em {
  font-family: DINAlternate-Bold;
  font-size: 34px;
  color: #222426;
}
.test {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #acb6bf;
  letter-spacing: 0.23px;
}
.count {
  width: 284px;
  height: 100px;
}
</style>