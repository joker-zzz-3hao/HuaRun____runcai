<template>
  <div class="okrRiskTotal">
    <div id="okrRiskTotal"></div>
    <div class="model">
      <div>周报</div>
      <el-date-picker
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-model="dateTime"
        @change="getDate"
        type="month"
        :clearable="false"
        placeholder="选择日期"
      ></el-date-picker>
      <el-table :data="tableData" :show-header="false" style="width: 100%">
        <el-table-column label="周报">
          <template slot-scope="scope">
            <span>{{scope.row.weekBegin}}~{{scope.row.weekEnd}}</span>
          </template>
        </el-table-column>
        <el-table-column label="本周心情">
          <template slot-scope="scope">
            <span
              v-if="scope.row.weeklyEmotion"
            >本周心情:{{CONST.WEEKLYEMOTION[scope.row.weeklyEmotion]}}</span>
            <span v-else>未填写</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime">提交时间:{{scope.row.updateTime}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import Server from '../../server';
import CONST from '../../const';

const server = new Server();
export default {
  name: 'okrRisk',
  props: {
    okrData: {
      type: [Object, Array, String],
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
    }),
  },
  data() {
    return {
      calendarId: '',
      CONST,
      server,
      dateTime: '',
      dateOption: [],
      tableData: [],
      echartDataX: [],
      echartDataY: [],
    };
  },
  mounted() {
    this.fetchData();
  //  this.changeTime();
  },
  methods: {
    changeTime() {
      const echartData = JSON.parse(JSON.stringify(this.okrData));
      this.echartDataX = [];
      const startDate = `${echartData.months[0]}-01`;

      const endtDate = `${echartData.months.pop()}-31`;
      const cheTime = new Date(endtDate).getTime() - new Date(startDate).getTime();
      const oneDay = 24 * 3600 * 1000;
      let startche = +new Date(startDate) - oneDay;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < cheTime / oneDay; i++) {
        // eslint-disable-next-line no-const-assign
        startche += oneDay;
        const now = new Date(startche);
        let months = '';
        let day = '';
        if (now.getMonth() < 9) {
          months = `0${now.getMonth() + 1}`;
        } else {
          months = now.getMonth() + 1;
        }
        if (now.getDate() < 9) {
          day = `0${now.getDate()}`;
        } else {
          day = now.getDate();
        }
        this.echartDataX.push([now.getFullYear(), months, day].join('-'));
      }

      if (echartData.datas) {
        const echartDataFil = echartData.datas.filter((item) => item);
        this.echartDataY = {
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          showAllSymbol: true,
          data: echartDataFil.map((item) => [item.createDate, item.allScore]),
          itemStyle: {
            color: '#3F7DFF',
          },
        };
      } else {
        this.echartDataY = {
          type: 'line',
          symbolSize: 10,
          symbol: 'circle',
          showAllSymbol: true,
          itemStyle: {
            color: '#3F7DFF',
          },
          data: [],
        };
      }
      this.init();
    },
    changeLeek() {
      this.userWeekly();
    },
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.getDate(this.dateTime);
    },
    getDate(date) {
      this.calendarQurey(`${date}-01`);
    },
    calendarQurey(date) {
      this.server.calendarQurey(
        {
          date,
        },
      ).then((res) => {
        this.dateOption = res.data;
        this.calendarId = res.data[0].calendarId;
        this.changeLeek();
      });
    },
    userWeekly() {
      this.server.userWeekly({
        date: `${this.dateTime}-01`,
        userId: this.$route.query.id ? this.$route.query.id : '',
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrRiskTotal'));
      const option = {
        xAxis: {
          data: that.echartDataX,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            if (params.value[1] == 1) {
              return `${params.value[0]},无风险`;
            } if (params.value[1] == 4) {
              return `${params.value[0]},风险可控`;
            } if (params.value[1] == 7) {
              return `${params.value[0]},失控`;
            }
          },
        },
        yAxis: {
          min: 0,
          max: 7,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#F4F6F8'],
              width: 1,
              type: 'solid',
            },
          },
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log(0);
              } else if (value == 1) {
                texts.push('无风险');
              } else if (value == 4) {
                texts.push('风险可控');
              } else if (value == 7) {
                texts.push('失控');
              }
              return texts;
            },
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        series: [
          that.echartDataY,
        ],
      };

      myChart.setOption(option);
    },
  },
  watch: {
    okrData: {
      handler() {
        this.changeTime();
      },
      deep: true,
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