<template>
  <div class="okr-risk-total">
    <div class="echart-layout">
      <div id="okr-risk-total"></div>
      <div id="okr-risk-total-bag"></div>
    </div>
    <div class="tl-card-panel-group">
      <dl v-for="(item,index) in tableData" :key="index" @click="okrRiskUserInfo(item.riskCode);">
        <dt>{{item.count}}</dt>
        <dd>{{item.riskName}}(个)</dd>
        <dd>
          <tl-process
            :data="parseInt(item.ratio,10)"
            :showNumber="false"
            :width="30"
            :marginLeft="6"
          ></tl-process>

          <!-- <el-progress :percentage="Number(item.ratio)" :show-text="false"></el-progress> -->
        </dd>
      </dl>
    </div>
    <el-dialog
      title="okr列表"
      custom-class="update-progress"
      class="tl-dialog"
      width="600px"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <el-table class="tl-table" :data="okrData" style="width: 100%">
        <el-table-column prop="userName" label="负责人" width="180"></el-table-column>
        <el-table-column prop="okrDetailObjectKr" label="KR名称"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import process from '@/components/process';
import Server from '../../server';

const server = new Server();
export default {
  name: 'okrRiskTotal',
  components: {
    'tl-process': process,
  },
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
      visible: [],
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
      const myChart = echarts.init(document.getElementById('okr-risk-total'));
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
                    '#4CCD79', '#FFBC20', '#FB4C59',
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
      const myChart2 = echarts.init(document.getElementById('okr-risk-total-bag'));
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
                    '#4CCD79', '#FFBC20', '#FB4C59',
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