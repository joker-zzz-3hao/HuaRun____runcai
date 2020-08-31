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

      <el-select v-model="calendarId" @change="changeLeek" placeholder="请选择">
        <el-option
          :key="index"
          :value="item.calendarId"
          v-for="(item,index) in dateOption"
          :label="item.weekBegin+' 至 '+item.weekEnd"
        ></el-option>
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
import { mapState } from 'vuex';
import Server from '../../server';

const server = new Server();
export default {
  name: 'okrRisk',
  props: {
    mainData: {
      type: [Object],
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
      userWeek: '',
      dateTime: '',
      dateOption: [],
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
    this.fetchData();
  },
  methods: {
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
        calendarId: this.calendarId,
        date: this.dateTime,
        userId: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
      }).then((res) => {
        this.userWeek = res.data;
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okrRiskTotal'));
      const option = {
        xAxis: {
          data: that.mainData.months,
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
          data: [['2020-07-11', 1], 3, 2, 3, 2, 1],
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