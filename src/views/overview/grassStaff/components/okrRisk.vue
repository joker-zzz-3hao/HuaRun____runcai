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
            <span v-if="scope.row.weeklyEmotion">本周心情:{{scope.row.weeklyEmotion}}</span>
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

const server = new Server();
export default {
  name: 'okrRisk',
  props: {
    okrData: {
      type: [Object, Array],
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  data() {
    return {
      calendarId: '',
      server,
      dateTime: '',
      dateOption: [],
      tableData: [],
      okrDataX: [],
    };
  },
  mounted() {
    this.fetchData();
    this.changeTime();
  },
  methods: {
    changeTime() {
      if (this.okrData.datas) {
        this.okrDataX = this.okrData.datas.map((item) => [item.createDate, item.allScore]);
      }
      this.init();
    },
    changeLeek() {
      this.userWeekly();
    },
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
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
        userId: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrRiskTotal'));
      const option = {
        xAxis: {
          data: that.okrData.months,
        },
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `${params.value}%`;
          },
        },
        yAxis: {
          min: 0,
          max: 4,
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log(0);
              } else if (value <= 1) {
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
          data: that.okrDataX,
        },
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