<template>
  <div class="weeking">
    <div class="model">
      <div>OKR风险状态统计</div>
      <el-select placeholder="请选择" v-model="periodId" @change="getriskStatistics">
        <el-option
          v-for="item in options"
          :key="item.id"
          :value="item.periodId"
          :label="item.periodName"
        ></el-option>
      </el-select>
      <div id="weeking"></div>
      <ul>
        <li
          v-for="(item,index) in orgTable"
          @click="changIdAction(item.id)"
          :key="index"
        >{{item.orgName}}</li>
      </ul>
    </div>
    <div class="model">
      <div>周报动态</div>
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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="orgName" label="部门"></el-table-column>
        <el-table-column prop="orgNumber" label="部门人数"></el-table-column>
        <el-table-column label="标准/简单模式">
          <template slot-scope="scope">
            <span>{{scope.row.weeklyType0Number}}/{{scope.row.weeklyType1Number}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="visitSum" label="浏览次数"></el-table-column>
        <el-table-column prop="visitUserNumber" label="浏览人数"></el-table-column>
        <el-table-column prop="orgAdminUserName" label="负责人"></el-table-column>
      </el-table>
    </div>
    <div class="model">
      <div>员工情绪大屏</div>
      <div>
        <el-select placeholder="请选择">
          <el-option :key="1" :value="1">2020年07月 第三周</el-option>
        </el-select>
      </div>
      <div id="mood"></div>
      <ul>
        <li>开心</li>
        <li>沮丧</li>
        <li>平常</li>
      </ul>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import Server from '../../server';

const server = new Server();
export default {
  name: 'weeking',
  props: {
    orgTable: {
      type: [String, Object, Array],
      require: true,
    },
  },
  data() {
    return {
      periodId: '',
      value: '',
      server,
      userId: '',
      calendarId: '',
      dateTime: '',
      options: [],
      dateOption: [],
      echartDataY: [],
      echartDataX: [],
      tableData: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.fetchData();
    this.initMood();
    this.getokrQuery();
  },
  methods: {
    changeLeek() {
      this.orgWeekly();
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
    orgWeekly() {
      this.server.orgWeekly({
        calendarId: this.calendarId,
        date: this.dateTime,
        userId: this.userInfo.userId,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    changIdAction(id) {
      this.userId = id;
      this.getriskStatistics();
    },
    getokrQuery() {
      this.server.okrQuery().then((res) => {
        this.options = res.data.content;
        this.periodId = this.options[0].periodId;
        this.getriskStatistics();
      });
    },
    getriskStatistics() {
      this.server.riskStatistics({
        periodId: this.periodId,
        orgId: this.userInfo.orgId,
        userId: this.userId,
        personOrOrg: 'org',
      }).then((res) => {
        this.echartDataY = res.data.datas.map((item) => item.allScore);
        this.echartDataX = res.data.months;
        this.init();
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('weeking'));
      const option = {
        xAxis: {
          data: that.echartDataX,
        },
        yAxis: {
          min: 0,
          max: 4,
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log(1);
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
          data: that.echartDataY,
        },
        ],
      };

      myChart.setOption(option);
    },
    initMood() {
      const myChart = echarts.init(document.getElementById('mood'));
      const option = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
            {
              product: '行云', 2015: 43.3, 2016: 85.8, 2017: 93.7,
            },
            {
              product: '门户', 2015: 83.1, 2016: 73.4, 2017: 55.1,
            },
            {
              product: '盘云', 2015: 86.4, 2016: 65.2, 2017: 82.5,
            },
            {
              product: '大云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
            {
              product: '天云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
            {
              product: '容云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
            {
              product: '多云', 2015: 72.4, 2016: 53.9, 2017: 39.1,
            },
          ],
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' },
        ],
      };

      myChart.setOption(option);
    },
    orgEmotion() {
      this.server.orgEmotion({
        calendarId: this.calendarId,
        date: this.dateTime,
        userId: this.userInfo.userId,
      }).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
<style  scoped>
#weeking {
  width: 100%;
  height: 400px;
}

.model {
  width: 100%;
  min-height: 200px;
  background: white;
  margin-bottom: 30px;
}

#mood {
  width: 100%;
  height: 400px;
}
</style>